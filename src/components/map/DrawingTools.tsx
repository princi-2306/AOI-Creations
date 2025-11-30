import React from "react";
import { Square, MapPin, X } from "lucide-react";
import { Button } from "@/components/UI/Button";
import { useMapStore } from "@/store/mapStore";

export const DrawingTools: React.FC = () => {
  const { drawing, setDrawingMode, cancelDrawing } = useMapStore();

  const tools = [
    { mode: "rectangle" as const, icon: Square, label: "Draw Rectangle" },
    { mode: "polygon" as const, icon: MapPin, label: "Draw Polygon" },
  ];

  return (
    <div className="leaflet-top leaflet-left">
      <div className="leaflet-control leaflet-bar !border-none !bg-transparent !shadow-lg">
        <div className="flex flex-col gap-2 p-2">
          {drawing.mode ? (
            <Button
              icon={X}
              variant="danger"
              size="sm"
              onClick={cancelDrawing}
              title="Cancel Drawing"
            >
              Cancel
            </Button>
          ) : (
            tools.map(({ mode, icon, label }) => (
              <Button
                key={mode}
                icon={icon}
                variant="secondary"
                size="sm"
                onClick={() => setDrawingMode(mode)}
                title={label}
              >
                {label}
              </Button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
