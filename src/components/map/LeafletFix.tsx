// src/components/Map/LeafletFix.tsx
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Set default icon URLs
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export const LeafletFix: React.FC = () => {
  useEffect(() => {
    // Additional Leaflet configuration if needed
    console.log("Leaflet initialized");
  }, []);

  return null;
};
