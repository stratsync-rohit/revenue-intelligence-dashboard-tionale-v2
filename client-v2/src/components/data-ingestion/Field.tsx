import React from "react";

export type FieldProps = {
  label: string;
  value: string;
  highlight?: boolean;
  icon?: React.ReactNode;
};

const Field: React.FC<FieldProps> = ({ label, value, highlight, icon }) => (
  <div className="rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2" style={{ border: '1px solid rgb(var(--color-border-light))', backgroundColor: 'rgb(var(--color-bg-secondary))' }}>
    <p className="text-xs sm:text-sm font-medium uppercase tracking-wide flex items-center gap-1 sm:gap-1.5" style={{ color: 'rgb(var(--color-text-tertiary))' }}>
      {icon && <span className="text-sm sm:text-base">{icon}</span>}
      <span className="truncate">{label}</span>
    </p>
    <p
      className={`mt-0.5 text-sm sm:text-base break-words ${
        highlight ? "font-semibold" : ""
      }`}
      style={{ color: highlight ? 'rgb(var(--color-warning))' : 'rgb(var(--color-text-secondary))' }}
    >
      {value}
    </p>
  </div>
);

export default Field;
