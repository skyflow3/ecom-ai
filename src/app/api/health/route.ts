/**
 * Purpose: Health check endpoint for Coolify/Docker monitoring
 * Dependencies: none
 * Related: coolify.json, Dockerfile
 */

/**
 * Purpose: Health check endpoint for Coolify/Docker monitoring
 * Dependencies: none
 * Related: Dockerfile, Coolify healthcheck config
 */

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "0.1.0",
    mimo: {
      url: process.env.MIMO_API_URL?.substring(0, 40) || "NOT SET",
      key: process.env.MIMO_API_KEY ? "SET" : "NOT SET",
    },
  });
}
