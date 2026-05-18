"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserMultiFormatReader, Result } from '@zxing/library';

interface CameraScannerProps {
  onScan: (result: string) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onScan, onError, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());
  const [permissionError, setPermissionError] = useState(false);

  const stopScanner = useCallback(() => {
    reader.current.reset();
  }, []);

  useEffect(() => {
    const startScanner = async () => {
      try {
        const videoInputDevices = await reader.current.listVideoInputDevices();
        if (videoInputDevices && videoInputDevices.length > 0) {
          const rearCam = videoInputDevices.find(d => /back|rear|environment/i.test(d.label)) || videoInputDevices[0];
          if (rearCam) {
            await reader.current.decodeFromVideoDevice(
              rearCam.deviceId,
              videoRef.current!,
              (result: Result | undefined) => {
                if (result) {
                  onScan(result.getText());
                  stopScanner();
                }
              }
            );
          }
        }
      } catch (err) {
        setPermissionError(true);
        if (onError) onError(err as Error);
      }
    };

    startScanner();
    return stopScanner;
  }, [onScan, onError, stopScanner]);

  if (permissionError) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg text-center">
        <p className="mb-4">Camera permission is blocked or unavailable.</p>
        <button onClick={onCancel} className="text-indigo-600 font-bold underline">Use manual entry instead</button>
      </div>
    );
  }

  return (
    <div className="relative border rounded-lg overflow-hidden bg-black">
      <video ref={videoRef} className="w-full h-auto" />
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <p className="text-white text-sm bg-black/50 p-2 rounded">Point camera at barcode.</p>
      </div>
    </div>
  );
};

export default CameraScanner;

