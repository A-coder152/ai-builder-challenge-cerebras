"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CameraScanner from "@/components/CameraScanner";
import { ScanWorkflowShell } from "@/components/scan/ScanWorkflowShell";
import { ScanField } from "@/components/scan/ScanField";

const StorePage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ asset_tag: "", location: "" });
  const [error, setError] = useState<string | null>(null);
  const [scanningField, setScanningField] = useState<
    keyof typeof formData | null
  >(null);

  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('/api/scans/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_tag: formData.asset_tag,
          location: { site: formData.location },
          user_id: 'tech-jane',
          scan_payload: formData.asset_tag,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to store asset. Check the tag and try again.');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (result) {
    return (
      <ScanWorkflowShell title="Success">
        <div className="text-green-700 font-bold mb-4">Stored {result.asset.asset_tag}</div>
        <div className="text-sm text-gray-600 mb-6">
            {result.sync.facilities.action === 'cleared' 
                ? 'Facilities de-racked because this asset was previously in service.' 
                : 'No Facilities change needed because this asset was not racked.'}
        </div>
        <button onClick={() => { setResult(null); setFormData({ asset_tag: '', location: '' }); }} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold">Scan another asset</button>
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
    <ScanWorkflowShell title="Store Asset" error={error}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ScanField
          label="Asset Tag"
          value={formData.asset_tag}
          onChange={(v) => setFormData((p) => ({ ...p, asset_tag: v }))}
          onScan={() => setScanningField("asset_tag")}
          autoFocus
        />
        <ScanField
          label="Location"
          value={formData.location}
          onChange={(v) => setFormData((p) => ({ ...p, location: v }))}
          onScan={() => setScanningField("location")}
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold"
        >
          Store Asset
        </button>
      </form>
    </ScanWorkflowShell>
  );
};

export default StorePage;
