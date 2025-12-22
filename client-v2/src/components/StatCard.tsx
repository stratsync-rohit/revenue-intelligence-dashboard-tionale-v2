// StatCardComponent.tsx (fixed: prevent mid-word breaks, allow multi-line labels)
import React from "react";

export type StatCard = {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "up" | "down" | "neutral";
};

interface Props {
  card: StatCard;
  style?: React.CSSProperties;
  className?: string;
}

const StatCardComponent: React.FC<Props> = ({ card, style, className }) => {
  const toneClass =
    card.deltaTone === "down"
      ? "badge-danger"
      : card.deltaTone === "up"
      ? "badge-success"
      : "badge-neutral";

  return (
    <article
      className={`card ${className ?? ""}`}
      aria-label={`Stat card: ${card.label}`}
      style={{ ...style }}
    >
      {/* header row: label (left) + badge (right) */}
      <div className="card-header">
        <p
          className="stat-card-label font-medium text-[10px] sm:text-xs md:text-sm"
          style={{
            color: "rgb(var(--color-text-secondary))",
            margin: 0,
            textTransform: "uppercase",      
            wordBreak: "normal",
            overflowWrap: "normal",
            hyphens: "none",
            flex: 1,
            minWidth: 0,
            letterSpacing: "0.02em",
          }}
        >
          {card.label}
        </p>

        {card.delta ? (
          <div
            className={`badge ${toneClass}`}
            aria-hidden={false}
            title={`Change: ${card.delta}`}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
          >
            <span style={{ fontSize: 12, lineHeight: 1 }}>{card.delta}</span>
          </div>
        ) : (
          <div style={{ width: 0, height: 0 }} aria-hidden />
        )}
      </div>


      <div className="stat-value">
        <p
          className="font-semibold tracking-tight text-[1.15rem] sm:text-[1.35rem] md:text-[1.6rem]"
          style={{ color: "rgb(var(--color-text-primary))", margin: 0 }}
        >
          {card.value}
        </p>
      </div>
    </article>
  );
};

export default StatCardComponent;
