import { NextResponse } from "next/server";
import { scanErrorResponse, validateAssetTag, requireString } from "@/lib/scan-errors";
import { deployWithWritebacks } from "@/lib/writebacks";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    validateAssetTag(body.asset_tag);
    requireString(body.user_id, "user_id");
    requireString(body.location?.site, "location.site");
    requireString(body.location?.room, "location.room");
    requireString(body.location?.row, "location.row");
    requireString(body.location?.rack, "location.rack");
    requireString(body.location?.ru, "location.ru");

    return NextResponse.json(await deployWithWritebacks(body));
  } catch (err: any) {
    return scanErrorResponse(err);
  }
}
