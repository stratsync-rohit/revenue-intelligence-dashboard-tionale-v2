// MetricCard.tsx
import React from "react";

export type CardMetric = {
  title: string;
  value: React.ReactNode;
  change?: string;
};

interface MetricCardProps extends CardMetric {
  style?: React.CSSProperties;
  className?: string;
}

const UpIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    width="12"
    height="12"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 19V6" />
    <path d="M5 12l7-7 7 7" />
  </svg>
);

const DownIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    width="12"
    height="12"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v13" />
    <path d="M19 12l-7 7-7-7" />
  </svg>
);

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change = "",
  style,
  className,
}) => {
  const raw = (change ?? "").trim();
  const lower = raw.toLowerCase();

  const isDuration =
    /\b\d+\s*(days?|d)\b/.test(lower) || /\b(days?|d)\b/.test(lower);

  const isPositive =
    raw.startsWith("+") || lower.includes(" up") || lower.includes("↑");

  const isNegative = raw.startsWith("-") && !isDuration;

  const toneClass = isNegative
    ? "badge-danger"
    : isPositive
    ? "badge-success"
    : "badge-neutral";

  const extraClass = isDuration ? "badge-duration" : "";

  const showBadge = raw.length > 0;

  
  const badgeStyle: React.CSSProperties = isNegative
    ? {
       backgroundColor: "rgb(254 226 226)", 

      }
    : {};

  return (
    <article
  className={`card ${className ?? ""}`}
  aria-label={`Metric: ${title}`}
  style={style}
>
  {/* Header */}
  <div className="card-header flex items-center gap-2">
    <p
      className="stat-card-label font-medium uppercase leading-tight tracking-wide
                 text-[10px] sm:text-xs md:text-sm truncate"
      style={{ color: "rgb(var(--color-text-tertiary))" }}
    >
      {title}
    </p>

    {showBadge && (
      <div
        className={`badge ${toneClass} ${extraClass}`}
        title={raw}
        aria-label={raw}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          ...badgeStyle, // dynamic override stays
        }}
      >
        {isPositive && !isDuration && <UpIcon />}
        {isNegative && !isDuration && <DownIcon />}
        <span className="text-xs leading-none">
          {raw}
        </span>
      </div>
    )}
  </div>

  {/* Value */}
  <div className="stat-value mt-1.5">
    <p
      className="font-semibold tracking-tight
                 text-[1.15rem] sm:text-[1.35rem] md:text-[1.6rem]"
      style={{ color: "rgb(var(--color-text-primary))" }}
    >
      {value}
    </p>
  </div>
</article>

  );
};

export default MetricCard;
