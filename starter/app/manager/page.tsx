"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";

type DashboardAsset = {
  asset_tag: string;
  serial: string;
  model: string;
  manufacturer: string;
  asset_class: string;
  state: string;
  custodian: string;
};

type ReconcileSummary = {
  critical: number;
  actionNeeded: number;
  review: number;
  expected: number;
  clean: number;
};

const PAGE_SIZE = 25;

const DashboardSkeleton = () => (
  <div className="container mx-auto p-6 max-w-6xl animate-pulse text-gray-400">
    Loading your fleet triage report...
  </div>
);

const DashboardError = ({ message }: { message: string }) => (
  <div className="container mx-auto p-6 max-w-6xl text-center text-red-600 font-medium">
    {message}
  </div>
);

const ManagerDashboard: React.FC = () => {
  const [assets, setAssets] = useState<DashboardAsset[]>([]);
  const [reconcileSummary, setReconcileSummary] = useState<ReconcileSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and Filter State
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsData, reconcileData] = await Promise.all([
          api.assets.list(),
          fetch("/api/reconcile").then((r) => r.json()),
        ]);
        setAssets(assetsData);
        setReconcileSummary(reconcileData.summary);
      } catch (err) {
        setError("Failed to fetch dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtered Assets Logic
  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const matchesSearch = 
        a.asset_tag.toLowerCase().includes(search.toLowerCase()) ||
        a.serial.toLowerCase().includes(search.toLowerCase()) ||
        a.model.toLowerCase().includes(search.toLowerCase());
      
      const matchesState = stateFilter === "all" || a.state === stateFilter;
      
      return matchesSearch && matchesState;
    });
  }, [assets, search, stateFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAssets.length / PAGE_SIZE);
  const paginatedAssets = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAssets.slice(start, start + PAGE_SIZE);
  }, [filteredAssets, currentPage]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, stateFilter]);

  if (loading) return <DashboardSkeleton />;
  if (error) return <DashboardError message={error} />;
  if (!reconcileSummary) return <DashboardError message="Could not load triage summary." />;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-indigo-900">
          Good morning, Manager
        </h1>
        <p className="text-slate-600">
          Here is your triage report before standup.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 text-center">
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
          <div className="text-2xl font-bold text-red-700">
            {reconcileSummary?.actionNeeded || 0}
          </div>
          <div className="text-sm font-semibold text-red-600 uppercase tracking-wider">
            Critical Action
          </div>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 shadow-sm">
          <div className="text-2xl font-bold text-amber-700">
            {reconcileSummary?.review || 0}
          </div>
          <div className="text-sm font-semibold text-amber-600 uppercase tracking-wider">
            Review Needed
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
          <div className="text-2xl font-bold text-blue-700">
            {reconcileSummary?.expected || 0}
          </div>
          <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
            Expected Drift
          </div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
          <div className="text-2xl font-bold text-emerald-700">
            {reconcileSummary?.clean || 0}
          </div>
          <div className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">
            Clean Assets
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Fleet Inventory ({filteredAssets.length})</h2>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <input 
                type="text" 
                placeholder="Search Tag, Serial, or Model..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none flex-grow md:w-64 shadow-sm"
            />
            <select 
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
            >
                <option value="all">All States</option>
                <option value="received">Received</option>
                <option value="stored">Stored</option>
                <option value="in_service">In Service</option>
                <option value="rma_pending">RMA Pending</option>
                <option value="disposed">Disposed</option>
            </select>
            <Link
              href="/manager/reconcile"
              className="bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-800 transition shadow-sm"
            >
              Run Reconcile
            </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Asset Tag
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Model / Serial
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                State
              </th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Custodian
              </th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedAssets.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-400 italic">No assets found matching your criteria.</td>
                </tr>
            ) : (
                paginatedAssets.map((asset) => (
                  <tr
                    key={asset.asset_tag}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="p-4 font-mono font-bold text-indigo-700">
                      {asset.asset_tag}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900 leading-tight">{asset.model}</div>
                      <div className="text-xs text-slate-400 font-mono mt-1">{asset.serial}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                        asset.state === 'in_service' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        asset.state === 'disposed' ? 'bg-slate-50 text-slate-500 border-slate-200' :
                        'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {asset.state.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 text-sm font-medium">
                      {asset.custodian}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/manager/assets/${asset.asset_tag}`}
                        className="text-indigo-600 font-bold hover:text-indigo-900 group-hover:underline text-sm"
                      >
                        Investigate →
                      </Link>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-700 font-medium">
                  Showing <span className="font-bold">{(currentPage - 1) * PAGE_SIZE + 1}</span> to <span className="font-bold">{Math.min(currentPage * PAGE_SIZE, filteredAssets.length)}</span> of{' '}
                  <span className="font-bold">{filteredAssets.length}</span> assets
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    ←
                  </button>
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum = currentPage;
                      if (currentPage <= 3) pageNum = i + 1;
                      else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                      else pageNum = currentPage - 2 + i;
                      
                      if (pageNum < 1 || pageNum > totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-bold focus:z-20 ring-1 ring-inset ring-slate-300 ${
                            currentPage === pageNum ? 'bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' : 'text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                  })}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    →
                  </button>
                </nav>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
