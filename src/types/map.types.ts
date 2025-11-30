export interface MapViewport {
  center: [number, number];
  zoom: number;
}

export interface Geometry {
  type: 'Point' | 'LineString' | 'Polygon';
  coordinates: number[] | number[][] | number[][][];
}

export interface AOI {
  id: string;
  name: string;
  geometry: Geometry;
  createdAt: Date;
  color: string;
  properties: {
    description?: string;
    area?: number; // in square meters
    bounds?: [number, number, number, number]; // [west, south, east, north]
  };
}

export interface MapLayer {
  id: string;
  name: string;
  url: string;
  visible: boolean;
  type: 'wms' | 'tile' | 'vector';
  opacity: number;
}

export interface DrawingState {
  mode: 'point' | 'polygon' | 'rectangle' | null;
  isDrawing: boolean;
  currentFeature: AOI | null;
  tempCoordinates: any[];
}

export interface SearchResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: [string, string, string, string];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
}

export interface AppState {
  viewport: MapViewport;
  aois: AOI[];
  layers: MapLayer[];
  selectedAoi: string | null;
  drawing: DrawingState;
  searchResults: SearchResult[];
  isSearching: boolean;
}