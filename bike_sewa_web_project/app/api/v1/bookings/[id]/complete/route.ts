import { NextRequest } from "next/server";
import { authorizedProxy } from "@/utils/proxy";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return authorizedProxy(request, "POST", `/bookings/${id}/complete`);
}

