import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-dark disabled:bg-ink-faint disabled:cursor-not-allowed",
  secondary:
    "bg-transparent text-ink border border-line hover:border-ink-faint hover:bg-stone-soft disabled:opacity-40 disabled:cursor-not-allowed",
  ghost: "bg-transparent text-ink-soft hover:text-ink disabled:opacity-40",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(function Button({ variant = "primary", className = "", ...props }, ref) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-200 active:scale-[0.98] ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
});
