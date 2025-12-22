import React, { useRef, useLayoutEffect, useEffect, useState } from "react";

export type TabKey = "overview" | "dataIngestion";

interface HeaderSliderProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
  className?: string;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "dataIngestion", label: "Data Ingestion" },
];

const HeaderSlider: React.FC<HeaderSliderProps> = ({ activeTab, onChange, className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [sliderStyle, setSliderStyle] = useState<{ width: number; left: number }>({
    width: 0,
    left: 0,
  });

  const updateSlider = () => {
    const index = TABS.findIndex((t) => t.key === activeTab);
    const btn = buttonRefs.current[index];
    const container = containerRef.current;
    if (!btn || !container) return;

    const btnRect = btn.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();
    
    // Get the computed padding of the container
    const computedStyle = window.getComputedStyle(container);
    const paddingLeft = parseFloat(computedStyle.paddingLeft);

    setSliderStyle({
      width: Math.round(btnRect.width),
      left: Math.round(btnRect.left - contRect.left - paddingLeft),
    });
  };

  useLayoutEffect(() => {
    updateSlider();
  }, [activeTab]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(updateSlider);
    });

    ro.observe(container);
    buttonRefs.current.forEach((b) => b && ro.observe(b));

    return () => ro.disconnect();
  }, []);

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="relative inline-flex overflow-hidden rounded-full  p-0.5 sm:p-1"
        style={{ backgroundColor: "rgb(var(--color-bg-tertiary))" }}
        role="tablist"
      >
        {/* Slider */}
        <span
          aria-hidden
          className="absolute inset-0.5 sm:inset-1 rounded-full sm:rounded-full transition-all duration-300 ease-out"
          style={{
            backgroundColor: "rgb(var(--color-bg-primary))",
            boxShadow: "var(--shadow-sm)",
            width: sliderStyle.width,
            transform: `translateX(${sliderStyle.left}px)`,
          }}
        />

        {TABS.map((tab, index) => {
          const isActive = tab.key === activeTab;

          return (
            <button
              key={tab.key}
              ref={(el) => (buttonRefs.current[index] = el)}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.key)}
              className="relative z-10 flex items-center gap-2 rounded-xl sm:rounded-2xl px-4 py-2 text-sm font-medium transition-colors duration-200 outline-none"
              style={{
                color: isActive
                  ? "rgb(var(--color-text-primary))"
                  : "rgb(var(--color-text-tertiary))",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HeaderSlider;
