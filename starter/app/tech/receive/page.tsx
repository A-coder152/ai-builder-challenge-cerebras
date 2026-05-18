"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CameraScanner from "@/components/CameraScanner";
import { ScanWorkflowShell } from "@/components/scan/ScanWorkflowShell";
import { ScanField } from "@/components/scan/ScanField";

const ReceivePage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    asset_tag: "",
    serial: "",
    model: "",
    manufacturer: "",
    asset_class: "instrument",
  });
  const [error, setError] = useState<string | null>(null);
  const [scanningField, setScanningField] = useState<
    keyof typeof formData | null
  >(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await fetch("/api/scans/receive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          scan_payload: formData.asset_tag,
          user_id: "tech-jane",
        }),
      });
      router.push("/manager");
    } catch (err: any) {
      setError(err.message || "Failed to receive asset");
    }
  };

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
    <ScanWorkflowShell title="Receive Asset" error={error}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ScanField
          label="Asset Tag"
          value={formData.asset_tag}
          onChange={(v) => setFormData((p) => ({ ...p, asset_tag: v }))}
          onScan={() => setScanningField("asset_tag")}
          autoFocus
        />
        <ScanField
          label="Serial"
          value={formData.serial}
          onChange={(v) => setFormData((p) => ({ ...p, serial: v }))}
          onScan={() => setScanningField("serial")}
        />
        <ScanField
          label="Model"
          value={formData.model}
          onChange={(v) => setFormData((p) => ({ ...p, model: v }))}
          onScan={() => setScanningField("model")}
        />
        <ScanField
          label="Manufacturer"
          value={formData.manufacturer}
          onChange={(v) => setFormData((p) => ({ ...p, manufacturer: v }))}
          onScan={() => setScanningField("manufacturer")}
        />
        <select
          value={formData.asset_class}
          onChange={(e) =>
            setFormData({ ...formData, asset_class: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg p-2.5"
        >
          {[
            "instrument",
            "compute",
            "network",
            "power",
            "consumable_durable",
          ].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold"
        >
          Submit Asset
        </button>
      </form>
    </ScanWorkflowShell>
  );
};

export default ReceivePage;
