// src/hooks/useFeatures.ts
import { useState, useEffect, useCallback } from 'react';
import { Feature } from '@/types/map.types';
import { storageService } from '@/services/storageService';

export const useFeatures = () => {
  const [features, setFeatures] = useState<Feature[]>([]);

  // Load features from storage on mount
  useEffect(() => {
    const savedFeatures = storageService.loadFeatures();
    setFeatures(savedFeatures);
  }, []);

  // Save features to storage whenever they change
  useEffect(() => {
    storageService.saveFeatures(features);
  }, [features]);

  const addFeature = useCallback((feature: Omit<Feature, 'id'>) => {
    const newFeature: Feature = {
      ...feature,
      id: `feature_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setFeatures(prev => [...prev, newFeature]);
    return newFeature.id;
  }, []);

  const updateFeature = useCallback((id: string, updates: Partial<Feature>) => {
    setFeatures(prev => 
      prev.map(feature => 
        feature.id === id 
          ? { ...feature, ...updates, properties: { ...feature.properties, updatedAt: new Date().toISOString() } }
          : feature
      )
    );
  }, []);

  const removeFeature = useCallback((id: string) => {
    setFeatures(prev => prev.filter(feature => feature.id !== id));
  }, []);

  const clearFeatures = useCallback(() => {
    setFeatures([]);
  }, []);

  const getFeature = useCallback((id: string) => {
    return features.find(feature => feature.id === id);
  }, [features]);

  return {
    features,
    addFeature,
    updateFeature,
    removeFeature,
    clearFeatures,
    getFeature
  };
};