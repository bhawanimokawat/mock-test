import React from "react";

export const LoadingSpinner = ({
  size = "md",
  message = "Loading...",
  fullPage = false,
}) => {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  }[size] || "h-8 w-8 border-3";

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses} border-indigo-600 border-t-transparent rounded-full animate-spin`}
      />
      {message && <p className="text-sm text-slate-500 font-medium">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
