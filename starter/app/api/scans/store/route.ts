import { NextResponse } from "next/server";
import { scanErrorResponse, validateAssetTag, requireString } from "@/lib/scan-errors";
import { storeWithWritebacks } from "@/lib/writebacks";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    validateAssetTag(body.asset_tag);
    requireString(body.user_id, "user_id");
    requireString(body.location?.site, "location.site");

    const { asset_tag, location, user_id, scan_payload } = body;
    
    // Ensure we send the full location schema to satisfy backend validation
    const fullLocation = {
        site: location.site,
        room: location.room || null,
        row: location.row || null,
        rack: location.rack || null,
        ru: location.ru || null
    };

    return NextResponse.json(await storeWithWritebacks({
        asset_tag,
        location: fullLocation,
        user_id,
        scan_payload
    }));
  } catch (err: any) {
    return scanErrorResponse(err);
  }
}
