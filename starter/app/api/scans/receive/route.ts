import { api } from "@/lib/api-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const result = await api.scans.receive(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message, code: err.code, details: err.details },
      { status: err.status || 500 }
    );
  }
}
