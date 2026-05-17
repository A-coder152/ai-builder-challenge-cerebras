import { api } from "@/lib/api-client";

export async function getReconciliationReport() {
  const [assets, facilities, finance] = await Promise.all([
    api.assets.list(),
    api.mock.facilities(),
    api.mock.finance(),
  ]);

  const tagMap = new Map<string, any>();

  // Initialize from Operations
  assets.forEach((a: any) => tagMap.set(a.asset_tag, { tag: a.asset_tag, operations: a }));

  // Add Facilities
  facilities.forEach((f: any) => {
    const record = tagMap.get(f.tagged_id) || { tag: f.tagged_id };
    record.facilities = f;
    tagMap.set(f.tagged_id, record);
  });

  // Add Finance
  finance.forEach((f: any) => {
    const record = tagMap.get(f.tag) || { tag: f.tag };
    record.finance = f;
    tagMap.set(f.tag, record);
  });

  const report = {
    summary: { critical: 0, actionNeeded: 0, review: 0, expected: 0, clean: 0 },
    groups: { actionNeeded: [] as any[], review: [] as any[], expected: [] as any[], clean: [] as any[] },
  };

  tagMap.forEach((data, tag) => {
    const { operations, facilities, finance } = data;

    // Reconciliation Categorization Rules
    if (operations?.state === 'in_service' && !facilities) {
      report.groups.actionNeeded.push({
        assetTag: tag,
        severity: 'high',
        category: 'missing_rack_record',
        title: 'Rack record missing',
        explanation: 'Asset is in service but has no facilities record.',
        suggestedAction: 'Update facilities rack record.',
      });
      report.summary.actionNeeded++;
    } else if (operations?.state === 'in_service' && finance?.status !== 'capitalized') {
      report.groups.actionNeeded.push({
        assetTag: tag,
        severity: 'high',
        category: 'finance_status_mismatch',
        title: 'Finance status mismatch',
        explanation: 'Asset is in service but not capitalized.',
        suggestedAction: 'Review finance record.',
      });
      report.summary.actionNeeded++;
    } else if (operations?.state === 'stored' && !facilities) {
        report.groups.expected.push({
            assetTag: tag,
            severity: 'info',
            category: 'expected_facilities_gap',
            title: 'Expected: not racked',
            explanation: 'Asset is stored, so it should not be in facilities.',
            suggestedAction: 'None',
        });
        report.summary.expected++;
    } else {
        report.groups.clean.push({ assetTag: tag, severity: 'info', category: 'clean', title: 'No action' });
        report.summary.clean++;
    }
  });

  return report;
}
