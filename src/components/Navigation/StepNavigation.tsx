// src/components/Navigation/StepNavigation.tsx
import React from "react";
import { ChevronRight } from "lucide-react";
import { useMapStore } from "@/store/mapStore";

const steps = [
  { id: "define-scope", label: "Define Project Scope" },
  { id: "select-base", label: "Select Base Image" },
  { id: "define-aoi", label: "Define Area of Interest" },
  { id: "define-objects", label: "Define Objects" },
] as const;

export const StepNavigation: React.FC = () => {
  const { currentStep } = useMapStore();
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              className={`flex items-center ${
                index <= currentIndex ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index === currentIndex
                    ? "bg-blue-600 text-white"
                    : index < currentIndex
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`ml-2 font-medium ${
                  index === currentIndex ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="text-sm text-gray-500">
        Step {currentIndex + 1} of {steps.length}
      </div>
    </div>
  );
};
