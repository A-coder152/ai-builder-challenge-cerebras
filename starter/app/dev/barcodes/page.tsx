"use client";

import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

const BarcodeCard = ({ label, value, description }: { label: string, value: string, description: string }) => {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (ref.current) JsBarcode(ref.current, value, { format: "CODE128", displayValue: true, height: 40 });
  }, [value]);
  return (
    <div className="barcode-card border p-4 rounded-lg bg-white shadow-sm flex flex-col items-center">
      <h3 className="font-bold text-sm mb-1">{label}</h3>
      <svg ref={ref}></svg>
      <p className="text-xs text-gray-500 mt-2 text-center">{description}</p>
    </div>
  );
};

const BarcodeGeneratorPage = () => (
  <div className="container mx-auto p-6 max-w-4xl">
    <h1 className="text-2xl font-bold mb-6">Test Harness: Barcodes</h1>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <BarcodeCard label="Asset" value="C0009001" description="Happy path test asset" />
      <BarcodeCard label="Site" value="SFO" description="Deploy site" />
      <BarcodeCard label="Room" value="R201" description="Deploy room" />
      <BarcodeCard label="Row" value="A" description="Deploy row" />
      <BarcodeCard label="Rack" value="K1" description="Deploy rack" />
      <BarcodeCard label="RU" value="10" description="Deploy RU" />
      <BarcodeCard label="Full Rack" value="rack:SFO/R201/A/K1/10" description="Parseable rack location" />
    </div>
  </div>
);

export default BarcodeGeneratorPage;
