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
      <button 
        className="btn-primary w-full sm:w-auto"
        style={{ backgroundColor: 'rgb(var(--color-success))', boxShadow: 'var(--shadow-sm)' }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(var(--color-hover-success))'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(var(--color-success))'}
      >
        {children}
      </button>
    );
  }
  return <button className="btn-secondary w-full sm:w-auto">{children}</button>;
};

export default ActionButton;
