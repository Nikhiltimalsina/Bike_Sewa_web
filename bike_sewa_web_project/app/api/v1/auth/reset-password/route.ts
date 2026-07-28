import { NextRequest } from "next/server";
import { publicProxy } from "@/utils/proxy";

export async function POST(request: NextRequest) {
  return publicProxy(request, "POST", "/auth/reset-password");
}
