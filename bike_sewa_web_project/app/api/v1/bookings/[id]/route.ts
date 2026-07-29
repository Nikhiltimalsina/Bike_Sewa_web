import { NextRequest } from "next/server";
import { authorizedProxy } from "@/utils/proxy";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return authorizedProxy(request, "GET", `/bookings/${id}`);
}
