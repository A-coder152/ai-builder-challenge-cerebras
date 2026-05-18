import { NextResponse } from "next/server";
import { scanErrorResponse, validateAssetTag, requireString } from "@/lib/scan-errors";
import { transferWithWritebacks } from "@/lib/writebacks";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    validateAssetTag(body.asset_tag);
    requireString(body.to_custodian, "to_custodian");
    requireString(body.user_id, "user_id");

    return NextResponse.json(await transferWithWritebacks(body));
  } catch (err: any) {
    return scanErrorResponse(err);
  }
}

