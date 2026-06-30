import { NextRequest } from "next/server";
import { authorizedProxy } from "@/utils/proxy";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const path = `/blogs?${searchParams.toString()}`;
  return authorizedProxy(request, "GET", path);
}

export async function POST(request: NextRequest) {
  return authorizedProxy(request, "POST", "/blogs");
}