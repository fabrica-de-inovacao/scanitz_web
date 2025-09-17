import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const base = "px-4 py-2 rounded-md font-medium";
  const styles: Record<string, string> = {
    primary: "bg-primary-red text-white",
    secondary: "bg-white border border-gray-200",
    ghost: "bg-transparent text-primary-red",
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
