"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CameraScanner from "@/components/CameraScanner";
import { ScanWorkflowShell } from "@/components/scan/ScanWorkflowShell";
import { ScanField } from "@/components/scan/ScanField";

const TransferPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ asset_tag: "", to_custodian: "" });
  const [error, setError] = useState<string | null>(null);
  const [scanningField, setScanningField] = useState<
    keyof typeof formData | null
  >(null);

  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('/api/scans/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_tag: formData.asset_tag,
          to_custodian: formData.to_custodian,
          user_id: 'tech-jane',
          scan_payload: formData.asset_tag,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to transfer asset. Check the tag and try again.');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (result) {
    return (
      <ScanWorkflowShell title="Success">
        <div className="text-green-700 font-bold mb-4">Transferred {result.asset_tag}</div>
        <div className="text-sm text-gray-600 mb-6">Custody transferred to {result.custodian}.</div>
        <button onClick={() => { setResult(null); setFormData({ asset_tag: '', to_custodian: '' }); }} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold">Scan another asset</button>
      </ScanWorkflowShell>
    );
  }

  if (scanningField) {
    return (
      <ScanWorkflowShell title="Scan Barcode">
        <CameraScanner
          onScan={(val) => {
            setFormData((p) => ({ ...p, [scanningField]: val }));
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
    <ScanWorkflowShell title="Transfer Custody" error={error}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ScanField
          label="Asset Tag"
          value={formData.asset_tag}
          onChange={(v) => setFormData((p) => ({ ...p, asset_tag: v }))}
          onScan={() => setScanningField("asset_tag")}
          autoFocus
        />
        <ScanField
          label="Receiving User Badge"
          value={formData.to_custodian}
          onChange={(v) => setFormData((p) => ({ ...p, to_custodian: v }))}
          onScan={() => setScanningField("to_custodian")}
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold"
        >
          Transfer Asset
        </button>
      </form>
    </ScanWorkflowShell>
  );
};

export default TransferPage;
