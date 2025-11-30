import { SearchResult } from '@/types/map.types';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export const searchLocation = async (query: string): Promise<SearchResult[]> => {
  try {
    const url = new URL(NOMINATIM_URL);
    url.searchParams.set('q', query);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '10');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('countrycodes', 'de'); // Focus on Germany
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data as SearchResult[];
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

export const reverseGeocode = async (lat: number, lng: number): Promise<SearchResult | null> => {
  try {
    const url = new URL('https://nominatim.openstreetmap.org/reverse');
    url.searchParams.set('lat', lat.toString());
    url.searchParams.set('lon', lng.toString());
    url.searchParams.set('format', 'json');
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data as SearchResult;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};