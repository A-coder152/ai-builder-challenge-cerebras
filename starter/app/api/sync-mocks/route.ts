import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { asset_tag, location, status, rack_location } = body;

  const baseUrl = 'http://localhost:8080/v1';

  try {
    // Sync with Facilities
    await fetch(`${baseUrl}/mock/facilities/spaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tagged_id: asset_tag,
        rack_location: rack_location || null,
      }),
    });

    // Sync with Finance
    await fetch(`${baseUrl}/mock/finance/equipment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tag: asset_tag,
        status: status || 'capitalized',
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to sync mocks' }, { status: 500 });
  }
}
