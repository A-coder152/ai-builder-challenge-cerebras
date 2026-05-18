"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CameraScanner from "@/components/CameraScanner";
import { ScanWorkflowShell } from "@/components/scan/ScanWorkflowShell";
import { ScanField } from "@/components/scan/ScanField";
import { parseLocation } from "@/lib/location";

const DeployPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    asset_tag: "",
    site: "",
    room: "",
    row: "",
    rack: "",
    ru: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [scanningField, setScanningField] = useState<
    keyof typeof formData | null
  >(null);

  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("/api/scans/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset_tag: formData.asset_tag,
          location: {
            site: formData.site,
            room: formData.room,
            row: formData.row,
            rack: formData.rack,
            ru: formData.ru,
          },
          user_id: "tech-jane",
          scan_payload: formData.asset_tag,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error?.message ||
            "Deploy failed. Check the asset tag and location, then try again.",
        );
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (result) {
    return (
      <ScanWorkflowShell title="Success">
        <div className="text-green-700 font-bold mb-4">
          Deployed {result.asset.asset_tag}
        </div>
        <div className="text-sm text-gray-600 mb-6">
          Facilities updated: {result.sync.facilities.rack_location}
          <br />
          Finance updated: {result.sync.finance.status}
        </div>
        <button
          onClick={() => {
            setResult(null);
            setFormData({
              asset_tag: "",
              site: "",
              room: "",
              row: "",
              rack: "",
              ru: "",
            });
          }}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold"
        >
          Scan another deploy
        </button>
      </ScanWorkflowShell>
    );
  }

  if (scanningField) {
    return (
      <ScanWorkflowShell title="Scan Barcode">
        <CameraScanner
          onScan={(val) => {
            const parsed = parseLocation(val);
            if (parsed) {
              setFormData((p) => ({
                ...p,
                site: parsed.site || p.site,
                room: parsed.room || p.room,
                row: parsed.row || p.row,
                rack: parsed.rack || p.rack,
                ru: parsed.ru || p.ru,
              }));
            } else {
              setFormData((p) => ({ ...p, [scanningField]: val }));
            }
            setScanningField(null);
          }}
          onError={(err) => setError(err.message)}
        />
        <button
          onClick={() => setScanningField(null)}
          className="mt-4 w-full text-gray-500"
        >
          Cancel
        </button>
      </ScanWorkflowShell>
    );
  }

  return (
    <ScanWorkflowShell title="Deploy Asset" error={error}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ScanField
          label="Asset Tag"
          value={formData.asset_tag}
          onChange={(v) => setFormData((p) => ({ ...p, asset_tag: v }))}
          onScan={() => setScanningField("asset_tag")}
          autoFocus
        />
        <ScanField
          label="Site"
          value={formData.site}
          onChange={(v) => setFormData((p) => ({ ...p, site: v }))}
          onScan={() => setScanningField("site")}
        />
        <ScanField
          label="Room"
          value={formData.room}
          onChange={(v) => setFormData((p) => ({ ...p, room: v }))}
          onScan={() => setScanningField("room")}
        />
        <ScanField
          label="Row"
          value={formData.row}
          onChange={(v) => setFormData((p) => ({ ...p, row: v }))}
          onScan={() => setScanningField("row")}
        />
        <ScanField
          label="Rack"
          value={formData.rack}
          onChange={(v) => setFormData((p) => ({ ...p, rack: v }))}
          onScan={() => setScanningField("rack")}
        />
        <ScanField
          label="RU"
          value={formData.ru}
          onChange={(v) => setFormData((p) => ({ ...p, ru: v }))}
          onScan={() => setScanningField("ru")}
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold"
        >
          Deploy Asset
        </button>
      </form>
    </ScanWorkflowShell>
  );
};

export default DeployPage;
