import React from "react";

const SourceBadge: React.FC<{ source: string }> = ({ source }) => {
  const base = "badge";

  switch (source) {
    case "WHATSAPP":
      return (
        <span className={`${base} badge-success`}>
          WhatsApp
        </span>
      );
    case "EMAIL":
      return (
        <span className={base} style={{ backgroundColor: 'rgb(14 165 233 / 0.1)', color: 'rgb(var(--color-info))' }}>
          Email
        </span>
      );
    case "PDF":
      return (
        <span className={base} style={{ backgroundColor: 'rgb(168 85 247 / 0.1)', color: 'rgb(var(--color-secondary))' }}>
          PDF
        </span>
      );
    default:
      return (
        <span className={base} style={{ backgroundColor: 'rgb(var(--color-bg-hover))', color: 'rgb(var(--color-text-secondary))' }}>
          {source}
        </span>
      );
  }
};

export default SourceBadge;
