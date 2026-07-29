import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";
const FETCH_TIMEOUT = 5000;

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = FETCH_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const response = await fetchWithTimeout(`${BACKEND_URL}/auth/users/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const text = await response.text();
    try {
      JSON.parse(text);
      return new NextResponse(text, {
        status: response.status,
        headers: { "content-type": "application/json" },
      });
    } catch {
      return NextResponse.json({ message: "Invalid response from backend" }, { status: 502 });
    }
  } catch (err) {
    console.error("[/api/v1/admin/users/stats] fetch error:", String(err));
    return NextResponse.json({ message: "Failed to connect to backend" }, { status: 502 });
  }
}

