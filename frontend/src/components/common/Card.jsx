
import React from "react";

export const Card = ({
  children,
  className = "",
  hover = false,
  onClick,
  ...props
}) => {
  const isClickable = typeof onClick === "function";

  return (
    <div
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onClick(event);
            }
          }
          : undefined
      }
      className={[
        "overflow-hidden rounded-2xl border border-slate-200/80",
        "bg-white shadow-sm",
        "transition-all duration-300 ease-out",
        hover &&
        "hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/60",
        isClickable &&
        "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={[
      "flex items-center justify-between gap-4",
      "border-b border-slate-100 px-5 py-4 sm:px-6",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    {...props}
  >
    {children}
  </div>
);

export const CardBody = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={["p-5 sm:p-6", className].filter(Boolean).join(" ")}
    {...props}
  >
    {children}
  </div>
);

export const CardFooter = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={[
      "flex flex-wrap items-center justify-between gap-3",
      "border-t border-slate-100 bg-slate-50/70",
      "px-5 py-4 sm:px-6",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    {...props}
  >
    {children}
  </div>
);

export default Card;
