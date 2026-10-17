
import React from "react";

const variants = {
  primary:
    "bg-indigo-50 text-indigo-700 border-indigo-200/80",
  success:
    "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  warning:
    "bg-amber-50 text-amber-700 border-amber-200/80",
  danger:
    "bg-rose-50 text-rose-700 border-rose-200/80",
  info:
    "bg-sky-50 text-sky-700 border-sky-200/80",
  neutral:
    "bg-slate-100 text-slate-700 border-slate-200",
  violet:
    "bg-violet-50 text-violet-700 border-violet-200/80",
};

const sizes = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

const Badge = ({
  children,
  variant = "neutral",
  size = "md",
  className = "",
  icon: Icon,
  dot = false,
}) => {
  const colorClasses = variants[variant] || variants.neutral;
  const sizeClasses = sizes[size] || sizes.md;

  return (
    <span
      className={[
        "inline-flex w-fit shrink-0 items-center gap-1.5",
        "rounded-full border font-semibold leading-none",
        "transition-colors duration-200",
        colorClasses,
        sizeClasses,
        className,
      ].join(" ")}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
          aria-hidden="true"
        />
      )}

      {Icon && <Icon size={13} strokeWidth={2} />}

      {children}
    </span>
  );
};


export default Badge;
