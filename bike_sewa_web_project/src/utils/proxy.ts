import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3002";

export async function publicProxy(
  request: NextRequest,
  method: string,
  forwardPath: string
): Promise<NextResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const body = method !== "GET" ? await request.json() : undefined;

  const response = await fetch(`${BACKEND_URL}${forwardPath}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

// Protected proxy - requires auth_token cookie
export async function authorizedProxy(
  request: NextRequest,
  method: string,
  forwardPath: string
): Promise<NextResponse> {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  let body: BodyInit | undefined;
  const contentType = request.headers.get("content-type");
  if (method !== "GET") {
    if (contentType?.includes("multipart/form-data")) {
      body = await request.formData();
    } else {
      body = await request.json();
      headers["Content-Type"] = "application/json";
    }
  }

  const response = await fetch(`${BACKEND_URL}${forwardPath}`, {
    method,
    headers,
    body,
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}