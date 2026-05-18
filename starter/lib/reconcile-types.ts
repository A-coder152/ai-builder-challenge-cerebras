export type ReconciliationSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "info";

export type ReconciliationGroup =
  | "actionNeeded"
  | "review"
  | "expected"
  | "clean";

export type ReconciliationCategory =
  | "missing_facilities_rack"
  | "rack_location_mismatch"
  | "stale_facilities_rack"
  | "missing_finance_record"
  | "finance_status_mismatch"
  | "finance_site_mismatch"
  | "facilities_orphan"
  | "finance_orphan"
  | "expected_non_racked"
  | "recent_writeback_gap"
  | "clean";

export type ReconciliationIssue = {
  assetTag: string;
  group: ReconciliationGroup;
  severity: ReconciliationSeverity;
  category: ReconciliationCategory;
  title: string;
  explanation: string;
  suggestedAction: string;
  detailUrl: string;
  systems: {
    operations?: any;
    facilities?: any;
    finance?: any;
  };
};

export type ReconciliationReport = {
  generatedAt: string;
  summary: {
    critical: number;
    actionNeeded: number;
    review: number;
    expected: number;
    clean: number;
  };
  groups: {
    actionNeeded: ReconciliationIssue[];
    review: ReconciliationIssue[];
    expected: ReconciliationIssue[];
    clean: ReconciliationIssue[];
  };
};
