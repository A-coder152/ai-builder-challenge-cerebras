"use client";

import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeItem {
  label: string;
  value: string;
}

const barcodeData: BarcodeItem[] = [
  { label: 'Asset C0000001 (Received)', value: 'C0000001' },
  { label: 'Asset C0000002 (In Service)', value: 'C0000002' },
  { label: 'Asset C0000003 (Stored)', value: 'C0000003' },
  { label: 'Asset C0000004 (Drifted - Facilities)', value: 'C0000004' },
  { label: 'Asset C0000005 (Ghost - Finance)', value: 'C0000005' },
  { label: 'Location Site A / Room 101', value: 'LOC-SITEA-R101' },
  { label: 'Location Site B / Room 202', value: 'LOC-SITEB-R202' },
  { label: 'Tech Jane Doe', value: 'tech-jane' },
  { label: 'Manager Paul Smith', value: 'manager-paul' },
];

const BarcodeGeneratorPage: React.FC = () => {
  const barcodeRefs = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    barcodeData.forEach((item, index) => {
      if (barcodeRefs.current[index]) {
        JsBarcode(barcodeRefs.current[index]!, item.value, {
          format: "CODE128",
          displayValue: true,
          height: 50,
          width: 2,
          margin: 10,
        });
      }
    });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Barcode Generator</h1>
      <p className="mb-6">
        Use these barcodes for testing the scan workflows. Print this page for physical scanning.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {barcodeData.map((item, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2">{item.label}</h2>
            <svg ref={(el) => (barcodeRefs.current[index] = el)}></svg>
            <p className="text-sm font-mono mt-2">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarcodeGeneratorPage;
