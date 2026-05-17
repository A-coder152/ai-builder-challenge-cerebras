"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CameraScanner from '@/components/CameraScanner';
import { apiClient } from '@/lib/api-client';

const ReceivePage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    asset_tag: '',
    serial: '',
    model: '',
    manufacturer: '',
    asset_class: 'instrument',
    location: {
      site: '',
      room: '',
      row: '',
      rack: '',
      ru: '',
    },
    user_id: 'tech-jane',
  });
  const [error, setError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await fetch('/api/scans/receive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          scan_payload: formData.asset_tag,
        }),
      });
      router.push('/manager');
    } catch (err: any) {
      if (err.code === 'and_match_failed') {
        setError(`Conflict! Serial mismatch for ${formData.asset_tag}. Existing serial: ${err.details.existing_serial}`);
      } else {
        setError(err.message || 'Failed to receive asset');
      }
    }
  };

  const handleScan = (value: string) => {
    setFormData((prev) => ({ ...prev, asset_tag: value }));
    setShowScanner(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Receive Asset</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      
      {showScanner ? (
        <CameraScanner onScan={handleScan} onError={(err) => setError(err.message)} />
      ) : (
        <button 
          onClick={() => setShowScanner(true)}
          className="w-full bg-blue-500 text-white p-2 rounded mb-4"
        >
          Scan Barcode
        </button>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          placeholder="Asset Tag (C0000000)" 
          value={formData.asset_tag}
          onChange={(e) => setFormData({...formData, asset_tag: e.target.value})}
          className="w-full border p-2 rounded"
          required
        />
        <input 
          type="text" 
          placeholder="Serial" 
          value={formData.serial}
          onChange={(e) => setFormData({...formData, serial: e.target.value})}
          className="w-full border p-2 rounded"
          required
        />
        <input 
          type="text" 
          placeholder="Model" 
          value={formData.model}
          onChange={(e) => setFormData({...formData, model: e.target.value})}
          className="w-full border p-2 rounded"
          required
        />
        <input 
          type="text" 
          placeholder="Manufacturer" 
          value={formData.manufacturer}
          onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
          className="w-full border p-2 rounded"
          required
        />
        <select 
          value={formData.asset_class}
          onChange={(e) => setFormData({...formData, asset_class: e.target.value as any})}
          className="w-full border p-2 rounded"
        >
          <option value="instrument">Instrument</option>
          <option value="compute">Compute</option>
          <option value="network">Network</option>
          <option value="power">Power</option>
          <option value="consumable_durable">Consumable Durable</option>
        </select>
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default ReceivePage;
