"use client";

import React from "react";
import dynamic from "next/dynamic";

const HeatmapContainer = dynamic(
  () => import("@/components/maps/HeatmapContainer"),
  { ssr: false }
);

const MapPage = () => {
  return (
    <main className="min-h-screen px-4 py-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mapas</h1>
          <div className="text-sm text-gray-600">
            Explore ocorrências no mapa
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="h-[70vh]">
            <HeatmapContainer initialZoom={12} height="h-full" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default MapPage;
