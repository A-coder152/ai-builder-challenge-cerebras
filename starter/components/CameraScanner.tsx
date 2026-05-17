"use client";

import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, Result } from '@zxing/library';

interface CameraScannerProps {
  onScan: (result: string) => void;
  onError?: (error: Error) => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onScan, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const startScanner = async () => {
      try {
        const videoInputDevices = await reader.current.listVideoInputDevices();
        const firstDevice = videoInputDevices?.[0];
        if (firstDevice) {
          const selectedDeviceId = firstDevice.deviceId;
          await reader.current.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current!,
            (result: Result | undefined, error?: Error) => {
              if (result) {
                onScan(result.getText());
                stopScanner();
              } else if (error) {
                if (onError) onError(error);
              }
            }
          );
          setIsScanning(true);
        }
      } catch (err) {
        if (onError) onError(err as Error);
      }
    };

    const stopScanner = () => {
      reader.current.reset();
      setIsScanning(false);
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, [onScan, onError]);

  return (
    <div className="relative border rounded-lg overflow-hidden">
      <video ref={videoRef} className="w-full h-auto" />
      {isScanning && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
          Scanning...
        </div>
      )}
    </div>
  );
};

export default CameraScanner;
