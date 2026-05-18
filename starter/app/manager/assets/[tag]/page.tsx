"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api-client";

const AssetDetailPage: React.FC = () => {
  const { tag } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [asset, events, facilities, finance] = await Promise.all([
        api.assets.get(tag as string),
        api.assets.history(tag as string),
        api.mock
          .facilities()
          .then((r) => r.find((f: any) => f.tagged_id === tag)),
        api.mock.finance().then((r) => r.find((f: any) => f.tag === tag)),
      ]);
      setData({ asset, events, facilities, finance });
    };
    fetchData();
  }, [tag]);

  if (!data)
    return (
      <div className="text-center py-20 text-gray-500">
        Loading forensic data...
      </div>
    );

  const { asset, events, facilities, finance } = data;

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {asset.asset_tag} · {asset.model}
        </h1>
        <p className="text-gray-600 uppercase tracking-wide text-sm font-bold mt-1">
          {asset.state.replace("_", " ")} • {asset.location.site}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-500 mb-3 text-xs uppercase">
            Operations
          </h3>
          <p className="font-mono text-sm">
            {asset.location.site} / {asset.location.room || "-"}
          </p>
          <p className="text-sm">Custodian: {asset.custodian}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-500 mb-3 text-xs uppercase">
            Facilities
          </h3>
          <p className="font-mono text-sm">
            {facilities?.rack_location || "Not racked"}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-500 mb-3 text-xs uppercase">
            Finance
          </h3>
          <p className="font-mono text-sm">{finance?.status || "Unknown"}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6">Event Timeline</h2>
      <div className="space-y-4">
        {events.map((event: any) => (
          <div
            key={event.id}
            className="flex gap-4 p-4 bg-white border border-gray-100 rounded-lg"
          >
            <div className="text-xs text-gray-400 w-32 shrink-0">
              {new Date(event.timestamp).toLocaleString()}
            </div>
            <div>
              <span className="font-semibold text-indigo-700 capitalize">
                {event.event_type.replace("_", " ")}
              </span>
              <p className="text-sm text-gray-600">by {event.user_id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetDetailPage;
