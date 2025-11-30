import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { useMapStore } from "@/store/mapStore";

export const DrawControls = () => {
  const map = useMap();
  const { addAoi, setSelectedAoi, aois } = useMapStore();

  useEffect(() => {
    if (!map) return;

    // Add Geoman controls
    map.pm.addControls({
      position: "topleft",
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: true,
      drawPolygon: true,
      drawCircle: false,
      editMode: true,
      dragMode: false,
      cutPolygon: false,
      removalMode: true,
    });

    
    map.on("pm:create", (e: any) => {
      const layer = e.layer;
      const geojson = layer.toGeoJSON();
      
      // Determine shape type
      let shapeType = 'polygon';
      if (e.shape === 'Rectangle') {
        shapeType = 'rectangle';
      }

     
      const areaNumber = aois.length + 1;
      
      const aoi: any = {
        name: `Area ${areaNumber}`,
        geometry: geojson.geometry,
        color: getRandomColor(),
        properties: {
          type: shapeType,
          areaNumber: areaNumber
        }
      };

      console.log(`Creating Area ${areaNumber} from drawing:`, aoi);
      addAoi(aoi);
      
      // Select the newly created area
      const newAoiId = `aoi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      // We need to get the actual ID from the store, but for now we'll select it via the list
      
      map.removeLayer(layer);
      
      console.log(`Area ${areaNumber} created and added to list`);
    });

    // Handle shape selection on the map
    map.on("pm:select", (e: any) => {
      const layer = e.layer;
      const aoiId = layer._aoiId;
      if (aoiId) {
        console.log("Area selected on map:", aoiId);
        setSelectedAoi(aoiId);
      }
    });

    // Handle shape deselection
    map.on("pm:deselect", (e: any) => {
      console.log("Area deselected on map");
      setSelectedAoi(null);
    });

    // Cleanup on unmount
    return () => {
      if (map) {
        map.off("pm:create");
        map.off("pm:select");
        map.off("pm:deselect");
      }
    };
  }, [map, addAoi, setSelectedAoi, aois]);

  return null;
};

function getRandomColor(): string {
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#8B5CF6', '#EC4899', '#06B6D4'];
  return colors[Math.floor(Math.random() * colors.length)];
}