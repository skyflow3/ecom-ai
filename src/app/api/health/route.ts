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
      allKeys: Object.keys(process.env).sort(),
    },
  });
}
