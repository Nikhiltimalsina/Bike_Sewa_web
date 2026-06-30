import { NextRequest } from "next/server";
import { authorizedProxy } from "@/utils/proxy";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return authorizedProxy(request, "GET", `/blogs/${id}`);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return authorizedProxy(request, "PUT", `/blogs/${id}`);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return authorizedProxy(request, "DELETE", `/blogs/${id}`);
}