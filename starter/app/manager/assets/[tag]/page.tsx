"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

interface Asset {
  asset_tag: string;
  serial: string;
  model: string;
  manufacturer: string;
  state: string;
  custodian: string;
  location: { site: string; room: string; row: string; rack: string; ru: string };
}

interface Event {
  id: string;
  event_type: string;
  user_id: string;
  timestamp: string;
}

const AssetDetailPage: React.FC = () => {
  const { tag } = useParams();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assetData = await apiClient.get(`/v1/assets/${tag}`);
        setAsset(assetData);
        const eventData = await apiClient.get(`/v1/assets/${tag}/events`);
        setEvents(eventData);
      } catch (error) {
        console.error('Failed to fetch asset data', error);
      }
    };
    fetchData();
  }, [tag]);

  if (!asset) return <p>Loading asset details...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Asset: {asset.asset_tag}</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div><strong>Model:</strong> {asset.model}</div>
        <div><strong>State:</strong> {asset.state}</div>
        <div><strong>Custodian:</strong> {asset.custodian}</div>
        <div><strong>Location:</strong> {asset.location.site}</div>
      </div>
      
      <h2 className="text-xl font-bold mb-2">Event Log</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Type</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td className="border p-2">{event.event_type}</td>
              <td className="border p-2">{event.user_id}</td>
              <td className="border p-2">{new Date(event.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetDetailPage;
