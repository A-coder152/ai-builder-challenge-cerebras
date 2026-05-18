import { api } from "@/lib/api-client";
import type {
  Asset,
  DeployScanInput,
  ReceiveScanInput,
  StoreScanInput,
  TransferScanInput,
} from "@/lib/types";
import { ScanRouteResult, SyncStatus } from "@/lib/scan-results";

function ok(action: SyncStatus["action"], message: string): SyncStatus {
  return { ok: true, action, message };
}

function failed(error: unknown): SyncStatus {
  const message = error instanceof Error ? error.message : "Downstream writeback failed.";
  return { ok: false, action: "failed", message };
}

export async function receiveWithWritebacks(input: ReceiveScanInput): Promise<ScanRouteResult<Asset>> {
  const asset = await api.scans.receive(input);
  return {
    ok: true,
    workflow: "receive",
    asset,
    message: `Received ${asset.asset_tag}.`,
    sync: {
      operations: ok("created", "Operations received the asset."),
      facilities: ok("not_applicable", "Receiving does not create a rack record."),
      finance: ok("not_applicable", "Receiving does not capitalize the asset."),
    },
  };
}

export async function deployWithWritebacks(input: DeployScanInput): Promise<ScanRouteResult<Asset>> {
  const asset = await api.scans.deploy(input);
  const rackLocation = `${input.location.site}/${input.location.room}/${input.location.row}/${input.location.rack}/${input.location.ru}`;

  // Use allSettled so one failure doesn't ruin the whole request
  const [facilitiesResult, financeResult] = await Promise.allSettled([
    api.mock.updateFacilities({ tagged_id: input.asset_tag, rack_location: rackLocation }),
    api.mock.updateFinance({
      tag: input.asset_tag,
      site: input.location.site,
      status: "capitalized",
      capitalized_on: new Date().toISOString(),
    }),
  ]);

  return {
    ok: true,
    workflow: "deploy",
    asset,
    message: `Deployed ${asset.asset_tag}.`,
    sync: {
      operations: ok("updated", "Operations moved the asset into service."),
      facilities:
        facilitiesResult.status === "fulfilled"
          ? ok("updated", `Facilities rack set to ${rackLocation}.`)
          : failed(facilitiesResult.reason),
      finance:
        financeResult.status === "fulfilled"
          ? ok("updated", "Finance marked the asset capitalized.")
          : failed(financeResult.reason),
    },
  };
}

export async function storeWithWritebacks(input: StoreScanInput): Promise<ScanRouteResult<Asset>> {
  const before = await api.assets.get(input.asset_tag);
  const asset = await api.scans.store(input);
  if (before.state === "in_service") {
    await api.mock.updateFacilities({ tagged_id: input.asset_tag, rack_location: null });
  }
  return {
    ok: true,
    workflow: "store",
    asset,
    message: `Stored ${asset.asset_tag}.`,
    sync: {
      operations: ok("updated", "Operations moved the asset to storage."),
      facilities: ok(before.state === "in_service" ? "cleared" : "skipped_expected", "Facilities record updated."),
      finance: ok("not_applicable", "Storage does not change capitalization."),
    },
  };
}

export async function transferWithWritebacks(input: TransferScanInput): Promise<ScanRouteResult<Asset>> {
  const asset = await api.scans.transfer(input);
  return {
    ok: true,
    workflow: "transfer",
    asset,
    message: `Transferred custody for ${asset.asset_tag}.`,
    sync: {
      operations: ok("updated", "Operations updated the custodian."),
      facilities: ok("not_applicable", "Transfer does not change rack location."),
      finance: ok("not_applicable", "Transfer does not change capitalization."),
    },
  };
}
