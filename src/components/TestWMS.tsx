// src/components/TestWMS.tsx
import React, { useEffect } from "react";
import { validateWMSLayer } from "@/services/wmsServices";

export const TestWMS: React.FC = () => {
  const [wmsStatus, setWmsStatus] = React.useState<
    "checking" | "online" | "offline"
  >("checking");

  useEffect(() => {
    const checkWMS = async () => {
      try {
        const isValid = await validateWMSLayer();
        setWmsStatus(isValid ? "online" : "offline");
      } catch (error) {
        setWmsStatus("offline");
      }
    };

    checkWMS();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white p-3 rounded-lg shadow-lg border">
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            wmsStatus === "online"
              ? "bg-green-500"
              : wmsStatus === "offline"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        />
        <span className="text-sm font-medium">
          WMS:{" "}
          {wmsStatus === "online"
            ? "Online"
            : wmsStatus === "offline"
            ? "Offline"
            : "Checking..."}
        </span>
      </div>
    </div>
  );
};
