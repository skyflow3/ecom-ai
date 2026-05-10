/**
 * Purpose: Server-side geolocation proxy — bypasses browser CORS/Origin blocking.
 * WHY: External geo APIs (ipwhois.app, ipapi.co) return 403 when the browser
 *      sends an Origin header. This route proxies the request server-side where
 *      no Origin header exists, then returns clean JSON to the client.
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // WHY: Forward the caller's IP to the geo API.
  //      Next.js on Coolify puts the real IP in x-forwarded-for.
  const forwarded = request.headers.get('x-forwarded-for');
  const callerIp = forwarded ? forwarded.split(',')[0].trim() : '';

  const apis = [
    {
      url: callerIp
        ? `https://ipwhois.app/json/${callerIp}?lang=en`
        : 'https://ipwhois.app/json/?lang=en',
      extract: (d: Record<string, unknown>) => ({
        country: d.country_code as string,
        region: d.region as string,
        city: d.city as string,
      }),
    },
    {
      url: 'https://geolocation-db.com/json/',
      extract: (d: Record<string, unknown>) => ({
        country: d.country_code as string,
        region: d.state as string,
        city: d.city as string,
      }),
    },
  ];

  for (const api of apis) {
    try {
      const res = await fetch(api.url, {
        headers: { 'User-Agent': 'ECOM-AI-GeoProxy/1.0' },
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) continue;

      const data = await res.json();
      const loc = api.extract(data);

      if (!loc.country) continue;

      return NextResponse.json({
        country: loc.country,
        region: loc.region || '',
        city: loc.city || '',
      });
    } catch {
      continue;
    }
  }

  return NextResponse.json({ country: '', region: '', city: '' }, { status: 200 });
}
