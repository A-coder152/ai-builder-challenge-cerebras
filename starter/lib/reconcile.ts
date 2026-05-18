import { api } from "@/lib/api-client";
import { ReconciliationReport, ReconciliationIssue } from "@/lib/reconcile-types";

export function normalizeRack(value: string | null | undefined): string | null {
  return value?.trim().replace(/\s+/g, "").replace(/\/+/g, "/").toLowerCase() ?? null;
}

export function formatOpsRack(asset: any): string | null {
  const { site, room, row, rack, ru } = asset.location || {};
  if (!site || !room || !row || !rack || !ru) return null;
  return `${site}/${room}/${row}/${rack}/${ru}`.toLowerCase();
}

export async function getReconciliationReport(): Promise<ReconciliationReport> {
  const [assets, facilities, finance] = await Promise.all([
    api.assets.list(),
    api.mock.facilities(),
    api.mock.finance(),
  ]);

  const tagMap = new Map<string, any>();
  assets.forEach((a: any) => tagMap.set(a.asset_tag, { tag: a.asset_tag, operations: a }));
  
  facilities.forEach((f: any) => {
    const record = tagMap.get(f.tagged_id) || { tag: f.tagged_id, facilitiesRows: [] };
    if (!record.facilitiesRows) record.facilitiesRows = [];
    record.facilitiesRows.push(f);
    tagMap.set(f.tagged_id, record);
  });
  
  finance.forEach((f: any) => {
    const record = tagMap.get(f.tag) || { tag: f.tag, financeRows: [] };
    if (!record.financeRows) record.financeRows = [];
    record.financeRows.push(f);
    tagMap.set(f.tag, record);
  });

  const report: ReconciliationReport = {
    generatedAt: new Date().toISOString(),
    summary: { critical: 0, actionNeeded: 0, review: 0, expected: 0, clean: 0 },
    groups: { actionNeeded: [], review: [], expected: [], clean: [] },
  };

  tagMap.forEach((data, tag) => {
    const { operations, facilitiesRows, financeRows } = data;
    const facilities = facilitiesRows?.[0];
    const finance = financeRows?.[0];
    let issue: ReconciliationIssue | null = null;

    if ((facilitiesRows?.length > 1) || (financeRows?.length > 1)) {
        issue = {
            assetTag: tag, group: 'actionNeeded', severity: 'critical', category: 'rack_location_mismatch',
            title: 'Duplicate system records', explanation: 'Multiple records found in Facilities or Finance.',
            suggestedAction: 'Clean up data source.', detailUrl: `/manager/assets/${tag}`, systems: { operations, facilities, finance }
        };
    } else if (operations?.state === 'in_service' && !facilities) {
      issue = {
        assetTag: tag, group: 'actionNeeded', severity: 'high', category: 'missing_facilities_rack',
        title: 'Racked asset missing from Facilities', explanation: 'Asset in service but missing rack record.',
        suggestedAction: 'Update Facilities rack record.', detailUrl: `/manager/assets/${tag}`, systems: { operations, facilities, finance }
      };
    } else if (operations?.state === 'in_service' && facilities && normalizeRack(formatOpsRack(operations)) !== normalizeRack(facilities.rack_location)) {
      issue = {
        assetTag: tag, group: 'actionNeeded', severity: 'high', category: 'rack_location_mismatch',
        title: 'Operations and Facilities disagree on rack', explanation: `Ops: ${formatOpsRack(operations)}; Fac: ${facilities.rack_location}`,
        suggestedAction: 'Physically verify rack label and update stale system.', detailUrl: `/manager/assets/${tag}`, systems: { operations, facilities, finance }
      };
    } else if (operations?.state === 'in_service' && finance && finance.status !== 'capitalized') {
        issue = {
            assetTag: tag, group: 'actionNeeded', severity: 'high', category: 'finance_status_mismatch',
            title: 'Finance status mismatch', explanation: 'Asset is in service but not capitalized.',
            suggestedAction: 'Ask Finance to review capitalization status.', detailUrl: `/manager/assets/${tag}`, systems: { operations, facilities, finance }
        };
    } else if (['received', 'stored'].includes(operations?.state) && facilities) {
        issue = {
            assetTag: tag, group: 'actionNeeded', severity: 'high', category: 'stale_facilities_rack',
            title: 'Non-racked asset still appears racked', explanation: 'Asset is stored/received but still shows in facilities.',
            suggestedAction: 'Clear Facilities rack record.', detailUrl: `/manager/assets/${tag}`, systems: { operations, facilities, finance }
        };
    } else if (['received', 'stored'].includes(operations?.state) && !facilities) {
        issue = {
            assetTag: tag, group: 'expected', severity: 'info', category: 'expected_non_racked',
            title: 'Expected: not racked', explanation: 'Asset is stored/received and not in facilities.',
            suggestedAction: 'None', detailUrl: `/manager/assets/${tag}`, systems: { operations, facilities, finance }
        };
    } else if (!operations && facilities) {
        issue = {
            assetTag: tag, group: 'review', severity: 'medium', category: 'facilities_orphan',
            title: 'Facilities-only asset', explanation: 'Facilities record exists but no Operations asset.',
            suggestedAction: 'Investigate orphan.', detailUrl: `/manager/assets/${tag}`, systems: { operations, facilities, finance }
        };
    }

    if (issue) {
      report.groups[issue.group].push(issue);
      report.summary[issue.group]++;
    } else {
      report.groups.clean.push({ assetTag: tag, group: 'clean', severity: 'info', category: 'clean', title: 'Clean', explanation: 'Systems agree', suggestedAction: 'None', detailUrl: `/manager/assets/${tag}`, systems: { operations, facilities, finance } });
      report.summary.clean++;
    }
  });

  return report;
}
