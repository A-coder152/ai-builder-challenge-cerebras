import { NextResponse } from "next/server";
import { scanErrorResponse, validateAssetTag, requireString } from "@/lib/scan-errors";
import { storeWithWritebacks } from "@/lib/writebacks";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    validateAssetTag(body.asset_tag);
    requireString(body.user_id, "user_id");
    requireString(body.location?.site, "location.site");

    return NextResponse.json(await storeWithWritebacks(body));
  } catch (err: any) {
    return scanErrorResponse(err);
  }
}
