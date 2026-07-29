import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "http://localhost:3001";
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
    const response = await fetchWithTimeout(`${BACKEND_URL.replace(/\/$/, "")}/bikes/search?q=${encodeURIComponent(searchParams.get("q") || "")}`, {
      method: "GET",
      headers: { accept: "application/json" },
    });
    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") || "application/json" },
    });
  } catch {
    return NextResponse.json({ bikes: [], error: "Request timed out or backend unreachable" }, { status: 200 });
  }
}
