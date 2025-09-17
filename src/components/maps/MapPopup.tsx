"use client";

import React from "react";

interface MapPopupProps {
  title?: string;
  description?: string;
}

export default function MapPopup({ title, description }: MapPopupProps) {
  return (
    <div className="min-w-[200px]">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
