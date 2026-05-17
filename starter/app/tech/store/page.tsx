"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CameraScanner from '@/components/CameraScanner';
import { apiClient } from '@/lib/api-client';

const StorePage: React.FC = () => {
  const router = useRouter();
  const [assetTag, setAssetTag] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [scanningField, setScanningField] = useState<'asset_tag' | 'location' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await fetch('/api/scans/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset_tag: assetTag,
          location: { site: location },
          user_id: 'tech-jane',
          scan_payload: assetTag,
        }),
      });

      router.push('/manager');
    } catch (err: any) {
      setError(err.message || 'Failed to store asset');
    }
  };

  const handleScan = (value: string) => {
    if (scanningField === 'asset_tag') {
      setAssetTag(value);
    } else if (scanningField === 'location') {
      setLocation(value);
    }
    setScanningField(null);
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Store Asset</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

      {scanningField ? (
        <div className="mb-4">
          <CameraScanner onScan={handleScan} onError={(err) => setError(err.message)} />
          <button onClick={() => setScanningField(null)} className="mt-2 text-sm text-gray-500">Cancel</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Asset Tag</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={assetTag}
                onChange={(e) => setAssetTag(e.target.value)}
                className="flex-grow border p-2 rounded"
                required
              />
              <button type="button" onClick={() => setScanningField('asset_tag')} className="bg-gray-200 p-2 rounded">Scan</button>
            </div>
          </div>
          <div>
            <label className="block mb-1">Location</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-grow border p-2 rounded"
                required
              />
              <button type="button" onClick={() => setScanningField('location')} className="bg-gray-200 p-2 rounded">Scan</button>
            </div>
          </div>
          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Submit</button>
        </form>
      )}
    </div>
  );
};

export default StorePage;
