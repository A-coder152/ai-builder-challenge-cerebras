"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api-client";

const ReconcilePage: React.FC = () => {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const fetchReport = async () => {
      const response = await fetch("/api/reconcile");
      const data = await response.json();
      setReport(data);
    };
    fetchReport();
  }, []);

  if (!report)
    return (
      <div className="text-center py-20 text-gray-500">
        Running advanced diagnostic...
      </div>
    );

  const sections = [
    {
      title: "Critical Action Needed",
      data: report.groups.actionNeeded,
      color: "text-red-700",
      bg: "bg-red-50",
    },
    {
      title: "Review Required",
      data: report.groups.review,
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
    {
      title: "Expected Drift",
      data: report.groups.expected,
      color: "text-blue-700",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
        Reconciliation Report
      </h1>
      <p className="text-gray-600 mb-8">
        Summary of discrepancies identified across operational, facilities, and
        finance systems.
      </p>

      {sections.map((section, idx) => (
        <section key={idx} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {section.title}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${section.bg} ${section.color}`}
            >
              {section.data.length} issues
            </span>
          </div>
          {section.data.length === 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg text-gray-500 italic">
              No issues found.
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <tbody className="divide-y divide-gray-100">
                  {section.data.map((item: any) => (
                    <tr key={item.asset_tag} className="hover:bg-gray-50">
                      <td className="p-4 font-mono font-medium text-indigo-600">
                        {item.asset_tag}
                      </td>
                      <td className="p-4 text-gray-700">{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default ReconcilePage;
