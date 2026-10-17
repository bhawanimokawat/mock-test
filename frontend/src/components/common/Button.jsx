
import React from "react";

const variants = {
  primary:
    "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-600/25 active:bg-indigo-800 focus-visible:ring-indigo-500",

  secondary:
    "bg-slate-800 text-white shadow-sm hover:bg-slate-900 active:bg-slate-950 focus-visible:ring-slate-500",

  outline:
    "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 active:bg-indigo-100 focus-visible:ring-indigo-500",

  danger:
    "bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-500",

  success:
    "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:bg-emerald-800 focus-visible:ring-emerald-500",

  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 focus-visible:ring-slate-400",

  violet:
    "bg-violet-600 text-white shadow-sm shadow-violet-600/20 hover:bg-violet-700 hover:shadow-md active:bg-violet-800 focus-visible:ring-violet-500",
};

const sizes = {
  sm: "min-h-8 rounded-md px-3 py-1.5 text-xs",
  md: "min-h-10 rounded-lg px-4 py-2 text-sm",
  lg: "min-h-12 rounded-xl px-5 py-2.5 text-base",
};

export const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  icon: Icon,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      aria-busy={loading || undefined}
      className={[
        "inline-flex items-center justify-center gap-2",
        "whitespace-nowrap font-semibold",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus-visible:ring-2",
        "focus-visible:ring-offset-2",
        "active:scale-[0.98]",
        "cursor-pointer",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "disabled:shadow-none disabled:active:scale-100",
        "select-none",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className,
      ].join(" ")}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="h-4 w-4 shrink-0 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <span>{children || "Please wait..."}</span>
        </>
      ) : (
        <>
          {Icon && (
            <Icon
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
            />
          )}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
