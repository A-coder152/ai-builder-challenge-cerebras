"use client";

import React, { ReactNode } from 'react';

interface ScanWorkflowShellProps {
  title: string;
  children: ReactNode;
  error?: string | null;
}

export const ScanWorkflowShell: React.FC<ScanWorkflowShellProps> = ({ title, children, error }) => (
  <div className="container mx-auto p-6 max-w-lg">
    <h1 className="text-2xl font-bold mb-6 text-gray-900">{title}</h1>
    {error && (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded-lg text-sm">
        {error}
      </div>
    )}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      {children}
    </div>
  </div>
);
