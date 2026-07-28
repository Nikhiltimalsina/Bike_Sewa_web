import { NextRequest } from "next/server";
import { authorizedProxy } from "@/utils/proxy";

export async function POST(request: NextRequest) {
  return authorizedProxy(request, "POST", "/bikes");
}

