
import { create } from "zustand";
import {
  AppState,
  MapViewport,
  AOI,
  MapLayer,
  DrawingState,
} from "@/types/map.types";
import { storageService } from "@/services/storageService";
import { searchLocation } from "@/services/geocodingServices";

interface MapStore extends AppState {
  // Viewport
  setViewport: (viewport: Partial<MapViewport>) => void;

  // AOIs
  setAois: (aois: AOI[]) => void;
  addAoi: (aoi: Omit<AOI, "id" | "createdAt">) => void;
  updateAoi: (id: string, updates: Partial<AOI>) => void;
  removeAoi: (id: string) => void;
  clearAois: () => void;
  setSelectedAoi: (id: string | null) => void;

  // Layers
  toggleLayerVisibility: (layerId: string) => void;

  // Drawing
  setDrawingMode: (mode: DrawingState["mode"]) => void;
  cancelDrawing: () => void;
  addCoordinate: (lng: number, lat: number) => void;
  finishPolygon: () => void;

  // Search
  searchLocation: (query: string) => Promise<void>;
  clearSearch: () => void;
  flyToLocation: (lat: number, lng: number, zoom?: number) => void;
}

const initialViewport: MapViewport = {
  center: [51.4782, 7.555],
  zoom: 10,
};

// Layers for WMS/tiles
const initialLayers: MapLayer[] = [
  {
    id: "nw-dop",
    name: "NRW Satellite Imagery",
    url: "https://www.wms.nrw.de/geobasis/wms_nw_dop",
    visible: true,
    type: "wms",
    opacity: 1,
  },
];

export const useMapStore = create<MapStore>((set, get) => ({
  // ---------- INITIAL STATE ----------
  viewport: initialViewport,
  aois: storageService.loadAois?.() || [],
  layers: initialLayers,
  selectedAoi: null,

  drawing: {
    mode: null,
    isDrawing: false,
    tempCoordinates: [],
    currentFeature: null,
  },

  searchResults: [],
  isSearching: false,

  // ---------- VIEWPORT ----------
  setViewport: (viewport) => {
    set((state) => ({
      viewport: { ...state.viewport, ...viewport },
    }));
    storageService.saveViewport(get().viewport);
  },

  // ---------- AOI ACTIONS ----------
  setAois: (aois) => {
    set({ aois });
    storageService.saveAois?.(aois);
  },

  addAoi: (aoiData) => {
    const newAoi: AOI = {
      ...aoiData,
      id: `aoi_${Date.now()}_${crypto.randomUUID()}`,
      createdAt: new Date(),
    };

    set((state) => ({ aois: [...state.aois, newAoi] }));
    storageService.saveAois?.(get().aois);
  },

  updateAoi: (id, updates) => {
    set((state) => ({
      aois: state.aois.map((aoi) =>
        aoi.id === id ? { ...aoi, ...updates } : aoi
      ),
    }));
    storageService.saveAois?.(get().aois);
  },

  removeAoi: (id) => {
    set((state) => ({
      aois: state.aois.filter((x) => x.id !== id),
      selectedAoi: state.selectedAoi === id ? null : state.selectedAoi,
    }));
    storageService.saveAois?.(get().aois);
  },

  clearAois: () => {
    set({ aois: [], selectedAoi: null });
    storageService.saveAois?.([]);
  },

  setSelectedAoi: (id) => set({ selectedAoi: id }),

  // ---------- LAYERS ----------
  toggleLayerVisibility: (layerId) => {
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId
          ? { ...layer, visible: !layer.visible }
          : layer
      ),
    }));
  },

  // ---------- DRAWING ----------
  setDrawingMode: (mode) => {
    set({
      drawing: {
        mode,
        isDrawing: true,
        tempCoordinates: [],
        currentFeature: null,
      },
      selectedAoi: null,
    });
  },

  cancelDrawing: () => {
    set({
      drawing: {
        mode: null,
        isDrawing: false,
        tempCoordinates: [],
        currentFeature: null,
      },
    });
  },

  addCoordinate: (lng, lat) => {
    const { drawing } = get();

    if (!drawing.isDrawing || !drawing.mode) return;

    const updated = [...drawing.tempCoordinates, [lng, lat]];

    // RECTANGLE → AUTO COMPLETE
    if (drawing.mode === "rectangle" && updated.length === 2) {
      const [[x1, y1], [x2, y2]] = updated;
      const geometry = {
        type: "Polygon" as const,
        coordinates: [[
          [x1, y1],
          [x2, y1],
          [x2, y2],
          [x1, y2],
          [x1, y1],
        ]],
      };

      get().addAoi({
        name: `Area ${get().aois.length + 1}`,
        geometry,
        color: randomColor(),
        properties: {},
      });

      get().cancelDrawing();
      return;
    }

    // POLYGON → KEEP ADDING COORDS
    set((state) => ({
      drawing: {
        ...state.drawing,
        tempCoordinates: updated,
      },
    }));
  },

  // FINISH polygon (double click or "Finish" button)
  finishPolygon: () => {
    const { tempCoordinates } = get().drawing;

    if (tempCoordinates.length < 3) return;

    const geometry = {
      type: "Polygon" as const,
      coordinates: [[...tempCoordinates, tempCoordinates[0]]], // close ring
    };

    get().addAoi({
      name: `Area ${get().aois.length + 1}`,
      geometry,
      color: randomColor(),
      properties: {},
    });

    get().cancelDrawing();
  },

  // ---------- SEARCH ----------
  searchLocation: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [], isSearching: false });
      return;
    }

    set({ isSearching: true });

    try {
      const results = await searchLocation(query);
      set({ searchResults: results, isSearching: false });
    } catch (e) {
      console.error(e);
      set({ searchResults: [], isSearching: false });
    }
  },

  clearSearch: () => set({ searchResults: [], isSearching: false }),

  flyToLocation: (lat, lng, zoom = 14) => {
    const map = (window as any).map;

    if (map) {
      map.flyTo([lat, lng], zoom);
    } else {
      get().setViewport({ center: [lat, lng], zoom });
    }
  },
}));

// ---------- UTILS ----------
function randomColor() {
  const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"];
  return colors[Math.floor(Math.random() * colors.length)];
}
