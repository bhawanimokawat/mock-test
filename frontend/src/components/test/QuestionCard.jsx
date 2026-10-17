
import React from "react";
import {
  Sparkles,
  Check,
  HelpCircle,
  CheckCircle2,
  FileText,
  CircleDot,
} from "lucide-react";
import Badge from "../common/Badge";

const questionTypes = {
  mcq: {
    label: "Multiple Choice",
    variant: "primary",
  },
  fill_blank: {
    label: "Fill in the Blank",
    variant: "warning",
  },
  true_false: {
    label: "True / False",
    variant: "neutral",
  },
  short_answer: {
    label: "AI Evaluated",
    variant: "violet",
  },
};

const optionLetters = ["A", "B", "C", "D", "E", "F"];

export const QuestionCard = ({
  question,
  currentIndex,
  totalQuestions,
  currentAnswer,
  onAnswerChange,
  saveStatus = "idle",
}) => {
  if (!question) return null;

  // Support options returned as either an array or a JSON string.
  let options = [];

  if (Array.isArray(question.options)) {
    options = question.options;
  } else if (typeof question.options === "string") {
    try {
      const parsedOptions = JSON.parse(question.options);
      options = Array.isArray(parsedOptions) ? parsedOptions : [];
    } catch {
      options = [];
    }
  }

  const questionType =
    questionTypes[question.question_type] || {
      label: question.question_type || "Question",
      variant: "neutral",
    };

  const answer = currentAnswer ?? "";
  const characterCount = String(answer).length;
  const maxMarks = Number(question.max_marks) || 0;

  const getOptionLabel = (option) => {
    if (typeof option === "string" || typeof option === "number") {
      return String(option);
    }

    return option?.text ?? option?.label ?? option?.value ?? "";
  };

  const renderSaveStatus = () => {
    if (saveStatus === "saving") {
      return (
        <span
          role="status"
          className="inline-flex items-center gap-2 text-xs font-medium text-amber-600"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
          Saving...
        </span>
      );
    }

    if (saveStatus === "saved") {
      return (
        <span
          role="status"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600"
        >
          <CheckCircle2 className="h-4 w-4" />
          Saved
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
        <CircleDot className="h-3.5 w-3.5" />
        Not saved yet
      </span>
    );
  };

  const inputClasses =
    "w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-800 " +
    "placeholder:text-slate-400 transition-colors duration-200 " +
    "hover:border-slate-300 focus:border-indigo-500 focus:outline-none " +
    "focus:ring-4 focus:ring-indigo-500/10";

  return (
    <section className="min-w-0 space-y-5 sm:space-y-6">
      {/* Question metadata */}
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <Badge variant="primary" size="sm">
            Question {currentIndex + 1} of {totalQuestions}
          </Badge>

          <Badge variant={questionType.variant} size="sm">
            {questionType.label}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
          {renderSaveStatus()}

          <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
            <span className="text-sm font-bold text-slate-800">
              {maxMarks}
            </span>
            <span className="text-xs text-slate-500">
              {maxMarks === 1 ? "Mark" : "Marks"}
            </span>
          </div>
        </div>
      </div>

      {/* Question text */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-700">
            {currentIndex + 1}
          </div>

          <h2 className="min-w-0 flex-1 break-words pt-1 text-base font-bold leading-7 text-slate-900 sm:text-lg sm:leading-8">
            {question.question_text}
          </h2>
        </div>

        {question.question_type === "short_answer" && (
          <div className="ml-0 flex items-start gap-3 rounded-xl border border-violet-100 bg-gradient-to-r from-violet-50 to-indigo-50/60 p-3.5 sm:ml-11 sm:p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-violet-600 shadow-sm ring-1 ring-violet-100">
              <Sparkles className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-violet-950">
                AI-powered evaluation
              </p>
              <p className="mt-1 text-xs leading-5 text-violet-800/80 sm:text-sm">
                Answer in your own words. Your response will be evaluated
                for meaning, correctness, and relevant concepts.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Answer area */}
      <div className="space-y-3">
        {question.question_type === "mcq" && (
          <>
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Choose your answer
              </label>
              <span className="text-xs text-slate-400">
                {options.length} options
              </span>
            </div>

            {options.length > 0 ? (
              <div className="space-y-2.5">
                {options.map((option, index) => {
                  const optionText = getOptionLabel(option);
                  const isSelected = answer === optionText;
                  const letter = optionLetters[index] || String(index + 1);

                  return (
                    <button
                      key={index}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => onAnswerChange(optionText)}
                      className={[
                        "group flex w-full min-w-0 items-start gap-3 rounded-xl border p-3.5 text-left sm:gap-4 sm:p-4",
                        "cursor-pointer transition-all duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                        isSelected
                          ? "border-indigo-500 bg-indigo-50/70 shadow-sm shadow-indigo-100 ring-1 ring-indigo-500/20"
                          : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50/80",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700",
                        ].join(" ")}
                      >
                        {isSelected ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          letter
                        )}
                      </span>

                      <span
                        className={[
                          "min-w-0 flex-1 break-words pt-1 text-sm leading-6",
                          isSelected
                            ? "font-semibold text-indigo-950"
                            : "text-slate-700",
                        ].join(" ")}
                      >
                        {optionText}
                      </span>

                      <span
                        className={[
                          "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                          isSelected
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-300 text-transparent group-hover:border-indigo-300",
                        ].join(" ")}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Answer options are currently unavailable for this question.
              </p>
            )}
          </>
        )}

        {question.question_type === "true_false" && (
          <>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Select one answer
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {["true", "false"].map((choice) => {
                const isSelected =
                  String(answer).toLowerCase() === choice;

                const label =
                  choice === "true" ? "True" : "False";

                return (
                  <button
                    key={choice}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => onAnswerChange(choice)}
                    className={[
                      "flex min-h-16 cursor-pointer items-center justify-between gap-3 rounded-xl border p-4 text-left",
                      "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                      isSelected
                        ? "border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={[
                          "flex h-9 w-9 items-center justify-center rounded-full",
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-500",
                        ].join(" ")}
                      >
                        {isSelected ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <HelpCircle className="h-4 w-4" />
                        )}
                      </span>

                      <span className="text-sm font-semibold">
                        {label}
                      </span>
                    </span>

                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-indigo-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {question.question_type === "fill_blank" && (
          <div className="space-y-2">
            <label
              htmlFor={`answer-${question.id ?? currentIndex}`}
              className="block text-xs font-bold uppercase tracking-wider text-slate-500"
            >
              Your answer
            </label>

            <input
              id={`answer-${question.id ?? currentIndex}`}
              type="text"
              value={answer}
              onChange={(event) => onAnswerChange(event.target.value)}
              placeholder="Type your word or phrase..."
              autoComplete="off"
              className={`${inputClasses} px-4 py-3.5`}
            />

            <p className="text-xs leading-5 text-slate-400">
              Enter the word or phrase that best completes the answer.
            </p>
          </div>
        )}

        {question.question_type === "short_answer" && (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor={`answer-${question.id ?? currentIndex}`}
                className="text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Your written answer
              </label>

              <span
                className={[
                  "text-xs font-medium tabular-nums",
                  characterCount > 0 ? "text-indigo-600" : "text-slate-400",
                ].join(" ")}
                aria-live="polite"
              >
                {characterCount} characters
              </span>
            </div>

            <textarea
              id={`answer-${question.id ?? currentIndex}`}
              rows={6}
              value={answer}
              onChange={(event) => onAnswerChange(event.target.value)}
              placeholder="Write a clear, complete explanation based on the passage..."
              className={`${inputClasses} min-h-36 resize-y px-4 py-3.5 leading-7`}
            />

            <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <p className="text-xs leading-5 text-slate-500">
                Support your answer with relevant information from the
                passage. Write in your own words.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuestionCard;
