import { api } from "@/lib/api-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await api.scans.transfer(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message, code: err.code, details: err.details },
      { status: err.status || 500 },
    );
  }
}
