"use client";

import React, { useRef } from 'react';

interface ScanFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onScan: () => void;
  autoFocus?: boolean;
}

export const ScanField: React.FC<ScanFieldProps> = ({ label, value, onChange, onScan, autoFocus }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-grow border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          autoFocus={autoFocus}
          onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
        />
        <button
          type="button"
          onClick={onScan}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition"
        >
          Scan
        </button>
      </div>
    </div>
  );
};
