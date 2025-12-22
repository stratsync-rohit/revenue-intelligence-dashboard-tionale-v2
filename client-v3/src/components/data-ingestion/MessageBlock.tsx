import React from "react";
import ActionButton from "./ActionButton";
import Field from "./Field";
import SourceBadge from "./SourceBadge";
import { MessageBlockProps } from "./types";

import {
  IoCubeOutline,
  IoPricetagOutline,
  IoCashOutline,
  IoLayersOutline,
  IoCardOutline,
  IoLocationOutline,
  IoPersonOutline,
  IoTimeOutline,
  IoStatsChartOutline,
} from "react-icons/io5";

const MessageBlock: React.FC<MessageBlockProps> = ({
  source,
  time,
  rawMessage,
  extracted,
}) => {
  return (
   <div className="card-flat space-y-4 sm:space-y-6">
  {/* TITLE */}
  <div className="space-y-1">
    <h1
      className="text-xl sm:text-2xl font-semibold"
      style={{ color: "rgb(var(--color-text-primary))" }}
    >
      Real-Time Data Ingestion
    </h1>

    <p
      className="text-sm sm:text-base"
      style={{ color: "rgb(var(--color-text-secondary))" }}
    >
      AI-powered parsing extracts structured insights from incoming messages
    </p>
  </div>

  {/* MAIN BLOCK */}
  <div
    className="rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-4 sm:space-y-5"
    style={{
      backgroundColor: "rgb(var(--color-bg-secondary))",
      border: "1px solid rgb(var(--color-border-light))",
      boxShadow: "var(--shadow-sm)",
    }}
  >
    {/* HEADER */}
    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-sm">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <SourceBadge source={source} />
        <span style={{ color: "rgb(var(--color-text-quaternary))" }}>•</span>
        <span
          className="text-xs sm:text-sm"
          style={{ color: "rgb(var(--color-text-tertiary))" }}
        >
          {time}
        </span>
      </div>

      <span className="badge-ingested">
        <span className="badge-ingested-dot" />
        Ingested
      </span>
    </div>

    {/* RAW MESSAGE */}
    <section className="space-y-1">
      <p
        className="text-xs sm:text-sm font-semibold uppercase tracking-wide"
        style={{ color: "rgb(var(--color-text-tertiary))" }}
      >
        Raw Message
      </p>

      <div className="message-block">{rawMessage}</div>
    </section>

    {/* AI OUTPUT */}
    <section className="space-y-2">
      <p
        className="text-xs sm:text-sm font-semibold uppercase tracking-wide"
        style={{ color: "rgb(var(--color-text-tertiary))" }}
      >
        AI-Extracted Intelligence
      </p>

      {/* Prioritized grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-base">
        <Field label="Product" value={extracted.product} icon={<IoCubeOutline />} />
        <Field label="Quantity" value={extracted.quantity} icon={<IoLayersOutline />} />

        {extracted.price && (
          <Field label="Price" value={extracted.price} icon={<IoPricetagOutline />} />
        )}

        <Field
          label="Cash Flow Impact"
          value={extracted.cashFlow}
          icon={<IoCashOutline />}
        />

        <Field
          label="Working Capital"
          value={extracted.workingCapital}
          icon={<IoStatsChartOutline />}
        />

        {extracted.paymentTerms && (
          <Field
            label="Payment Terms"
            value={extracted.paymentTerms}
            icon={<IoCardOutline />}
          />
        )}

        <Field label="Location" value={extracted.location} icon={<IoLocationOutline />} />
        <Field label="Customer" value={extracted.customer} icon={<IoPersonOutline />} />
        <Field
          label="Urgency"
          value={extracted.urgency}
          highlight
          icon={<IoTimeOutline />}
        />
      </div>
    </section>

    {/* ACTION BAR */}
    <div
      className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 pt-4 sm:pt-5"
      style={{ borderTop: "1px solid rgb(var(--color-border-light))" }}
    >
      <ActionButton>View in CRM</ActionButton>
      <ActionButton>Create Deal</ActionButton>
      <ActionButton variant="secondary">Generate Quote</ActionButton>
    </div>
  </div>
</div>

  );
};

export default MessageBlock;
