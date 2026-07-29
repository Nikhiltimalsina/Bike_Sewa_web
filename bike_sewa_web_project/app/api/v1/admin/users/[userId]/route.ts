import { NextRequest } from "next/server";
import { authorizedProxy } from "@/utils/proxy";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return authorizedProxy(request, "PUT", `/auth/users/${userId}`);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return authorizedProxy(request, "DELETE", `/auth/users/${userId}`);
}
