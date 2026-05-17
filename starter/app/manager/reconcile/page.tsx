"use client";

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

const ReconcilePage: React.FC = () => {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const fetchReport = async () => {
      const data = await apiClient.get('/api/reconcile');
      setReport(data);
    };
    fetchReport();
  }, []);

  if (!report) return <p>Generating reconciliation report...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reconciliation Report</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Facilities Mismatch</h2>
          <ul>
            {report.facilitiesMismatch.map((item: any) => (
              <li key={item.asset_tag}>{item.asset_tag}: {item.note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReconcilePage;
