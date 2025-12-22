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
  style={style}
>
  {/* Header: Label + Delta badge */}
  <div className="card-header flex items-center justify-between gap-2">
    <p
      className="stat-card-label font-medium uppercase
                 text-[10px] sm:text-xs md:text-sm
                 tracking-wide truncate"
      style={{ color: "rgb(var(--color-text-tertiary))" }}
    >
      {card.label}
    </p>

    {card.delta && (
      <div
        className={`badge ${toneClass}`}
        title={`Change: ${card.delta}`}
        aria-label={`Change: ${card.delta}`}
      >
        <span className="text-xs leading-none">
          {card.delta}
        </span>
      </div>
    )}
  </div>

  {/* Value */}
  <div className="stat-value mt-2">
    <p
      className="font-semibold tracking-tight
                 text-[1.15rem] sm:text-[1.35rem] md:text-[1.6rem]"
      style={{ color: "rgb(var(--color-text-primary))" }}
    >
      {card.value}
    </p>
  </div>
</article>

  );
};

export default StatCardComponent;
