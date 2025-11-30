// src/App.tsx
import React, { useEffect } from "react";
import { MapContainer } from "@/components/map/MapContainer";
import { Sidebar } from "@/components/Layout/Sidebar";
import { useMapStore } from "@/store/mapStore";
import { storageService } from "@/services/storageService";
import { SearchSection } from "./components/map/SearchSection";

function App() {
  const { setViewport, setFeatures } = useMapStore();

  // Load saved state on app start
  useEffect(() => {
    console.log("App mounted - loading saved state");

    const savedViewport = storageService.loadViewport();
    if (savedViewport) {
      console.log("Loading saved viewport:", savedViewport);
      setViewport(savedViewport);
    }

    const savedFeatures = storageService.loadFeatures();
    if (savedFeatures.length > 0) {
      console.log("Loading saved features:", savedFeatures.length);
      setFeatures(savedFeatures);
    }
  }, [setViewport, setFeatures]);

  // Setup keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        useMapStore.getState().cancelDrawing();
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        const { selectedFeature, removeFeature } = useMapStore.getState();
        if (selectedFeature) {
          removeFeature(selectedFeature);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="h-screen w-screen flex bg-gray-100">
      <SearchSection />
      <div className="flex-1 relative">
        <MapContainer />
      </div>
    </div>
  );
}

export default App;
