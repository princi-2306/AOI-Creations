// FIX: Update src/components/Map/MapEventHandler.tsx
import React from "react";
import { useMapEvents } from "react-leaflet";
import { useMapStore } from "@/store/mapStore";

export const MapEventHandler: React.FC = () => {
  const { drawing, addCoordinate, setSelectedAoi } = useMapStore();

  useMapEvents({
    click: (e) => {
      console.log("Map clicked:", e.latlng, "Drawing mode:", drawing.mode); 

      if (drawing.mode && drawing.isDrawing) {
        const { lat, lng } = e.latlng;
        console.log("Adding coordinate to drawing:", lng, lat); 
        addCoordinate(lng, lat);
      } else {
        console.log("Clearing selection"); // DEBUG
        setSelectedAoi(null);
      }
    },

    dblclick: (e) => {
      // Use double click to complete polygon drawing
      const { drawing } = useMapStore.getState();
      if (
        drawing.mode === "polygon" &&
        drawing.isDrawing &&
        drawing.tempCoordinates.length >= 3
      ) {
        console.log("Completing polygon via double click"); // DEBUG
        // Complete the drawing
        const { tempCoordinates } = drawing;
        const geometry = {
          type: "Polygon" as const,
          coordinates: [[...tempCoordinates, tempCoordinates[0]]],
        };

        const aoi: Omit<AOI, "id" | "createdAt"> = {
          name: `Area ${useMapStore.getState().aois.length + 1}`,
          geometry,
          color: getRandomColor(),
          properties: {},
        };

        useMapStore.getState().addAoi(aoi);
        useMapStore.getState().cancelDrawing();
      }
    },
  });

  return null;
};

function getRandomColor(): string {
  const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"];
  return colors[Math.floor(Math.random() * colors.length)];
}
