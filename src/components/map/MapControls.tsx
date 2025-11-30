// src/components/Map/MapControls.tsx
import React from "react";
import { useMap } from "react-leaflet";
import { ZoomIn, ZoomOut, Home, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/UI/Button";
import { useMapStore } from "@/store/mapStore";

export const MapControls: React.FC = () => {
  const map = useMap();
  const { viewport, setViewport } = useMapStore();
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const zoomIn = () => {
    map.zoomIn();
  };

  const zoomOut = () => {
    map.zoomOut();
  };

  const goHome = () => {
    map.setView([51.1657, 10.4515], 6);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar !border-none !bg-transparent !shadow-lg">
        <div className="flex flex-col gap-2 p-2">
          <Button
            icon={ZoomIn}
            variant="secondary"
            size="sm"
            onClick={zoomIn}
            title="Zoom In"
          />
          <Button
            icon={ZoomOut}
            variant="secondary"
            size="sm"
            onClick={zoomOut}
            title="Zoom Out"
          />
          <Button
            icon={Home}
            variant="secondary"
            size="sm"
            onClick={goHome}
            title="Reset View"
          />
          <Button
            icon={isFullscreen ? Minimize2 : Maximize2}
            variant="secondary"
            size="sm"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          />
        </div>
      </div>
    </div>
  );
};
