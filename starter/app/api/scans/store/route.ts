import { api } from "@/lib/api-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const { asset_tag } = body;
    const before = await api.assets.get(asset_tag);
    
    const result = await api.scans.store(body);

    if (before.state === "in_service") {
      await api.mock.updateFacilities({
        tagged_id: asset_tag,
        rack_location: null,
      });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message, code: err.code, details: err.details },
      { status: err.status || 500 }
    );
  }
}
