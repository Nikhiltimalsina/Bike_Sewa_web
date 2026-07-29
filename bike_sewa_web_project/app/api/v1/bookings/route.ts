import { NextRequest } from "next/server";
import { authorizedProxy, publicProxy } from "@/utils/proxy";

// GET /api/v1/bookings → proxy to backend /bookings (admin list all bookings)
// For regular user's own bookings, use /api/v1/bookings/me instead
export async function GET(request: NextRequest) {
  return authorizedProxy(request, "GET", "/bookings");
}

export async function POST(request: NextRequest) {
  return authorizedProxy(request, "POST", "/bookings");
}
