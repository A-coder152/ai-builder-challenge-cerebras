import { api } from "@/lib/api-client";
import { NextResponse } from "next/server";
import { scanErrorResponse, validateAssetTag, requireString } from "@/lib/scan-errors";
import { receiveWithWritebacks } from "@/lib/writebacks";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    validateAssetTag(body.asset_tag);
    requireString(body.user_id, "user_id");

    const result = await receiveWithWritebacks(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return scanErrorResponse(err);
  }
}
