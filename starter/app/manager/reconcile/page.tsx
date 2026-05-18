"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ReconciliationReport } from '@/lib/reconcile-types';

const ReconcilePage: React.FC = () => {
  const [report, setReport] = useState<ReconciliationReport | null>(null);

  useEffect(() => {
    fetch('/api/reconcile').then(r => r.json()).then(setReport);
  }, []);

  if (!report) return <div className="p-10 text-center">Loading forensic triage...</div>;

  const sections = [
    { title: 'Needs action now', data: report.groups.actionNeeded },
    { title: 'Review required', data: report.groups.review },
    { title: 'Expected differences', data: report.groups.expected },
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-extrabold mb-8">Reconciliation Report</h1>
      {sections.map(s => (
        <section key={s.title} className="mb-10">
          <h2 className="text-xl font-bold mb-4">{s.title} ({s.data.length})</h2>
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Tag</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Title</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Explanation</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {s.data.map(i => (
                  <tr key={i.assetTag} className="hover:bg-gray-50">
                    <td className="p-4 font-mono font-bold text-indigo-700">
                        <Link href={i.detailUrl}>{i.assetTag}</Link>
                    </td>
                    <td className="p-4">{i.title}</td>
                    <td className="p-4 text-gray-600">{i.explanation}</td>
                    <td className="p-4 font-semibold text-gray-900">{i.suggestedAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
};

export default ReconcilePage;
