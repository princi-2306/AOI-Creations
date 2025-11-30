// src/hooks/useDrawing.ts
import { useState, useCallback, useRef } from 'react';
import { DrawingState, Feature, Geometry } from '@/types/map.types';
import { createFeature } from '@/utils/mapHelpers';

export const useDrawing = (onFeatureComplete: (feature: Feature) => void) => {
  const [drawing, setDrawing] = useState<DrawingState>({
    mode: null,
    isDrawing: false,
    currentFeature: null,
    tempCoordinates: []
  });

  const drawingRef = useRef<DrawingState>(drawing);
  drawingRef.current = drawing;

  const startDrawing = useCallback((mode: DrawingState['mode']) => {
    setDrawing({
      mode,
      isDrawing: true,
      currentFeature: null,
      tempCoordinates: []
    });
  }, []);

  const cancelDrawing = useCallback(() => {
    setDrawing({
      mode: null,
      isDrawing: false,
      currentFeature: null,
      tempCoordinates: []
    });
  }, []);

  const addCoordinate = useCallback((lng: number, lat: number) => {
    if (!drawingRef.current.isDrawing || !drawingRef.current.mode) return;

    const { mode, tempCoordinates } = drawingRef.current;
    const newTempCoordinates = [...tempCoordinates, [lng, lat]];

    let geometry: Geometry | null = null;
    let isComplete = false;

    switch (mode) {
      case 'point':
        geometry = {
          type: 'Point',
          coordinates: [lng, lat]
        };
        isComplete = true;
        break;

      case 'line':
        if (newTempCoordinates.length >= 2) {
          geometry = {
            type: 'LineString',
            coordinates: newTempCoordinates
          };
          // For lines, complete on double click or explicit action
          isComplete = false;
        }
        break;

      case 'polygon':
        if (newTempCoordinates.length >= 3) {
          // Close the polygon
          geometry = {
            type: 'Polygon',
            coordinates: [[...newTempCoordinates, newTempCoordinates[0]]]
          };
          isComplete = true;
        }
        break;

      case 'rectangle':
        if (newTempCoordinates.length === 2) {
          const [start, end] = newTempCoordinates;
          geometry = {
            type: 'Polygon',
            coordinates: [[
              [start[0], start[1]],
              [end[0], start[1]],
              [end[0], end[1]],
              [start[0], end[1]],
              [start[0], start[1]]
            ]]
          };
          isComplete = true;
        }
        break;
    }

    if (geometry && isComplete) {
      const feature = createFeature(geometry, { type: mode });
      onFeatureComplete(feature);
      cancelDrawing();
    } else {
      setDrawing(prev => ({
        ...prev,
        tempCoordinates: newTempCoordinates,
        currentFeature: geometry ? createFeature(geometry, { type: mode }) : null
      }));
    }
  }, [onFeatureComplete, cancelDrawing]);

  const completeDrawing = useCallback(() => {
    if (!drawingRef.current.currentFeature) return;

    const feature = drawingRef.current.currentFeature;
    onFeatureComplete(feature);
    cancelDrawing();
  }, [onFeatureComplete, cancelDrawing]);

  return {
    drawing,
    startDrawing,
    cancelDrawing,
    addCoordinate,
    completeDrawing
  };
};