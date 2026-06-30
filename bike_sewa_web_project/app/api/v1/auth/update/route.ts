import { NextRequest } from "next/server";
import { authorizedProxy } from "@/utils/proxy";

export async function PUT(request: NextRequest) {
  return authorizedProxy(request, "PUT", "/auth/update");
}