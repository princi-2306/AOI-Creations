import { Feature, Geometry, MapViewport } from '@/types/map.types';

export const generateId = (): string => {
  return `feature_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createFeature = (
  geometry: Geometry,
  properties: Partial<Feature['properties']> = {}
): Feature => {
  const now = new Date().toISOString();
  
  return {
    id: generateId(),
    type: 'Feature',
    geometry,
    properties: {
      name: properties.name || `Feature ${new Date().toLocaleTimeString()}`,
      description: properties.description || '',
      createdAt: now,
      updatedAt: now,
      color: properties.color || getRandomColor(),
      type: properties.type || 'polygon'
    }
  };
};

export const getRandomColor = (): string => {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const calculateBounds = (features: Feature[]): [number, number, number, number] | null => {
  if (features.length === 0) return null;

  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  features.forEach(feature => {
    const coords = feature.geometry.coordinates;
    processCoordinates(coords, (lng: number, lat: number) => {
      minLng = Math.min(minLng, lng);
      minLat = Math.min(minLat, lat);
      maxLng = Math.max(maxLng, lng);
      maxLat = Math.max(maxLat, lat);
    });
  });

  return [minLng, minLat, maxLng, maxLat];
};

const processCoordinates = (coords: any, callback: (lng: number, lat: number) => void): void => {
  if (Array.isArray(coords)) {
    if (typeof coords[0] === 'number') {
      callback(coords[0], coords[1]);
    } else {
      coords.forEach(coord => processCoordinates(coord, callback));
    }
  }
};

export const formatCoordinate = (coord: number, precision: number = 6): string => {
  return coord.toFixed(precision);
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Helper to compare viewports and prevent unnecessary updates
export const viewportEquals = (a: MapViewport, b: MapViewport): boolean => {
  return (
    a.center[0] === b.center[0] &&
    a.center[1] === b.center[1] &&
    a.zoom === b.zoom
  );
};