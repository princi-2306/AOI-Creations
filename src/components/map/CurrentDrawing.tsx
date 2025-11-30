// src/components/Map/CurrentDrawing.tsx
import React from "react";
import { GeoJSON } from "react-leaflet";
import { useMapStore } from "@/store/mapStore";

export const CurrentDrawing: React.FC = () => {
  const { drawing } = useMapStore();

  if (!drawing.currentFeature || !drawing.isDrawing) {
    return null;
  }

  return (
    <GeoJSON
      data={drawing.currentFeature}
      style={{
        color: "#EF4444",
        weight: 2,
        opacity: 0.8,
        fillColor: "#EF4444",
        fillOpacity: 0.1,
        dashArray: "5, 5",
      }}
    />
  );
};
