// DealsSection.tsx
import React from "react";

const ChatIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M21 12a8.5 8.5 0 10-3.4 6.7L21 21l-1.3-3.6A8.5 8.5 0 0021 12z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 11h8M8 15h5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const getLikelihoodStyle = (likelihood: string) => {
  const l = likelihood.toLowerCase();

  if (l.includes("high")) {
    return {
      bg: "rgba(16, 185, 129, 0.08)",
      border: "rgba(16, 185, 129, 0.45)",
      text: "rgb(16 185 129)",
    };
  }

  if (l.includes("medium")) {
    return {
      bg: "rgba(234, 179, 8, 0.08)",
      border: "rgba(234, 179, 8, 0.45)",
      text: "rgb(234 179 8)",
    };
  }

  // Low / default
  return {
    bg: "rgba(100, 116, 139, 0.08)",
    border: "rgba(100, 116, 139, 0.45)",
    text: "rgb(100 116 139)",
  };
};

export type Deal = {
  company: string;
  product: string;
  likelihood: string; // e.g. "78% likely"
  suggestedPrice: string;
  expectedMargin: string;
  tags: string[];
};

interface DealsSectionProps {
  deals: Deal[];
  onAskAI?: (dealCompany: string) => void;
}

const DealsSection: React.FC<DealsSectionProps> = ({ deals, onAskAI }) => {
  return (
    <section className="card-flat">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div>
          <h3
            className="text-base sm:text-lg font-semibold"
            style={{ color: "rgb(var(--color-text-primary))" }}
          >
            AI-Powered Deal Recommendations
          </h3>
          <p
            className="mt-1 text-sm sm:text-base"
            style={{ color: "rgb(var(--color-text-secondary))" }}
          >
            Proactive opportunities surfaced from market data and customer
            intent
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mt-5 md:mt-6 grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {deals.map((d) => (
          <article
            key={d.company}
            className="card flex flex-col justify-between p-3 sm:p-4"
            aria-labelledby={`deal-${d.company}`}
          >
            {/* top row: company / product + likelihood */}
            <div className="flex items-start justify-between gap-2 sm:gap-3">
              <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                <div className="min-w-0">
                  <h4
                    id={`deal-${d.company}`}
                    className="text-sm sm:text-base font-semibold truncate"
                    style={{ color: "rgb(var(--color-text-primary))" }}
                  >
                    {d.company}
                  </h4>
                  <p
                    className="mt-0.5 text-xs sm:text-sm truncate"
                    style={{ color: "rgb(var(--color-text-tertiary))" }}
                  >
                    {d.product}
                  </p>
                </div>
              </div>

              {/* probability pill */}
              <div className="flex-shrink-0">
                {(() => {
                  const style = getLikelihoodStyle(d.likelihood);

                  return (
                    <span
                      className="
          inline-flex items-center
          rounded-full
          px-2 sm:px-3
          py-0.5 sm:py-1
          text-xs sm:text-sm
          font-semibold
        "
                      style={{
                        backgroundColor: style.bg,
                        border: `1px solid ${style.border}`,
                        color: style.text,
                        boxShadow: "none",
                      }}
                    >
                      {d.likelihood}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* middle: price + margin */}
            <div className="mt-3 sm:mt-4 flex items-center justify-between gap-3 sm:gap-4">
              <div>
                <p
                  className="text-xs sm:text-sm"
                  style={{ color: "rgb(var(--color-text-primary))" }}
                >
                  Suggested Price
                </p>
                <div
                  className="mt-0.5 sm:mt-1 text-sm sm:text-base font-semibold"
                  style={{ color: "rgb(var(--color-text-primary))" }}
                >
                  {d.suggestedPrice}
                </div>
              </div>

              <div className="text-right">
                <p
                  className="text-xs sm:text-sm"
                  style={{ color: "rgb(var(--color-text-tertiary))" }}
                >
                  Expected Margin
                </p>
                <div
                  className="mt-0.5 sm:mt-1 text-sm sm:text-base font-semibold"
                  style={{ color: "rgb(var(--color-success))" }}
                >
                  {d.expectedMargin}
                </div>
              </div>
            </div>

            {/* divider */}
            <div
              className="my-3 sm:my-4 h-px w-full"
              style={{ backgroundColor: "rgb(var(--color-border-light))" }}
            />

            {/* tags + action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {d.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-2 sm:px-2.5 py-0.5 text-xs sm:text-sm font-medium"
                    style={{
  backgroundColor: "rgb(var(--color-bg-secondary))",
  color: "rgb(var(--color-text-secondary))",
  border: "1px solid rgb(var(--color-border-light))",
}}

                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onAskAI?.(d.company)}
                  className="btn-ask-ai w-full sm:w-auto"
                >
                  <ChatIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-800" />
                  Ask AI
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DealsSection;
