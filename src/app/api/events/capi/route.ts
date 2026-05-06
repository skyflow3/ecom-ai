/**
 * Purpose: POST /api/events/capi — Meta Conversions API (server-side tracking)
 * Dependencies: drizzle-orm, zod, schema (pixelConfigs, events, funnelSteps, pageVariants)
 * Related: src/db/schema/core.ts (pixelConfigs), Meta CAPI v18.0 docs
 *
 * WHY: Browser ad blockers kill the Meta Pixel JS. Server-side CAPI ensures
 *      conversion data reaches Meta even with blockers. Meta recommends both
 *      pixel + CAPI with eventId-based deduplication.
 *
 * FLOW: variantId → lookup funnel → lookup pixelConfig → hash user data → POST to Meta
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createHash } from 'crypto';
import { db } from '@/lib/db';
import { pixelConfigs, events, funnelSteps, pageVariants } from '@/db/schema';
import { eq } from 'drizzle-orm';

// ─── Constants ───────────────────────────────────────────────────────────────

const META_CAPI_VERSION = 'v18.0';
const META_CAPI_BASE = `https://graph.facebook.com/${META_CAPI_VERSION}`;
const HASH_ALGORITHM = 'sha256';

// WHY: Meta requires lowercase + trimmed values before hashing
function normalizeValue(value: string): string {
  return value.trim().toLowerCase();
}

// WHY: Meta CAPI requires SHA-256 hashed user data for privacy
//      https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
function hashSha256(value: string): string {
  return createHash(HASH_ALGORITHM).update(value).digest('hex');
}

// WHY: Email normalization per Meta spec — trim + lowercase + remove mailto:
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase().replace(/^mailto:/, '');
}

// WHY: Phone normalization per Meta spec — remove +, -, (), spaces, country code leading zeros
function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)\+\.]/g, '').replace(/^0+/, '');
}

// ─── Request Schema ──────────────────────────────────────────────────────────

const META_CAPI_EVENTS = [
  'ViewContent',
  'AddToCart',
  'InitiateCheckout',
  'Purchase',
  'Lead',
] as const;

const capiRequestSchema = z.object({
  variantId: z.string().uuid(),
  event: z.enum(META_CAPI_EVENTS),
  userData: z.object({
    email: z.string().email().optional(),
    phone: z.string().min(5).optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    ip: z.string().optional(),
    userAgent: z.string().optional(),
    fbp: z.string().optional(), // Facebook browser pixel cookie
    fbc: z.string().optional(), // Facebook click ID
  }),
  customData: z
    .object({
      value: z.number().positive().optional(),
      currency: z.string().length(3).default('USD'),
      contentName: z.string().optional(),
      contentIds: z.array(z.string()).optional(),
      numItems: z.number().int().positive().optional(),
    })
    .optional(),
  eventId: z.string().optional(), // For dedup with browser pixel
});

type CapiRequestBody = z.infer<typeof capiRequestSchema>;

// ─── Funnel Lookup ───────────────────────────────────────────────────────────
// WHY: variantId → stepId → funnelId → pixelConfigs.
//      We need the funnel's pixel config to know which pixel to send to.

async function getPixelConfigForVariant(
  variantId: string,
): Promise<{ pixelId: string; accessToken: string; testEventCode: string | null } | null> {
  // Look up variant → step
  const variant = await db.query.pageVariants.findFirst({
    where: eq(pageVariants.id, variantId),
    columns: { stepId: true },
  });

  if (!variant) return null;

  // Look up step → funnelId
  const step = await db.query.funnelSteps.findFirst({
    where: eq(funnelSteps.id, variant.stepId),
    columns: { funnelId: true },
  });

  if (!step) return null;

  // Look up pixel config for this funnel
  const pixel = await db.query.pixelConfigs.findFirst({
    where: eq(pixelConfigs.funnelId, step.funnelId),
  });

  if (!pixel) return null;

  return {
    pixelId: pixel.pixelId,
    accessToken: pixel.accessToken,
    testEventCode: pixel.testEventCode ?? null,
  };
}

// ─── Build Meta CAPI Payload ─────────────────────────────────────────────────

interface MetaUserData {
  em?: string[];  // hashed email
  ph?: string[];  // hashed phone
  fn?: string[];  // hashed first name
  ln?: string[];  // hashed last name
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string;
  fbc?: string;
}

function buildUserData(userData: CapiRequestBody['userData']): MetaUserData {
  const hashed: MetaUserData = {};

  if (userData.email) {
    hashed.em = [hashSha256(normalizeEmail(userData.email))];
  }
  if (userData.phone) {
    hashed.ph = [hashSha256(normalizePhone(userData.phone))];
  }
  if (userData.firstName) {
    hashed.fn = [hashSha256(normalizeValue(userData.firstName))];
  }
  if (userData.lastName) {
    hashed.ln = [hashSha256(normalizeValue(userData.lastName))];
  }
  if (userData.ip) {
    hashed.client_ip_address = userData.ip;
  }
  if (userData.userAgent) {
    hashed.client_user_agent = userData.userAgent;
  }
  if (userData.fbp) {
    hashed.fbp = userData.fbp;
  }
  if (userData.fbc) {
    hashed.fbc = userData.fbc;
  }

  return hashed;
}

function buildCustomData(
  customData: CapiRequestBody['customData'],
): Record<string, unknown> {
  if (!customData) return {};

  const result: Record<string, unknown> = {};

  if (customData.value != null) {
    result.value = customData.value;
  }
  if (customData.currency) {
    result.currency = customData.currency;
  }
  if (customData.contentName) {
    result.content_name = customData.contentName;
  }
  if (customData.contentIds?.length) {
    result.content_ids = customData.contentIds;
  }
  if (customData.numItems != null) {
    result.num_items = customData.numItems;
  }

  return result;
}

// ─── Send to Meta ────────────────────────────────────────────────────────────

interface MetaCapiResponse {
  success: boolean;
  eventId?: string;
  metaEventId?: string;
  error?: string;
  warning?: string;
}

async function sendToMetaCapi(
  pixelId: string,
  accessToken: string,
  testEventCode: string | null,
  payload: Record<string, unknown>,
): Promise<{ metaEventId?: string; error?: string }> {
  const url = `${META_CAPI_BASE}/${pixelId}/events`;

  const body: Record<string, unknown> = {
    data: [payload],
    access_token: accessToken,
  };

  // WHY: test_event_code is only used in dev/test — Meta validates but doesn't process
  if (testEventCode) {
    body.test_event_code = testEventCode;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  if (!response.ok) {
    const errorMsg = result?.error?.message ?? `Meta API ${response.status}`;
    return { error: errorMsg };
  }

  // Meta returns event_id per event in the batch
  const metaEventId = result?.events_received?.[0]?.id;
  return { metaEventId };
}

// ─── Log CAPI Event ──────────────────────────────────────────────────────────

async function logCapiEvent(
  variantId: string,
  event: string,
  eventId: string,
  metaResult: { metaEventId?: string; error?: string },
  payload: Record<string, unknown>,
): Promise<void> {
  try {
    // WHY: Map Meta CAPI events to valid DB enum values.
    // 'Lead' maps to 'ViewContent' (closest semantic match — both are pre-purchase engagement).
    // The actual CAPI event name is preserved in payload.capiEvent for accurate reporting.
    const EVENT_TO_DB: Record<string, string> = {
      ViewContent: 'ViewContent',
      AddToCart: 'AddToCart',
      InitiateCheckout: 'InitiateCheckout',
      Purchase: 'Purchase',
      Lead: 'ViewContent', // WHY: No 'Lead' in enum — mapped, real name in payload
    };
    const dbEventType = EVENT_TO_DB[event] ?? 'ViewContent';

    await db.insert(events).values({
      eventType: dbEventType as 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase' | 'PageView' | 'click' | 'scroll' | 'form_submit',
      eventId: `capi:${eventId}`,
      variantId,
      payload: {
        capiSend: true, // WHY: Flag to distinguish CAPI events from client events
        capiEvent: event,
        eventId,
        success: !metaResult.error,
        metaEventId: metaResult.metaEventId,
        error: metaResult.error,
        // WHY: Don't log raw user data — only log metadata for debugging
        customDataKeys: Object.keys((payload as { custom_data?: Record<string, unknown> }).custom_data ?? {}),
        userDataKeys: Object.keys((payload as { user_data?: Record<string, unknown> }).user_data ?? {}),
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    // WHY: Logging failure must not fail the CAPI request — best-effort audit trail
  }
}

// ─── POST Handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = capiRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { variantId, event, userData, customData, eventId } = parsed.data;

    // Generate dedup-safe event ID if not provided
    const dedupEventId = eventId ?? `${variantId}:${event}:${Date.now()}`;

    // 1. Look up pixel config for this variant's funnel
    const pixelConfig = await getPixelConfigForVariant(variantId);

    if (!pixelConfig) {
      // WHY: No pixel config = this funnel doesn't have Meta tracking set up.
      // Return success so the client doesn't retry, but flag as skipped.
      return NextResponse.json({
        success: true,
        eventId: dedupEventId,
        warning: 'No pixel config found for this funnel. Event not sent to Meta.',
      });
    }

    // 2. Build Meta CAPI payload
    const metaPayload: Record<string, unknown> = {
      event_name: event,
      event_time: Math.floor(Date.now() / 1000),
      event_id: dedupEventId,
      event_source_url: request.headers.get('referer') ?? undefined,
      action_source: 'website',
      user_data: buildUserData(userData),
      custom_data: buildCustomData(customData),
    };

    // Remove undefined values — Meta rejects null/undefined in payload
    const cleanPayload = Object.fromEntries(
      Object.entries(metaPayload).filter(([, v]) => v !== undefined),
    );

    // 3. Send to Meta CAPI
    const metaResult = await sendToMetaCapi(
      pixelConfig.pixelId,
      pixelConfig.accessToken,
      pixelConfig.testEventCode,
      cleanPayload,
    );

    // 4. Log the CAPI send (best-effort audit trail)
    await logCapiEvent(variantId, event, dedupEventId, metaResult, cleanPayload);

    // 5. Return result
    const response: MetaCapiResponse = {
      success: !metaResult.error,
      eventId: dedupEventId,
    };

    if (metaResult.metaEventId) {
      response.metaEventId = metaResult.metaEventId;
    }
    if (metaResult.error) {
      response.error = metaResult.error;
    }

    return NextResponse.json(response, {
      status: metaResult.error ? 502 : 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

// ─── OPTIONS (CORS preflight) ────────────────────────────────────────────────

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
