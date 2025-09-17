import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded-md font-medium inline-flex items-center gap-2 justify-center";
  const styles: Record<string, string> = {
    primary: "bg-primary-red text-white hover:opacity-95",
    secondary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
    ghost: "bg-transparent text-primary-red",
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
