import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:3001";

const FETCH_TIMEOUT = 5000;

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs = FETCH_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetchWithTimeout(
      `${BACKEND_URL}/auth/social-login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const text = await response.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { message: "Invalid response from backend" },
        { status: 502 }
      );
    }

    const nextResponse = NextResponse.json(data, { status: response.status });

    if (
      response.ok &&
      typeof data === "object" &&
      data !== null &&
      "token" in data &&
      typeof (data as Record<string, unknown>).token === "string"
    ) {
      const token = (data as Record<string, unknown>).token as string;
      nextResponse.cookies.set("auth_token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return nextResponse;
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to connect to backend" },
      { status: 502 }
    );
  }
}
