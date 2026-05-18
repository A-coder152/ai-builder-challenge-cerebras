import { getReconciliationReport } from "@/lib/reconcile";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const report = await getReconciliationReport();
    return NextResponse.json(report);
  } catch (error: any) {
    console.error("Reconciliation Error:", error);
    return NextResponse.json(
      { error: 'Reconciliation failed', details: error.message }, 
      { status: 500 }
    );
  }
}
