import React, { useEffect } from "react";
import { X } from "lucide-react";
import Button from "./Button";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText,
  cancelText = "Cancel",
  onConfirm,
  confirmVariant = "primary",
  isLoading = false,
  maxWidth = "max-w-md",
}) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div
          className={`relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all w-full ${maxWidth} p-6 border border-slate-100`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="py-4 text-sm text-slate-600">{children}</div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            {cancelText && (
              <Button variant="outline" size="md" onClick={onClose} disabled={isLoading}>
                {cancelText}
              </Button>
            )}
            {confirmText && (
              <Button
                variant={confirmVariant}
                size="md"
                onClick={onConfirm}
                loading={isLoading}
              >
                {confirmText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
