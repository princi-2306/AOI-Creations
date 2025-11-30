import React from 'react';
import { GeoJSON, Popup, useMap } from 'react-leaflet';
import { useMapStore } from '@/store/mapStore';
import { AOI } from '@/types/map.types';

interface AOILayerProps {
  aois: AOI[];
}

export const AOILayer: React.FC<AOILayerProps> = ({ aois }) => {
  const map = useMap();
  const { selectedAoi, setSelectedAoi, removeAoi } = useMapStore();

  const getStyle = (aoi: AOI) => {
    const isSelected = selectedAoi === aoi.id;

    return {
      color: aoi.color,
      weight: isSelected ? 4 : 2,
      opacity: 0.8,
      fillColor: aoi.color,
      fillOpacity: isSelected ? 0.4 : 0.2, 
      dashArray: isSelected ? '0' : '5, 5',
      className: isSelected ? 'selected-area' : ''
    };
  };

  // Create GeoJSON feature with proper properties
  const createGeoJSONFeature = (aoi: AOI) => {
    return {
      type: 'Feature' as const,
      geometry: aoi.geometry,
      properties: {
        id: aoi.id,
        name: aoi.name,
        color: aoi.color,
        type: aoi.properties?.type || 'polygon',
        areaNumber: aoi.properties?.areaNumber || 1
      }
    };
  };

  // When an AOI is created, make it selectable
  const onEachFeature = (feature: any, layer: any) => {
    const aoiId = feature.properties?.id;
    
    if (!aoiId) {
      console.warn('No AOI ID found in feature properties:', feature);
      return;
    }

    // Store AOI ID on layer for selection
    layer._aoiId = aoiId;
    
    // Enable Geoman editing for this layer
    if (layer.pm) {
      layer.pm.enable({
        allowEditing: true,
        allowRemoval: true,
        allowCutting: false,
        allowRotation: false
      });

      // Handle edits - update the area if needed
      layer.on('pm:edit', (e: any) => {
        console.log('Area edited:', aoiId);
        // You could update the AOI geometry in store here
      });

      // Handle removal via Geoman tools
      layer.on('pm:remove', (e: any) => {
        console.log('Area removed via Geoman:', aoiId);
        removeAoi(aoiId);
      });
    }

    // Handle click to select this area
    layer.on('click', (e: any) => {
      e.originalEvent?.stopPropagation();
      console.log('Area clicked, selecting:', aoiId);
      setSelectedAoi(aoiId);
      
      // Bring this layer to front when selected
      layer.bringToFront();
    });

    // Handle mouseover for better UX
    layer.on('mouseover', (e: any) => {
      if (selectedAoi !== aoiId) {
        layer.setStyle({
          weight: 3,
          fillOpacity: 0.3
        });
      }
    });

    layer.on('mouseout', (e: any) => {
      if (selectedAoi !== aoiId) {
        layer.setStyle(getStyle(aois.find(a => a.id === aoiId)!));
      }
    });
  };

  return (
    <>
      {aois.map((aoi) => (
        <GeoJSON
          key={aoi.id}
          data={createGeoJSONFeature(aoi)}
          style={getStyle(aoi)}
          onEachFeature={onEachFeature}
        >
          <Popup>
            <div className="p-3 min-w-[220px]">
              <div className="flex items-center gap-2 mb-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: aoi.color }}
                />
                <h3 className="font-semibold text-gray-900 text-lg">
                  {aoi.name}
                </h3>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Type: {aoi.properties?.type || 'polygon'}</p>
                <p>Created: {aoi.createdAt.toLocaleDateString()}</p>
                <p>Status: {selectedAoi === aoi.id ? 'Selected' : 'Not selected'}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedAoi(aoi.id);
                    // Fly to this area
                    const bounds = layer.getBounds();
                    if (bounds.isValid()) {
                      map.flyToBounds(bounds, { padding: [20, 20] });
                    }
                  }}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => {
                    removeAoi(aoi.id);
                    map.closePopup();
                  }}
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