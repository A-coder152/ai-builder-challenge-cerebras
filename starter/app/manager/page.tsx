"use client";

import React, { useEffect, useState, useMemo } from 'react';
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
  const [filterState, setFilterState] = useState('all');

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

  const filteredAssets = useMemo(() => {
    if (filterState === 'all') return assets;
    return assets.filter(a => a.state === filterState);
  }, [assets, filterState]);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Asset Management</h1>
        <Link href="/manager/reconcile" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
          Run Reconciliation
        </Link>
      </div>
      
      <div className="mb-6 flex gap-2">
        {['all', 'received', 'stored', 'in_service'].map(state => (
          <button 
            key={state}
            onClick={() => setFilterState(state)}
            className={`px-4 py-2 rounded-full capitalize ${filterState === state ? 'bg-indigo-100 text-indigo-700 font-bold' : 'bg-gray-100'}`}
          >
            {state}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading your fleet...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">Asset Tag</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Model</th>
                <th className="p-4 text-sm font-semibold text-gray-600">State</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Custodian</th>
                <th className="p-4 text-sm font-semibold text-gray-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAssets.map((asset) => (
                <tr key={asset.asset_tag} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-mono font-medium text-indigo-600">{asset.asset_tag}</td>
                  <td className="p-4">{asset.model}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                      asset.state === 'in_service' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {asset.state}
                    </span>
                  </td>
                  <td className="p-4">{asset.custodian}</td>
                  <td className="p-4 text-right">
                    <Link href={`/manager/assets/${asset.asset_tag}`} className="text-indigo-600 hover:text-indigo-900 font-medium">
                      Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
