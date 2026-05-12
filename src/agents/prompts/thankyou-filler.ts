/**
 * Purpose: Thank You Page Template Filler — generates TEXT content for post-purchase confirmation page.
 *          Takes a product/brand brief → outputs a JSON ContentMap for the template engine.
 *          Pricing/image/URL values come from the brief (NOT AI-generated).
 *
 * Dependencies: templates/thank-you-page-smoothspine.html.json (slot config)
 * Related: template-engine.ts (consumes output), template-generator.ts (orchestrates)
 *
 * WHY: Thank you pages are POST-PURCHASE confirmation. The visitor just BOUGHT.
 *      They need: order confirmation, next steps (video, community, guide), and support info.
 *      The AI generates short headlines, messages, and CTAs. Most content is from the brief.
 *
 * THANK YOU PAGE PSYCHOLOGY:
 *   - The visitor is in a "post-purchase high" — they feel good about their decision.
 *   - The page must: (1) confirm + reassure, (2) set expectations, (3) offer value-adds.
 *   - Survey, video, community, and user guide sections can be removed if not needed.
 *   - Tone: warm, grateful, reassuring. NOT salesy — they already bought.
 *   - Section markers (SECTION_SURVEY, SECTION_VIDEO, SECTION_COMMUNITY, SECTION_USERGUIDE)
 *     allow conditional removal of entire sections.
 */

import type { ProductBrief } from './template-filler';

// ─── ThankYou Brief ────────────────────────────────────────────────────────────

/**
 * Extended brief for thank you pages.
 * WHY: Thank you pages need brand identity, support info, and section visibility flags
 *      that regular product pages don't have.
 */
export interface ThankYouBrief extends ProductBrief {
  /** Brand name for billing disclaimer and support */
  brandName: string;
  /** Name that appears on billing statement (can differ from brand name, e.g., "Serenova Digital LLC") */
  billingName: string;
  /** Support email (displayed in header, footer, mailto links) */
  supportEmail: string;
  /** Support phone number */
  supportPhone: string;
  /** Logo click URL (usually homepage or shop) */
  logoLinkUrl: string;
  /** Country flag image URL */
  flagImageUrl: string;
  /** Hero/thank you banner image URL */
  heroImageUrl: string;
  /** Product image URL for content area */
  productImageUrl: string;
  /** User guide image 1 URL */
  guideImage1Url: string;
  /** User guide image 2 URL */
  guideImage2Url: string;
  /** Community/group banner image URL */
  communityImageUrl: string;
  /** Trust badge image 1 URL */
  trustBadge1Url: string;
  /** Trust badge image 2 URL */
  trustBadge2Url: string;
  /** Survey form URL (Typeform, Google Forms, etc.) */
  surveyUrl: string;
  /** Community join URL (Facebook group, Discord, etc.) */
  communityUrl: string;
  /** Terms & Conditions page URL */
  termsUrl: string;
  /** Privacy Policy page URL */
  privacyUrl: string;
  /** Refund/Return Policy page URL */
  refundUrl: string;
  /** Analytics/tracking script URL */
  trackingScriptUrl: string;
  /** Product name for user guide section */
  userguideProductName: string;
  /** Shipping method description */
  shippingMethod: string;
  /** Whether to show survey section. Default: true */
  showSurvey?: boolean;
  /** Whether to show video section. Default: true */
  showVideo?: boolean;
  /** Whether to show community section. Default: true */
  showCommunity?: boolean;
  /** Whether to show user guide section. Default: true */
  showUserGuide?: boolean;
}

// ─── Main Prompt Builder ──────────────────────────────────────────────────────

export function buildThankYouFillerPrompt(brief: ProductBrief): string {
  const tb = brief as ThankYouBrief;
  const brandName = tb.brandName || tb.name;
  const showSurvey = tb.showSurvey !== false;
  const showVideo = tb.showVideo !== false;
  const showCommunity = tb.showCommunity !== false;
  const showUserGuide = tb.showUserGuide !== false;

  return `You are an ELITE e-commerce thank you page copywriter. You specialize in POST-PURCHASE confirmation pages that build trust, reduce buyer's remorse, and drive engagement with value-add content.

## YOUR TASK
Generate TEXT content for a thank you / order confirmation page.
The visitor JUST completed a purchase. They need confirmation, reassurance, and next steps.

## PRODUCT INFO
- Product: ${brief.name}
- Brand: ${brandName}
- Niche: ${brief.niche}
- Target Audience: ${brief.targetAudience}

## PAGE PSYCHOLOGY
The visitor is in a "post-purchase high." Your job is to:
1. CONFIRM their order clearly and confidently
2. REASSURE them they made a smart choice
3. SET EXPECTATIONS for what happens next
4. INVITE them to engage further (survey, community, guide)
5. PROVIDE support contact for any concerns

TONE: Warm, grateful, reassuring. NOT salesy — they already bought.
VOICE: Like a helpful customer success manager. Professional but human.

## CONTENT RULES

### Confirmation
- confirmation_headline: Short, confident. "Order Confirmed" or "Your Order Is Confirmed!"
- confirmation_message: Reassuring. Mention they'll get an email with details. 1-2 sentences.
- change_request_notice: Practical deadline info. "For any change requests, contact us within X hours." This shows you're responsive.

### Survey Section (${showSurvey ? 'VISIBLE' : 'HIDDEN — leave slots empty'})
${showSurvey ? `- survey_question: Friendly ask. "Do you have 2 minutes to answer a quick anonymous survey?" Keep it short.
- survey_incentive: What they get. "You'll receive a special discount code for future orders!" Concrete reward.
- survey_cta_text: Action-oriented. "Yes, I want the discount code!" or "Take the 2-minute survey"` : '- Leave all survey slots as empty strings.'}

### Video Section (${showVideo ? 'VISIBLE' : 'HIDDEN — leave slots empty'})
${showVideo ? `- video_headline: Helpful framing. "Watch this video to learn how to use your product" or "Quick start guide — watch before your order arrives"` : '- Leave video_headline as empty string.'}

### Community Section (${showCommunity ? 'VISIBLE' : 'HIDDEN — leave slots empty'})
${showCommunity ? `- community_headline: Aspirational claim. What RESULT can they achieve? "FIX YOUR [PROBLEM] AT HOME IN 30 DAYS" — bold, uppercase, outcome-focused. NOT "Join our community" (too generic).
- community_cta_text: Strong action. ALL CAPS. "JOIN OUR FREE COMMUNITY NOW" or "GET INSTANT ACCESS"` : '- Leave all community slots as empty strings.'}

### Support Section
- support_headline: Warm and available. "We're Here To Help You" or "Need Help? We've Got You Covered"
- support_message: Friendly. "Please feel free to contact us at:" — short, welcoming.
- continue_shopping_text: Simple. "Continue Shopping" or "Back to Store"

### Legal
- consent_text: Marketing consent + legal disclaimer. Include [Brand] placeholder which will be replaced. Format: "By filling out the field, you consent for [Brand] to use automated technology including pre-recorded messages, SMS, and emails to contact you at the number and email provided above regarding your order and for marketing purposes. Consent is not required for purchase."
- page_title: SEO title. "Thank You — Your Order Is Confirmed" or "Order Confirmed — [Brand]"

## OUTPUT FORMAT
Output a SINGLE JSON object. Each value is a string. No markdown, no code fences.

## SLOTS TO FILL (TEXT ONLY)
{
  "page_title": "SEO page title. 5-12 words. Include brand or product name. Example: Thank You — Your Order Is Confirmed",
  "confirmation_headline": "Main confirmation headline. 2-5 words. Confident and clear. Example: Order Confirmed",
  "confirmation_message": "Reassurance message. Mention email with details. 1-2 sentences, 15-25 words. Example: You'll receive a confirmation email with your order details shortly.",
  "change_request_notice": "Deadline for order changes. Practical, not threatening. 1-2 sentences, 15-30 words. Example: For any change requests please make sure to contact us within 6 hours of placing your order.",
  "survey_question": "${showSurvey ? 'Friendly survey ask. 1 sentence, 8-15 words. Example: Do you have 2 minutes to answer an anonymous survey?' : 'IGNORE — leave empty string.'}",
  "survey_incentive": "${showSurvey ? 'Reward for completing survey. 1 sentence, 8-15 words. Example: You will receive a special discount code valid on future orders!' : 'IGNORE — leave empty string.'}",
  "survey_cta_text": "${showSurvey ? 'Survey button text. Action + reward. 5-10 words. Example: Yes, I want the discount code!' : 'IGNORE — leave empty string.'}",
  "video_headline": "${showVideo ? 'Video section headline. Helpful framing. 8-15 words. Example: Please watch this video to know how to use your product' : 'IGNORE — leave empty string.'}",
  "community_headline": "${showCommunity ? 'Aspirational community headline. ALL CAPS. Bold outcome claim. 5-10 words. Example: FIX YOUR SCIATICA AT HOME IN 30 DAYS' : 'IGNORE — leave empty string.'}",
  "community_cta_text": "${showCommunity ? 'Community join button. ALL CAPS. Strong action. 4-8 words. Example: JOIN OUR FREE COMMUNITY NOW' : 'IGNORE — leave empty string.'}",
  "continue_shopping_text": "Continue shopping button. Simple. 2-4 words. Example: Continue Shopping",
  "support_headline": "Support section title. Warm and available. 3-6 words. Example: We are Here To Help You",
  "support_message": "Support intro text. Friendly. 5-10 words. Example: Please feel free to contact us at:",
  "consent_text": "Marketing consent + legal disclaimer. 2-3 sentences. Use [Brand] as placeholder. Example: By filling out the field, you consent for [Brand] to use automated technology including pre-recorded messages, SMS, and emails to contact you at the number and email provided above regarding your order and for marketing purposes. Consent is not required for purchase."
}

## CRITICAL RULES
1. Output ONLY the JSON object. No markdown, no code fences, no explanation.
2. Every string must be properly escaped for JSON.
3. Do NOT generate pricing, URL, image, or email values — those come from the brief.
4. Keep all text SHORT — thank you pages are scanned, not read. Each slot = 1-2 sentences max.
5. ${showCommunity ? 'community_headline must be ALL CAPS with a bold outcome claim.' : 'Community section is hidden — leave those slots empty.'}
6. ${showSurvey ? 'survey_cta_text must be action-oriented with a clear reward.' : 'Survey section is hidden — leave those slots empty.'}
7. NO country-specific references — the product may be sold globally.`;
}
