import React from "react";
import { ButtonVariant } from "./types";

type ActionButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
};

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  variant = "primary",
}) => {
  if (variant === "primary") {
    return (
      <button className="action-btn-primary">
        {children}
      </button>
    );
  }

  /* ---------- Secondary ---------- */

  return (
    <button className="action-btn-secondary">
      {children}
    </button>
  );
};

export default ActionButton;
