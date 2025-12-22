import React from "react";

export type Signal = {
  name: string;
  route: string;
  buyPrice: string;
  sellPrice: string;
  confidence: string;
  window: string;
  margin: string; // e.g. "+11.3%"
};

interface SignalsSectionProps {
  signals: Signal[];
  onAskAI?: (signalName: string) => void;
}

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

const SignalsSection: React.FC<SignalsSectionProps> = ({
  signals,
  onAskAI,
}) => {
  return (
    <div className="card-flat xl:col-span-2">
      {/* HEADER */}
      <div className="mb-3 sm:mb-4 flex items-center justify-between">
        <div className="space-y-1">
          <h2
            className="text-base sm:text-lg font-semibold leading-tight"
            style={{ color: "rgb(var(--color-text-primary))" }}
          >
            Active Arbitrage Signals
          </h2>

          <p
            className="text-xs sm:text-sm leading-relaxed"
            style={{ color: "rgb(var(--color-text-secondary))" }}
          >
            Real-time price opportunities across markets
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span
            className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full"
            style={{ backgroundColor: "rgb(var(--color-status-active))" }}
          />
          <span
            className="text-xs sm:text-sm font-medium"
            style={{ color: "rgb(var(--color-success))" }}
          >
            Live
          </span>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-2 sm:space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {signals.map((s) => (
          <article
            key={s.name}
            className="card-flat relative overflow-hidden p-3 sm:p-4"
            aria-labelledby={`signal-${s.name}`}
          >
            {/* DESKTOP ABSOLUTE BADGE (inside card, near metrics) */}
            <div className="hidden md:block absolute top-3 sm:top-4 right-4 sm:right-6">
              <div className="badge-margin-desktop" aria-hidden="true">
                <span className="margin-value">{s.margin}</span>
                <span className="margin-label">margin</span>
              </div>
            </div>

            {/* TITLE ROW: title + MOBILE INLINE BADGE (inline next to title) */}
            <div className="flex items-start justify-between gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                  <h3
                    id={`signal-${s.name}`}
                    className="text-sm sm:text-base font-semibold whitespace-normal break-words"
                    style={{ color: "rgb(var(--color-text-primary))" }}
                    title={s.name}
                  >
                    {s.name}
                  </h3>

                  {/* mobile badge (shows next to title) */}
                  <div className="md:hidden flex-shrink-0">
                    <div className="badge-margin-mobile" aria-hidden="true">
                      <span className="margin-value">{s.margin}</span>
                      <span className="margin-label">margin</span>
                    </div>
                  </div>
                </div>

                <p
                  className="mt-0.5 sm:mt-1 text-xs sm:text-sm truncate"
                  style={{ color: "rgb(var(--color-text-tertiary))" }}
                  title={s.route}
                >
                  {s.route}
                </p>
              </div>
            </div>

            {/* METRICS GRID */}
            <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-y-2 gap-x-3 text-sm sm:grid-cols-4 sm:gap-x-6 md:gap-x-8">
              {/* Buy Price */}
              <div>
                <p
                  className="text-xs sm:text-sm leading-tight"
                  style={{ color: "rgb(var(--color-text-tertiary))" }}
                >
                  Buy Price
                </p>
                <p
                  className="mt-0.5 sm:mt-1 text-sm sm:text-base font-semibold leading-tight"
                  style={{ color: "rgb(var(--color-text-primary))" }}
                >
                  {s.buyPrice}
                </p>
              </div>

              {/* Sell Price */}
              <div>
                <p
                  className="text-xs sm:text-sm leading-tight"
                  style={{ color: "rgb(var(--color-text-tertiary))" }}
                >
                  Sell Price
                </p>
                <p
                  className="mt-0.5 sm:mt-1 text-sm sm:text-base font-semibold leading-tight"
                  style={{ color: "rgb(var(--color-text-primary))" }}
                >
                  {s.sellPrice}
                </p>
              </div>

              {/* Confidence */}
              <div>
                <p
                  className="text-xs sm:text-sm leading-tight"
                  style={{ color: "rgb(var(--color-text-tertiary))" }}
                >
                  Confidence
                </p>
                <p
                  className="mt-0.5 sm:mt-1 text-sm sm:text-base font-semibold leading-tight"
                  style={{ color: "rgb(var(--color-info))" }}
                >
                  {s.confidence}
                </p>
              </div>

              {/* Window */}
              <div>
                <p
                  className="text-xs sm:text-sm leading-tight"
                  style={{ color: "rgb(var(--color-text-tertiary))" }}
                >
                  Window
                </p>
                <p
                  className="mt-0.5 sm:mt-1 text-sm sm:text-base font-semibold leading-tight"
                  style={{ color: "rgb(var(--color-warning))" }}
                >
                  {s.window}
                </p>
              </div>
            </div>

            {/* DIVIDER */}
            <div
              className="my-3 sm:my-4 border-t"
              style={{ borderColor: "rgb(var(--color-border-medium))" }}
            />

            {/* ASK AI BUTTON (full width bottom) */}
            <div className="flex w-full justify-end mr-10">
              <button
                onClick={() => onAskAI?.(s.name)}
                aria-label={`Ask AI about ${s.name}`}
                className="btn-ask-ai"
              >
                <ChatIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 btn-ask-ai-icon" />
                <span>Ask AI</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default SignalsSection;
