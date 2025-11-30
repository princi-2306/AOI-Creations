import { AOI, MapViewport } from '@/types/map.types';

const FEATURES_KEY = 'satellite-app-aois';
const VIEWPORT_KEY = 'satellite-app-viewport';

export const storageService = {
  saveFeatures: (aois: AOI[]) => {
    try {
      localStorage.setItem(FEATURES_KEY, JSON.stringify(aois));
    } catch (error) {
      console.warn('Failed to save AOIs to localStorage:', error);
    }
  },

  loadFeatures: (): AOI[] => {
    try {
      const stored = localStorage.getItem(FEATURES_KEY);
      if (!stored) return [];
      
      const data = JSON.parse(stored);
  
      return data.map((aoi: any) => ({
        ...aoi,
        createdAt: new Date(aoi.createdAt)
      }));
    } catch (error) {
      console.warn('Failed to load AOIs from localStorage:', error);
      return [];
    }
  },

  saveViewport: (viewport: MapViewport) => {
    try {
      localStorage.setItem(VIEWPORT_KEY, JSON.stringify(viewport));
    } catch (error) {
      console.warn('Failed to save viewport to localStorage:', error);
    }
  },

  loadViewport: (): MapViewport | null => {
    try {
      const stored = localStorage.getItem(VIEWPORT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Failed to load viewport from localStorage:', error);
      return null;
    }
  }
};