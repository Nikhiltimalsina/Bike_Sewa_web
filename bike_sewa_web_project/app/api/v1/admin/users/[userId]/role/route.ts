import { NextRequest } from "next/server";
import { authorizedProxy } from "@/utils/proxy";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return authorizedProxy(request, "PATCH", `/auth/users/${userId}/role`);
}
