import { Home, Grid3x3, MapPin } from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<"home" | "regions" | "dashboard">(
    "home"
  );

  const handleNavigation = (tab: "home" | "regions" | "dashboard") => {
    setActiveTab(tab);
    console.log(`Navigating to: ${tab}`);
  };

  const getButtonClasses = (tab: string) => {
    const baseClasses = "p-3 rounded-lg transition-colors";
    const isActive = activeTab === tab;

    return `${baseClasses} ${
      isActive
        ? "bg-gray-600 border-l-2 border-orange-500"
        : "hover:bg-gray-600"
    }`;
  };

  return (
    <div className="w-20 bg-gray-700 flex flex-col items-center py-6 gap-8">
      {/* Logo */}
      <button
        className="w-12 h-12 bg-gray-600 rounded flex items-center justify-center hover:bg-gray-500 transition-colors"
        onClick={() => handleNavigation("home")}
        title="Home"
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full" />
          <div
            className="w-4 h-2 bg-orange-500 absolute ml-3"
            style={{ transform: "rotate(45deg)" }}
          />
        </div>
      </button>

      {/* Navigation Icons */}
      <nav className="flex flex-col gap-8">
        <button
          className={getButtonClasses("home")}
          onClick={() => handleNavigation("home")}
          title="Home"
        >
          <Home
            className={`w-6 h-6 ${
              activeTab === "home" ? "text-orange-500" : "text-amber-100"
            }`}
          />
        </button>
        <button
          className={getButtonClasses("regions")}
          onClick={() => handleNavigation("regions")}
          title="Regions"
        >
          <MapPin
            className={`w-6 h-6 ${
              activeTab === "regions" ? "text-orange-500" : "text-amber-100"
            }`}
          />
        </button>
        <button
          className={getButtonClasses("dashboard")}
          onClick={() => handleNavigation("dashboard")}
          title="Dashboard"
        >
          <Grid3x3
            className={`w-6 h-6 ${
              activeTab === "dashboard" ? "text-orange-500" : "text-amber-100"
            }`}
          />
        </button>
      </nav>
    </div>
  );
}
