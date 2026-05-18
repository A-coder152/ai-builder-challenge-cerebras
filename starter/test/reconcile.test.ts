import { describe, it, expect } from "vitest";
import { getReconciliationReport } from "../lib/reconcile";

// Mocking api-client to test reconciliation logic
import * as apiClient from "../lib/api-client";
import { vi } from "vitest";

vi.mock("../lib/api-client", () => ({
  api: {
    assets: { list: vi.fn() },
    mock: { facilities: vi.fn(), finance: vi.fn() },
  },
}));

describe("reconciliation logic", () => {
  it("identifies missing facilities record for in_service assets", async () => {
    (apiClient.api.assets.list as any).mockResolvedValue([
      { asset_tag: "C0000001", state: "in_service" },
    ]);
    (apiClient.api.mock.facilities as any).mockResolvedValue([]);
    (apiClient.api.mock.finance as any).mockResolvedValue([
      { tag: "C0000001", status: "capitalized" },
    ]);

    const report = await getReconciliationReport();

    expect(report.groups.actionNeeded).toHaveLength(1);
    expect(report.groups.actionNeeded?.[0]?.category).toBe('missing_facilities_rack');
    });

    it('categorizes stored assets as expected', async () => {
    (apiClient.api.assets.list as any).mockResolvedValue([
      { asset_tag: 'C0000002', state: 'stored' }
    ]);
    (apiClient.api.mock.facilities as any).mockResolvedValue([]);
    (apiClient.api.mock.finance as any).mockResolvedValue([]);

    const report = await getReconciliationReport();

    expect(report.groups.expected).toHaveLength(1);
    expect(report.groups.expected?.[0]?.category).toBe('expected_non_racked');
    });
    });

