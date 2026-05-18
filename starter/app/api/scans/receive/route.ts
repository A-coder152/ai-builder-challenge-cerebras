import { api } from "@/lib/api-client";
import { NextResponse } from "next/server";
import { scanErrorResponse, validateAssetTag } from "@/lib/scan-errors";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    validateAssetTag(body.asset_tag);
    if (!body.user_id) throw { status: 422, code: 'missing_user', message: 'User ID is required.' };

    const result = await api.scans.receive(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return scanErrorResponse(err);
  }
}
