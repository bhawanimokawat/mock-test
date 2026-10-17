
import React, { useState } from "react";
import {
  BookOpen,
  ZoomIn,
  ZoomOut,
  FileText,
  AlignLeft,
  Clock3,
} from "lucide-react";

export const PassageViewer = ({ title, content }) => {
  const [fontSize, setFontSize] = useState("text-base");

  const fontSizes = ["text-sm", "text-base", "text-lg"];
  const currentFontIndex = fontSizes.indexOf(fontSize);

  const increaseFont = () => {
    setFontSize(
      fontSizes[Math.min(currentFontIndex + 1, fontSizes.length - 1)]
    );
  };

  const decreaseFont = () => {
    setFontSize(
      fontSizes[Math.max(currentFontIndex - 1, 0)]
    );
  };

  const paragraphs = content
    ? content.trim().split(/\n\s*\n/).filter((p) => p.trim())
    : [];

  const wordCount = content
    ? content.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const isLoading = content == null;
  const isEmpty = !isLoading && !content.trim();

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="shrink-0 border-b border-slate-200 bg-white">
        <div className="flex flex-col gap-3 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
              <BookOpen className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">
                Reading Passage
              </p>

              <h2 className="break-words text-base font-bold leading-snug text-slate-900 sm:text-lg">
                {title || "Reading Comprehension Passage"}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  {wordCount} words
                </span>

                <span className="hidden text-slate-300 sm:inline">•</span>

                <span className="inline-flex items-center gap-1.5">
                  <AlignLeft className="h-3.5 w-3.5" />
                  {paragraphs.length} paragraphs
                </span>
              </div>
            </div>
          </div>

          {/* Font controls */}
          <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-start">
            <span className="text-xs font-medium text-slate-500">
              Reading size
            </span>

            <div
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1"
              aria-label="Reading font size controls"
            >
              <button
                type="button"
                onClick={decreaseFont}
                disabled={currentFontIndex === 0}
                title="Decrease font size"
                aria-label="Decrease font size"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-white hover:text-indigo-600 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ZoomOut className="h-4 w-4" />
              </button>

              <span className="min-w-8 text-center text-xs font-bold text-slate-700">
                {fontSize === "text-sm"
                  ? "A−"
                  : fontSize === "text-lg"
                    ? "A+"
                    : "Aa"}
              </span>

              <button
                type="button"
                onClick={increaseFont}
                disabled={currentFontIndex === fontSizes.length - 1}
                title="Increase font size"
                aria-label="Increase font size"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-white hover:text-indigo-600 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable passage */}
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {isLoading ? (
          <div
            className="flex min-h-64 flex-col items-center justify-center gap-3 px-6 py-12"
            role="status"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <BookOpen className="h-6 w-6 animate-pulse" />
            </div>

            <p className="text-sm font-semibold text-slate-700">
              Loading passage...
            </p>

            <p className="text-xs text-slate-400">
              Preparing your reading material
            </p>
          </div>
        ) : isEmpty ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FileText className="h-6 w-6" />
            </div>

            <h3 className="text-sm font-semibold text-slate-800">
              No passage content available
            </h3>

            <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
              The reading material hasn't been added yet. Please try again
              later.
            </p>
          </div>
        ) : (
          <article className="mx-auto w-full max-w-3xl px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
            <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <span className="h-5 w-1 rounded-full bg-indigo-500" />

              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Start reading
              </span>
            </div>

            <div className="space-y-5 sm:space-y-6">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={`${fontSize} whitespace-pre-line leading-8 tracking-[0.01em] text-slate-700 sm:leading-9`}
                >
                  {paragraph.trim()}
                </p>
              ))}
            </div>

            <div className="mt-10 border-t border-slate-100 pt-5">
              <div className="flex items-start gap-2.5 rounded-xl bg-indigo-50/70 p-4">
                <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />

                <p className="text-xs leading-5 text-indigo-900/80">
                  Read the passage carefully before answering the questions.
                  You can adjust the text size whenever you need to.
                </p>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
};

export default PassageViewer;
