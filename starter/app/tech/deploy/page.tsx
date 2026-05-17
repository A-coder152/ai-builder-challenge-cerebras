"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CameraScanner from '@/components/CameraScanner';
import { apiClient } from '@/lib/api-client';

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
  const [scanningField, setScanningField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Call Deploy API
      await apiClient.post('/v1/scans/deploy', {
        asset_tag: formData.asset_tag,
        location: { 
            site: formData.site,
            room: formData.room,
            rack: formData.rack,
            ru: formData.ru
        },
        user_id: 'tech-jane',
        scan_payload: formData.asset_tag,
      });

      // Call Sync Handler (Phase 4 requirement)
      await apiClient.post('/api/sync-mocks', {
        asset_tag: formData.asset_tag,
        location: `${formData.site}/${formData.room}/${formData.rack}/${formData.ru}`,
        status: 'capitalized'
      });

      router.push('/manager');
    } catch (err: any) {
      setError(err.message || 'Failed to deploy asset');
    }
  };

  const handleScan = (value: string) => {
    if (scanningField) {
      setFormData(prev => ({ ...prev, [scanningField]: value }));
    }
    setScanningField(null);
  };

  const renderField = (name: keyof typeof formData, label: string) => (
    <div className="mb-4">
      <label className="block mb-1">{label}</label>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={formData[name]}
          onChange={(e) => setFormData({...formData, [name]: e.target.value})}
          className="flex-grow border p-2 rounded"
          required
        />
        <button type="button" onClick={() => setScanningField(name)} className="bg-gray-200 p-2 rounded">Scan</button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Deploy Asset</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

      {scanningField ? (
        <div className="mb-4">
          <CameraScanner onScan={handleScan} onError={(err) => setError(err.message)} />
          <button onClick={() => setScanningField(null)} className="mt-2 text-sm text-gray-500">Cancel</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderField('asset_tag', 'Asset Tag')}
          {renderField('site', 'Site')}
          {renderField('room', 'Room')}
          {renderField('rack', 'Rack')}
          {renderField('ru', 'RU')}
          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Submit</button>
        </form>
      )}
    </div>
  );
};

export default DeployPage;
