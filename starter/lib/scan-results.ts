export type SyncAction =
  | "updated"
  | "created"
  | "cleared"
  | "skipped_expected"
  | "not_applicable"
  | "failed";

export type SyncStatus = {
  ok: boolean;
  action: SyncAction;
  message: string;
  details?: Record<string, unknown>;
};

export type ScanWorkflow = "receive" | "store" | "deploy" | "transfer";

export type ScanRouteResult<TAsset> = {
  ok: true;
  workflow: ScanWorkflow;
  asset: TAsset;
  message: string;
  sync: {
    operations: SyncStatus;
    facilities: SyncStatus;
    finance: SyncStatus;
  };
};
