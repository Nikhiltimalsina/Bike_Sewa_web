import { NextRequest } from "next/server";
import { authorizedProxy } from "@/utils/proxy";

export async function GET(request: NextRequest) {
  return authorizedProxy(request, "GET", "/auth/users");
}

export async function POST(request: NextRequest) {
  return authorizedProxy(request, "POST", "/auth/users");
}