import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "outlined";
}

export default function Card({
  children,
  variant = "default",
  className = "",
  ...rest
}: CardProps) {
  const base = "bg-white rounded-xl shadow-sm p-6";
  const outline = "border border-gray-100";

  return (
    <div
      className={`${base} ${
        variant === "outlined" ? outline : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
