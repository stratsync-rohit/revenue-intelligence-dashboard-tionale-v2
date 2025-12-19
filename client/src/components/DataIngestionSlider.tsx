import React, { useState, useEffect } from "react";

export interface DataSource {
  name: string;
  status: "synced" | "syncing" | "pending";
  lastSyncTime: string;
  recordsCount: number;
  icon: string;
}

interface DataIngestionSliderProps {
  dataSources?: DataSource[];
}

const DataIngestionSlider: React.FC<DataIngestionSliderProps> = ({
  dataSources = [
    {
      name: "Market Prices",
      status: "synced",
      lastSyncTime: "2 min ago",
      recordsCount: 1240,
      icon: "📊",
    },
    {
      name: "Trade Orders",
      status: "synced",
      lastSyncTime: "Just now",
      recordsCount: 842,
      icon: "📦",
    },
    {
      name: "Customer Data",
      status: "syncing",
      lastSyncTime: "In progress",
      recordsCount: 567,
      icon: "👥",
    },
    {
      name: "Freight Rates",
      status: "pending",
      lastSyncTime: "Pending",
      recordsCount: 0,
      icon: "🚢",
    },
  ],
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const container = document.getElementById("data-sources-container");
    if (container) {
      setCanScroll(container.scrollWidth > container.clientWidth);
    }
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("data-sources-container");
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setScrollPosition(container.scrollLeft);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "synced":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "syncing":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "synced":
        return "✓";
      case "syncing":
        return "↻";
      case "pending":
        return "◐";
      default:
        return "○";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-6 py-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Data Ingestion Pipeline
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Real-time data synchronization from multiple sources
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Left scroll button */}
        {canScroll && scrollPosition > 0 && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-1.5 shadow-md hover:bg-slate-50"
          >
            <svg
              className="h-4 w-4 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Scrollable container */}
        <div
          id="data-sources-container"
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        >
          {dataSources.map((source) => (
            <div
              key={source.name}
              className="flex min-w-max flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-slate-300 hover:bg-slate-100"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{source.icon}</span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-sm font-medium ${getStatusColor(
                    source.status
                  )}`}
                >
                  {getStatusIcon(source.status)} {source.status}
                </span>
              </div>
              <h4 className="mt-2 font-medium text-slate-900">{source.name}</h4>
              <p className="mt-1 text-sm text-slate-600">
                {source.lastSyncTime}
              </p>
              {source.recordsCount > 0 && (
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {source.recordsCount.toLocaleString()} records
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Right scroll button */}
        {canScroll && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-1.5 shadow-md hover:bg-slate-50"
          >
            <svg
              className="h-4 w-4 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default DataIngestionSlider;
