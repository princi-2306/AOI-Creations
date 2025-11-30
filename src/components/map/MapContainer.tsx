import React, { Suspense, useState, useEffect } from "react";
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import { WMSTileLayer } from "react-leaflet";
import { useMapStore } from "@/store/mapStore";
import { MapControls } from "./MapControls";
import { MapEventHandler } from "./MapEventHandler";
import { MapController } from "./MapController";
import { AOILayer } from "./AOILayer";
import { CurrentDrawing } from "./CurrentDrawing";
import { LeafletFix } from "./LeafletFix";
import { WMS_SERVICE_URL } from "@/services/wmsServices";
import { DrawControls } from "./DrawControls";

const MapLoadingFallback: React.FC = () => (
  <div className="h-full w-full flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading map...</p>
    </div>
  </div>
);

const MapErrorFallback: React.FC = () => (
  <div className="h-full w-full flex items-center justify-center bg-red-50">
    <div className="text-center">
      <div className="text-red-600 text-lg font-semibold">Map Failed to Load</div>
      <p className="mt-2 text-gray-600">Please refresh the page or check your connection</p>
    </div>
  </div>
);

export const MapContainer: React.FC = () => {
  const { viewport, aois, layers } = useMapStore();
  const [mapReady, setMapReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  const wmsLayer = layers.find((layer) => layer.id === "nw-dop");

  useEffect(() => {
    const timer = setTimeout(() => setMapReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle map errors
  const handleMapError = () => {
    console.error("Map container failed to load");
    setHasError(true);
  };

  if (hasError) {
    return <MapErrorFallback />;
  }

  if (!mapReady) {
    return <MapLoadingFallback />;
  }

  return (
    <div 
      className="h-full w-full" 
      data-testid="main-map-container"
      onError={handleMapError}
    >
      <Suspense fallback={<MapLoadingFallback />}>
        <LeafletMap
          center={viewport.center}
          zoom={viewport.zoom}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          className="z-0"
          data-testid="leaflet-map" 
        >
          <LeafletFix />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
            eventHandlers={{
              error: () => console.warn("Base tile layer failed to load")
            }}
          />
          {wmsLayer?.visible && (
            <WMSTileLayer
              url={WMS_SERVICE_URL}
              layers="nw_dop"
              format="image/png"
              transparent={true}
              version="1.1.1"
              attribution="© Geobasis NRW"
              eventHandlers={{
                error: () => console.warn("WMS layer failed to load")
              }}
            />
          )}

          {/* Map Components */}
          <MapControls />
          <MapEventHandler />
          <MapController />
          <DrawControls />
          <AOILayer aois={aois} />
          <CurrentDrawing />
        </LeafletMap>
      </Suspense>
    </div>
  );
};