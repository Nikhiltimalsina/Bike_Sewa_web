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
    const { searchParams } = new URL(request.url);
    const qs = searchParams.toString();
    const url = `${BACKEND_URL}/bikes${qs ? `?${qs}` : ""}`;
    
    const response = await fetchWithTimeout(url, {
      method: "GET",
      headers: { accept: "application/json" },
    });

    const text = await response.text();
    try {
      JSON.parse(text);
      return new NextResponse(text, {
        status: response.status,
        headers: { "content-type": "application/json" },
      });
    } catch {
      console.error("[/api/v1/bikes] backend returned non-JSON:", text.substring(0, 300));
      return NextResponse.json({ bikes: [], error: "Backend returned invalid data" }, { status: 502 });
    }
  } catch (err) {
    console.error("[/api/v1/bikes] fetch error:", String(err));
    return NextResponse.json({ bikes: [], error: String(err) }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const authHeader = request.headers.get("authorization");
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
    const response = await fetch(`${BACKEND_URL}/bikes`, {
      method: "POST",
      headers,
      body,
    });
    const text = await response.text();
    try {
      JSON.parse(text);
      return new NextResponse(text, {
        status: response.status,
        headers: { "content-type": "application/json" },
      });
    } catch {
      return NextResponse.json({ error: "Invalid response from backend" }, { status: 502 });
    }
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
