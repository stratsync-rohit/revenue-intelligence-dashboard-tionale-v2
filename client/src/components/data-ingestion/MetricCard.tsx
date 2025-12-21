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

  /* ✅ ADDITION: negative badge style override */
  const badgeStyle: React.CSSProperties = isNegative
    ? {
        backgroundColor: "rgb(239 68 68)", // medium red
        color: "#ffffff", // white text
      }
    : {};

  return (
    <article
      className={`card ${className ?? ""}`}
      aria-label={`Metric: ${title}`}
      style={style}
    >
      <div className="card-header" style={{ alignItems: "center", gap: 8 }}>
        <p
          className="stat-card-label font-medium uppercase leading-tight tracking-wide text-[10px] sm:text-xs md:text-sm"
          style={{ color: "rgb(var(--color-text-secondary))", margin: 0 }}
        >
          {title}
        </p>

        {showBadge ? (
          <div
            className={`badge ${toneClass} ${extraClass}`}
            title={raw}
            aria-hidden={false}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              ...badgeStyle, // ✅ applied here
            }}
          >
            {isPositive && !isDuration && <UpIcon />}
            {isNegative && !isDuration && <DownIcon />}
            <span style={{ fontSize: 12, lineHeight: 1 }}>{raw}</span>
          </div>
        ) : (
          <div style={{ width: 0, height: 0 }} aria-hidden />
        )}
      </div>

      <div className="stat-value" style={{ marginTop: 6 }}>
        <p
          className="font-semibold tracking-tight text-[1.15rem] sm:text-[1.35rem] md:text-[1.6rem]"
          style={{ color: "rgb(var(--color-text-primary))", margin: 0 }}
        >
          {value}
        </p>
      </div>
    </article>
  );
};

export default MetricCard;
