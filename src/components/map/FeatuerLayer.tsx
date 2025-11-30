// src/components/Map/FeatureLayer.tsx
import React from "react";
import { GeoJSON, Popup } from "react-leaflet";
import { Feature } from "@/types/map.types";
import { useMapStore } from "@/store/mapStore";

interface FeatureLayerProps {
  features: Feature[];
}

export const FeatureLayer: React.FC<FeatureLayerProps> = ({ features }) => {
  const { selectedFeature, setSelectedFeature, removeFeature } = useMapStore();

  const getStyle = (feature: Feature) => {
    const color = feature.properties.color || "#3B82F6";
    const isSelected = selectedFeature === feature.id;

    return {
      color,
      weight: isSelected ? 4 : 2,
      opacity: 0.8,
      fillColor: color,
      fillOpacity: 0.2,
    };
  };

  return (
    <>
      {features.map((feature) => (
        <GeoJSON
          key={feature.id}
          data={feature}
          style={getStyle(feature)}
          eventHandlers={{
            click: (e) => {
              e.originalEvent.stopPropagation();
              setSelectedFeature(feature.id);
            },
          }}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-semibold text-gray-900">
                {feature.properties.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Type: {feature.properties.type}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Created:{" "}
                {new Date(feature.properties.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => removeFeature(feature.id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </Popup>
        </GeoJSON>
      ))}
    </>
  );
};
