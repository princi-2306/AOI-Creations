# AOI Creation Tool 

This project implements an Area of Interest (AOI) creation tool using React, Leaflet, and Leaflet-Geoman. It enables users to draw, edit, and manage polygons and other shapes directly on an interactive map.

## Map Library Choice

Selected Library: Leaflet + Leaflet-Geoman
Leaflet was chosen because it offers:

-A lightweight, efficient mapping engine suitable for web applications.
-Excellent compatibility with React through react-leaflet.
-A strong plugin ecosystem, including Leaflet-Geoman, which provides ready-made geometry editing tools (drawing, editing, deleting, and snapping).

## Architecture Decisions
### Project Structure

<details>
<summary>📁 Click to view project structure</summary>

```
src/
├── components/
│   ├── Map/
│   │   ├── MapContainer.tsx
│   │   ├── MapControls.tsx
│   │   ├── DrawingTools.tsx
│   │   ├── AOILayer.tsx
│   │   ├── DrawControls.tsx
│   │   ├── MapEventHandler.tsx
│   │   ├── MapController.tsx
│   │   ├── CurrentDrawing.tsx
│   │   └── LeafletFix.tsx
│   ├── Layout/
│   │   ├── Sidebar.tsx
│   │   └── SearchSection.tsx
│   ├── UI/
│   │   └── Button.tsx
│   └── Search/
│       └── SearchBox.tsx
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
└── e2e/
    ├── aoi.spec.ts
    ├── draw-aoi.spec.ts
    ├── reliable-aoi.spec.ts
    └── map-load.spec.ts
```
</details>

Why This Architecture?

-Separation of concerns: Map rendering and UI are isolated for easier maintenance.
-Context API for shared state: Allows AOI data to be accessed anywhere without prop drilling.
-Utility functions: Geometry logic is extracted for easier testing.
-Test isolation: Ensures testability and supports CI pipelines.

## ⚡ Performance Considerations

 Designed to scale toward thousands of points/polygons.

### Implemented Strategies

-GeoJSON-based AOI storage (lightweight and efficient).
-Debounced state updates during AOI editing.
-Event-driven map updates (only the modified layer updates).

## 🧪 Testing Strategy
What Is Currently Tested (Using Playwright)

-Map successfully loads with a single Leaflet instance.
-Drawing controls render and are visible.
-User can create an AOI (polygon drawn on map).
-AOI appears in the sidebar after creation.
-These tests verify the most critical user flows.

## ⚖️ Trade-offs Made

| Trade-off                                         | Reason                                      |
| ------------------------------------------------- | ------------------------------------------- |
| Used Leaflet (SVG) instead of vector tile engines | Faster development, lighter setup.          |
| Local in-memory AOI storage                       | No backend requirement in scope.            |
| Minimal styling for AOI shapes                    | Prioritized functionality first.            |
| Simplified map rendering                          | Ready to extend to Canvas mode if required. |

## 🏁 Production Readiness

For a production build, the following improvements are recommended:

### Backend Enhancements

Persistent storage using PostGIS, MongoDB (GeoJSON), or Tile38.
AOI validation (prevent self-intersecting polygons).

### Frontend Enhancements

Error handling + user notifications.
Offline caching.
User authentication & role-based access for editing AOIs.
Improved mobile gesture support.
Switch to Canvas mode for rendering large datasets.

### DevOps Enhancements

Add CI testing (GitHub Actions).
Add deployment pipeline (Vercel, AWS, Netlify).
Automatic visual regression tests.

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
