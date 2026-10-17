import React from "react";
import { Check, X, Grid2X2, CircleCheck, Circle } from "lucide-react";

export const QuestionPalette = ({
  questions = [],
  currentIndex,
  onSelectQuestion,
  answers = {},
  onClose,
}) => {
  const isAnswered = (question) => {
    const answer = answers[question.id];
    return (
      answer !== undefined &&
      answer !== null &&
      String(answer).trim() !== ""
    );
  };

  const answeredCount = questions.filter(isAnswered).length;
  const totalQuestions = questions.length;
  const progress =
    totalQuestions > 0
      ? Math.round((answeredCount / totalQuestions) * 100)
      : 0;

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="border-b border-slate-100 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Grid2X2 size={18} />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900">
                Question Palette
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Navigate between questions
              </p>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close question palette"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 md:hidden"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-600">
              Questions answered
            </span>
            <span className="text-xs font-semibold text-indigo-600">
              {answeredCount}/{totalQuestions} · {progress}%
            </span>
          </div>

          <div
            className="h-1.5 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-label="Questions answered"
            aria-valuemin={0}
            aria-valuemax={totalQuestions || 1}
            aria-valuenow={answeredCount}
          >
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h4 className="text-xs font-semibold text-slate-700">
            All questions
          </h4>
          <span className="text-xs text-slate-400">
            Select to navigate
          </span>
        </div>

        {totalQuestions > 0 ? (
          <div className="grid max-h-64 grid-cols-5 justify-items-center gap-2 overflow-y-auto p-1 sm:grid-cols-6 lg:grid-cols-5 xl:grid-cols-6">
            {questions.map((question, index) => {
              const answered = isAnswered(question);
              const isCurrent = currentIndex === index;

              let buttonStyle =
                "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50";

              if (answered) {
                buttonStyle =
                  "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100";
              }

              if (isCurrent) {
                buttonStyle =
                  "border-indigo-600 bg-indigo-600 text-white ring-2 ring-indigo-100";
              }

              return (
                <button
                  key={question.id ?? index}
                  type="button"
                  onClick={() => onSelectQuestion(index)}
                  aria-label={`Question ${index + 1}${answered ? ", answered" : ", unanswered"}${isCurrent ? ", current question" : ""}`}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${buttonStyle}`}
                >
                  {index + 1}

                  {answered && !isCurrent && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white">
                      <Check size={9} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center">
            <Grid2X2 className="mx-auto mb-2 text-slate-300" size={24} />
            <p className="text-sm font-medium text-slate-700">
              No questions available
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Questions will appear here when loaded.
            </p>
          </div>
        )}
      </div>

      {/* Compact Status Guide */}
      <div className="border-t border-slate-100 bg-slate-50/60 p-4">
        <h4 className="mb-3 text-xs font-semibold text-slate-600">
          Status guide
        </h4>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <CircleCheck size={17} className="shrink-0 text-emerald-600" />
            <span className="whitespace-nowrap text-xs font-medium text-slate-600">
              Answered
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <Circle size={17} className="shrink-0 text-slate-400" />
            <span className="whitespace-nowrap text-xs font-medium text-slate-600">
              Unanswered
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2">
            <span className="flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded bg-indigo-600 text-[10px] font-bold text-white">
              1
            </span>
            <span className="whitespace-nowrap text-xs font-medium text-indigo-700">
              Current
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuestionPalette;
