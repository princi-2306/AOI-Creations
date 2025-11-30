// src/components/Map/MapController.tsx
import React from "react";
import { useMap } from "react-leaflet";
import { useMapStore } from "@/store/mapStore";

export const MapController: React.FC = () => {
  const map = useMap();
  const { viewport, setViewport } = useMapStore();

  // Store map instance globally for flyTo functionality
  React.useEffect(() => {
    (window as any).map = map;
    return () => {
      (window as any).map = null;
    };
  }, [map]);

  // Sync map with viewport state (one-way from store to map)
  React.useEffect(() => {
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();

    if (
      Math.abs(currentCenter.lat - viewport.center[0]) > 0.0001 ||
      Math.abs(currentCenter.lng - viewport.center[1]) > 0.0001 ||
      currentZoom !== viewport.zoom
    ) {
      map.setView(viewport.center, viewport.zoom, {
        animate: true,
      });
    }
  }, [map, viewport]);

  // Listen to map movements and update store
  React.useEffect(() => {
    const handleMoveEnd = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();

      setViewport({
        center: [center.lat, center.lng],
        zoom,
      });
    };

    map.on("moveend", handleMoveEnd);

    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [map, setViewport]);

  return null;
};
