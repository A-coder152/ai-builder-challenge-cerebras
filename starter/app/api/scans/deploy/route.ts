import { api } from "@/lib/api-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await api.scans.deploy(body);

    const rack_location = `${body.location.site}/${body.location.room}/${body.location.row}/${body.location.rack}/${body.location.ru}`;

    await api.mock.updateFacilities({
      tagged_id: body.asset_tag,
      rack_location,
    });

    await api.mock.updateFinance({
      tag: body.asset_tag,
      site: body.location.site,
      status: "capitalized",
      capitalized_on: new Date().toISOString(),
    });

    return NextResponse.json({ 
        asset: result, 
        sync: { facilities: { ok: true, rack_location }, finance: { ok: true, status: "capitalized" } } 
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message, code: err.code, details: err.details },
      { status: err.status || 500 }
    );
  }
}
