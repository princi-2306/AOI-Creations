import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  Search,
  MapPin,
  Loader2,
  Trash2,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { Sidebar } from "@/components/Layout/Sidebar";
import { useMapStore } from "@/store/mapStore";
import { MapContainer } from "@/components/map/MapContainer";

export function SearchSection() {
  const [searchValue, setSearchValue] = useState("");
  const [showAreasList, setShowAreasList] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    searchResults,
    isSearching,
    aois,
    selectedAoi,
    searchLocation,
    clearSearch,
    flyToLocation,
    setDrawingMode,
    setSelectedAoi,
    removeAoi,
    clearAois,
  } = useMapStore();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      await searchLocation(searchValue);
    }
  };

  const handleResultClick = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    flyToLocation(lat, lng, 14);
    setSearchValue(result.display_name);
    clearSearch();
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setSearchValue("");
    clearSearch();
    inputRef.current?.focus();
  };

  const handleApplyOutline = () => {
    setDrawingMode("rectangle");
  };

  const handleConfirmAreas = () => {
    if (aois.length > 0) {
      console.log("Confirmed AOIs:", aois);
      setShowConfirmation(true);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  const handleConfirmationProceed = () => {
    console.log("Proceeding with confirmed areas:", aois);
    setShowConfirmation(false);
    // Add your logic here for what happens after confirmation
    // For example: navigate to next step, save data, etc.
  };

  // Auto-show areas list when areas are created
  useEffect(() => {
    if (aois.length > 0 && !showAreasList) {
      setShowAreasList(true);
    }
  }, [aois.length, showAreasList]);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Map Area */}
        <div className="flex-1 relative">
          <MapContainer />
        </div>

        {/* Panel */}
        <div className="w-96 bg-white shadow-lg overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-semibold text-orange-500">
                Define Area of Interest
              </h1>
            </div>
            <p className="text-gray-600 text-sm">
              Search or use vector tool to create your region.
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Search Section */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Search Area
              </label>
              <div className="relative">
                <form onSubmit={handleSearch}>
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="city, town, region..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-amber-50 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 placeholder:text-gray-400"
                  />
                  {searchValue && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  )}
                </form>
              </div>

              {/* Search Results */}
              {isSearching && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-50">
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin text-orange-600 mr-2" />
                    <span className="text-gray-600 text-sm">Searching...</span>
                  </div>
                </div>
              )}

              {searchResults.length > 0 && !isSearching && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-50">
                  {searchResults.map((result) => (
                    <button
                      key={result.place_id}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left p-3 hover:bg-amber-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">
                            {result.display_name.split(",")[0]}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {result.display_name}
                          </div>
                          <div className="text-xs text-gray-400 mt-1 capitalize">
                            {result.type} • {result.class}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Apply Outline Button */}
            <button
              onClick={handleApplyOutline}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Apply outline as base image
            </button>
            <p className="text-xs text-gray-600 text-center">
              You can always edit the shape of the area later
            </p>
            {/* Areas List - Collapsible */}

            {/* Areas List - Collapsible */}
            {aois.length > 0 && (
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setShowAreasList(!showAreasList)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                    <span className="font-medium text-gray-900">
                      Areas ({aois.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {selectedAoi ? "1 selected" : "None selected"}
                    </span>
                    <div
                      className={`transform transition-transform ${
                        showAreasList ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </button>

                {showAreasList && (
                  <div className="px-4 pb-3 max-h-60 overflow-y-auto">
                    <div className="space-y-2">
                      {aois.map((aoi, index) => (
                        <div
                          key={aoi.id}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border-2 ${
                            selectedAoi === aoi.id
                              ? "bg-orange-50 border-orange-300 shadow-sm"
                              : "bg-gray-50 border-transparent hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            setSelectedAoi(aoi.id);
                            // Fly to this area on the map
                            const map = (window as any).map;
                            if (map) {
                              // Create a temporary layer to get bounds
                              const tempLayer = L.geoJSON(aoi.geometry as any);
                              const bounds = tempLayer.getBounds();
                              if (bounds.isValid()) {
                                map.flyToBounds(bounds, { padding: [50, 50] });
                              }
                            }
                          }}
                        >
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-3 border-2 border-white shadow-sm"
                              style={{ backgroundColor: aoi.color }}
                            />
                            <div>
                              <div className="font-medium text-gray-900">
                                {aoi.name}
                              </div>
                              <div className="text-xs text-gray-500 capitalize">
                                {aoi.properties?.type || "polygon"} •{" "}
                                {aoi.createdAt.toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {selectedAoi === aoi.id && (
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeAoi(aoi.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete area"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Selection Actions */}
                    {selectedAoi && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const selectedAoiData = aois.find(
                                (a) => a.id === selectedAoi
                              );
                              if (selectedAoiData) {
                                console.log("Selected Area:", selectedAoiData);
                                alert(`Selected: ${selectedAoiData.name}`);
                              }
                            }}
                            className="flex-1 text-center text-sm bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                          >
                            Use Selected Area
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Clear All Button */}
                    {aois.length > 1 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <button
                          onClick={clearAois}
                          className="w-full text-center text-sm text-red-600 hover:text-red-700 font-medium py-2"
                        >
                          Clear All Areas
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {/* Popular Locations */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Popular locations in NRW:
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  "Rommerskirchen",
                  "Pulheim",
                  "Dormagen",
                  "Monheim am Rhein",
                  "Langenfeld",
                  "Leverkusen",
                  "Cologne",
                  "Düsseldorf",
                ].map((location) => (
                  <button
                    key={location}
                    onClick={() => {
                      setSearchValue(location);
                      searchLocation(location);
                    }}
                    className="flex items-center p-2 text-gray-600 hover:text-orange-600 hover:bg-amber-50 rounded transition-colors text-left"
                  >
                    <MapPin className="w-3 h-3 mr-2 flex-shrink-0" />
                    <span className="truncate">{location}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Spacer */}
            <div className="flex-1" />
            {/* Confirm Button */}
            <button
              onClick={handleConfirmAreas}
              disabled={aois.length === 0}
              className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors ${
                aois.length > 0
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Confirm Area of Interest
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Area of Interest Confirmed
              </h3>
              <button
                onClick={handleConfirmationClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <p className="text-center text-gray-600 mb-2">
                Successfully confirmed <strong>{aois.length}</strong> area
                {aois.length > 1 ? "s" : ""} of interest.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Confirmed Areas:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {aois.map((aoi) => (
                    <li key={aoi.id} className="flex items-center">
                      <div
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: aoi.color }}
                      />
                      {aoi.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleConfirmationClose}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Edit Areas
              </button>
              <button
                onClick={handleConfirmationProceed}
                className="flex-1 py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}