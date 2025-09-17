"use client";

import React from "react";
import dynamic from "next/dynamic";

const HeatmapContainer = dynamic(
  () => import("@/components/maps/HeatmapContainer"),
  { ssr: false }
);

const MapPage = () => {
  return (
    <main className="min-h-screen bg-white px-4 py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Mapas</h1>
      <div className="h-[70vh] rounded overflow-hidden">
        <HeatmapContainer initialZoom={12} height="h-[600px]" />
      </div>
    </main>
  );
};

export default MapPage;
