import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'http://localhost:8080/v1';

  try {
    const [assetsRes, facilitiesRes, financeRes] = await Promise.all([
      fetch(`${baseUrl}/assets`),
      fetch(`${baseUrl}/mock/facilities/spaces`),
      fetch(`${baseUrl}/mock/finance/equipment`)
    ]);

    const assets = await assetsRes.json();
    const facilities = await facilitiesRes.json();
    const finance = await financeRes.json();

    const report = {
      inSync: [],
      facilitiesMismatch: [],
      financeMismatch: [],
      ghostOperations: [],
      ghostExternal: [],
    };

    assets.forEach((asset: any) => {
        const facMatch = facilities.find((f: any) => f.tagged_id === asset.asset_tag);
        const finMatch = finance.find((f: any) => f.tag === asset.asset_tag);

        if (asset.state === 'in_service' && !facMatch) {
            report.facilitiesMismatch.push({ asset_tag: asset.asset_tag, note: 'Expected in facilities' });
        } else if (asset.state === 'in_service' && finMatch?.status !== 'capitalized') {
            report.financeMismatch.push({ asset_tag: asset.asset_tag, note: 'Not capitalized in finance' });
        } else {
            report.inSync.push({ asset_tag: asset.asset_tag });
        }
    });

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: 'Reconciliation failed' }, { status: 500 });
  }
}
