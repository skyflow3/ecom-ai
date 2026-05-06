/**
 * Purpose: Health check endpoint for Coolify/Docker monitoring
 * Dependencies: none
 * Related: coolify.json, Dockerfile
 */

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "0.1.0",
    debug: {
      hasDb: !!process.env.DATABASE_URL,
      dbPrefix: process.env.DATABASE_URL?.substring(0, 30) || "NOT SET",
      hasClerk: !!process.env.CLERK_SECRET_KEY,
      hasClerkPub: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      envKeys: Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('CLERK') || k.includes('NODE_ENV')).sort(),
    },
  });
}
