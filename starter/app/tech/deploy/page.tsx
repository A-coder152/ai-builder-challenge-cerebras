"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CameraScanner from '@/components/CameraScanner';
import { ScanWorkflowShell } from '@/components/scan/ScanWorkflowShell';
import { ScanField } from '@/components/scan/ScanField';

const DeployPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    asset_tag: '',
    site: '',
    room: '',
    rack: '',
    ru: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [scanningField, setScanningField] = useState<keyof typeof formData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await fetch('/api/scans/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_tag: formData.asset_tag,
          location: { site: formData.site, room: formData.room, rack: formData.rack, ru: formData.ru },
          user_id: 'tech-jane',
          scan_payload: formData.asset_tag,
        }),
      });
      router.push('/manager');
    } catch (err: any) {
      setError(err.message || 'Failed to deploy asset');
    }
  };

  if (scanningField) {
    return (
      <ScanWorkflowShell title="Scan Barcode">
        <CameraScanner 
          onScan={(val) => { setFormData(p => ({ ...p, [scanningField]: val })); setScanningField(null); }} 
          onError={(err) => setError(err.message)} 
        />
        <button onClick={() => setScanningField(null)} className="mt-4 w-full text-gray-500">Cancel</button>
      </ScanWorkflowShell>
    );
  }

  return (
    <ScanWorkflowShell title="Deploy Asset" error={error}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ScanField label="Asset Tag" value={formData.asset_tag} onChange={(v) => setFormData(p => ({...p, asset_tag: v}))} onScan={() => setScanningField('asset_tag')} autoFocus />
        <ScanField label="Site" value={formData.site} onChange={(v) => setFormData(p => ({...p, site: v}))} onScan={() => setScanningField('site')} />
        <ScanField label="Room" value={formData.room} onChange={(v) => setFormData(p => ({...p, room: v}))} onScan={() => setScanningField('room')} />
        <ScanField label="Rack" value={formData.rack} onChange={(v) => setFormData(p => ({...p, rack: v}))} onScan={() => setScanningField('rack')} />
        <ScanField label="RU" value={formData.ru} onChange={(v) => setFormData(p => ({...p, ru: v}))} onScan={() => setScanningField('ru')} />
        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold">Deploy Asset</button>
      </form>
    </ScanWorkflowShell>
  );
};

export default DeployPage;
