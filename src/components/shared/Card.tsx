import { type HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-line bg-card shadow-[0_1px_2px_rgba(41,36,31,0.04)] transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(41,36,31,0.08)] ${className}`}
      {...props}
    />
  );
}
