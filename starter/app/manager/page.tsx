"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

interface Asset {
  asset_tag: string;
  serial: string;
  model: string;
  manufacturer: string;
  state: string;
  custodian: string;
}

const ManagerDashboard: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await apiClient.get('/v1/assets');
        setAssets(data);
      } catch (error) {
        console.error('Failed to fetch assets', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
      {loading ? (
        <p>Loading assets...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Tag</th>
              <th className="border p-2">Model</th>
              <th className="border p-2">State</th>
              <th className="border p-2">Custodian</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.asset_tag}>
                <td className="border p-2">{asset.asset_tag}</td>
                <td className="border p-2">{asset.model}</td>
                <td className="border p-2">{asset.state}</td>
                <td className="border p-2">{asset.custodian}</td>
                <td className="border p-2">
                  <Link href={`/manager/assets/${asset.asset_tag}`} className="text-blue-500 hover:underline">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManagerDashboard;
