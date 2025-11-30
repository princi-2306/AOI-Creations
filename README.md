# AOI Creation Tool 

This project implements an Area of Interest (AOI) creation tool using React, Leaflet, and Leaflet-Geoman. It enables users to draw, edit, and manage polygons and other shapes directly on an interactive map.<br/>

## Map Library Choice

Selected Library: Leaflet + Leaflet-Geoman<br/>
Leaflet was chosen because it offers:<br/>

-A lightweight, efficient mapping engine suitable for web applications.<br/>
-Excellent compatibility with React through react-leaflet.<br/>
-A strong plugin ecosystem, including Leaflet-Geoman, which provides ready-made geometry editing tools (drawing, editing, deleting, and snapping).<br/>

## Architecture Decisions
### Project Structure

```
src/
├── components/
│   ├── map/
│   │   ├── MapContainer.tsx
│   │   ├── MapControls.tsx
│   │   ├── DrawingTools.tsx
│   │   ├── AOILayer.tsx
│   │   ├── DrawControls.tsx
│   │   ├── MapEventHandler.tsx
│   │   ├── MapController.tsx
│   │   ├── CurrentDrawing.tsx
│   │   |── LeafletFix.tsx
|   |   |── FeatureLayer.tsx
|   |   └── SearchSection.tsx
│   ├── Layout/
│       └── Sidebar.tsx
│   ├── UI/
│       └── Button.tsx
├── services/
│   ├── storageService.ts
│   ├── wmsService.ts
│   └── geocodingService.ts
├── store/
│   └── mapStore.ts
├── types/
│   └── map.types.ts
├── hooks/
│   ├── useFeatures.ts
│   └── useDrawing.ts
├── utils/
│   └── mapHelpers.ts
tests/
    |── example.spec.ts
    ├── draw-aoi.spec.ts
    └── map-load.spec.ts
```

Why This Architecture?<br/>

-Separation of concerns: Map rendering and UI are isolated for easier maintenance.<br/>
-Context API for shared state: Allows AOI data to be accessed anywhere without prop drilling.<br/>
-Utility functions: Geometry logic is extracted for easier testing.<br/>
-Test isolation: Ensures testability and supports CI pipelines.<br/>

## ⚡ Performance Considerations

 Designed to scale toward thousands of points/polygons.<br/>

### Implemented Strategies

-GeoJSON-based AOI storage (lightweight and efficient).<br/>
-Debounced state updates during AOI editing.<br/>
-Event-driven map updates (only the modified layer updates).<br/>

## 🧪 Testing Strategy
What Is Currently Tested (Using Playwright)<br/>

-Map successfully loads with a single Leaflet instance.<br/>
-Drawing controls render and are visible.<br/>
-User can create an AOI (polygon drawn on map).<br/>
-AOI appears in the sidebar after creation.<br/>
-These tests verify the most critical user flows.<br/>

## ⚖️ Trade-offs Made

| Trade-off                                         | Reason                                      |
| ------------------------------------------------- | ------------------------------------------- |
| Used Leaflet (SVG) instead of vector tile engines | Faster development, lighter setup.          |
| Local in-memory AOI storage                       | No backend requirement in scope.            |
| Minimal styling for AOI shapes                    | Prioritized functionality first.            |
| Simplified map rendering                          | Ready to extend to Canvas mode if required. |

## 🏁 Production Readiness

For a production build, the following improvements are recommended:<br/>

### Backend Enhancements

Persistent storage using PostGIS or MongoDB (GeoJSON).<br/>
AOI validation (prevent self-intersecting polygons).<br/>

### Frontend Enhancements

Error handling + user notifications.<br/>
Offline caching.<br/>
User authentication & role-based access for editing AOIs.<br/>
Improved mobile gesture support.<br/>
Switch to Canvas mode for rendering large datasets.<br/>

### DevOps Enhancements

Add CI testing (GitHub Actions).<br/>
Add deployment pipeline (Vercel, AWS, Netlify).<br/>
Automatic visual regression tests.<br/>

## ⏱️ Time Spent Breakdown

| Task                                | Time    |
| ----------------------------------- | ------- |
| Leaflet + Geoman integration        | 1.5 hrs |
| AOI create/edit logic               | 2 hrs   |
| State management (Context API)      | 1 hr    |
| Sidebar + UI wiring                 | 1 hr    |
| Playwright testing                  | 1 hr    |
| Debugging strict mode duplicate map | 45 min  |
| README documentation                | 20 min  |
