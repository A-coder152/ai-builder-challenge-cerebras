"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';

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
  const [reconcileSummary, setReconcileSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsData, reconcileData] = await Promise.all([
          api.assets.list(),
          fetch('/api/reconcile').then(r => r.json())
        ]);
        setAssets(assetsData);
        setReconcileSummary(reconcileData.summary);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Good morning, Manager</h1>
        <p className="text-gray-600">Here is your triage report before standup.</p>
      </div>
      
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading your fleet status...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <div className="text-2xl font-bold text-red-700">{reconcileSummary.actionNeeded}</div>
              <div className="text-sm font-semibold text-red-600">Critical Action Needed</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <div className="text-2xl font-bold text-amber-700">{reconcileSummary.review}</div>
              <div className="text-sm font-semibold text-amber-600">Review Required</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="text-2xl font-bold text-blue-700">{reconcileSummary.expected}</div>
              <div className="text-sm font-semibold text-blue-600">Expected Drift</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="text-2xl font-bold text-green-700">{reconcileSummary.clean}</div>
              <div className="text-sm font-semibold text-green-600">Clean Assets</div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Fleet Overview</h2>
            <Link href="/manager/reconcile" className="text-indigo-600 font-medium hover:underline">
              View Detailed Reconciliation →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-600">Asset Tag</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">State</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Custodian</th>
                  <th className="p-4 text-sm font-semibold text-gray-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assets.slice(0, 10).map((asset) => (
                  <tr key={asset.asset_tag} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-mono font-medium text-indigo-600">{asset.asset_tag}</td>
                    <td className="p-4 capitalize">{asset.state.replace('_', ' ')}</td>
                    <td className="p-4">{asset.custodian}</td>
                    <td className="p-4 text-right">
                      <Link href={`/manager/assets/${asset.asset_tag}`} className="text-indigo-600 font-medium">Details</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerDashboard;
