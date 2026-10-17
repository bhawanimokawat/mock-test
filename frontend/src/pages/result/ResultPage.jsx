import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Calendar,
  AlertCircle,
  Check,
  CircleCheck,
  CircleX,
  LayoutDashboard,
  ClipboardList,
  RotateCcw,
} from "lucide-react";

import { resultApi } from "../../api/resultApi";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  formatDate,
  formatPercentage,
} from "../../utils/formatters";

const FILTERS = [
  { id: "all", label: "All Questions" },
  { id: "correct", label: "Full Marks" },
  { id: "incorrect", label: "Needs Review" },
  { id: "ai", label: "AI Evaluated" },
];

export const ResultPage = () => {
  const { id: attemptId } = useParams();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;

    const fetchResult = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await resultApi.getAttemptResult(attemptId);

        if (isMounted) {
          setResult(data.result);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load result:", err);
          setError(
            err.response?.data?.message ||
              "Failed to load test attempt result."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchResult();

    return () => {
      isMounted = false;
    };
  }, [attemptId]);

  if (loading) {
    return (
      <LoadingSpinner
        fullPage
        message="Fetching your test evaluation results..."
      />
    );
  }

  if (error || !result) {
    return (
      <div className="mx-auto my-10 w-full max-w-lg px-4">
        <div className="rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
            <AlertCircle size={28} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Result Not Available
          </h2>

          <p className="mt-2 break-words text-sm leading-6 text-slate-500">
            {error || "Could not find results for this attempt."}
          </p>

          <Link to="/practice" className="mt-5 inline-flex">
            <Button variant="primary">Back to Practice</Button>
          </Link>
        </div>
      </div>
    );
  }

  const answers = result.answers || [];
  const percentage = formatPercentage(
    result.totalScore,
    result.maxScore
  );

  const filteredAnswers = answers.filter((item) => {
    if (filter === "correct") {
      return item.awarded_marks === item.max_marks;
    }

    if (filter === "incorrect") {
      return item.awarded_marks < item.max_marks;
    }

    if (filter === "ai") {
      return item.question_type === "short_answer";
    }

    return true;
  });

  const getQuestionType = (type = "question") =>
    String(type).replace(/_/g, " ");

  const getScoreVariant = (item) => {
    if (item.awarded_marks === item.max_marks) {
      return "success";
    }

    if (item.awarded_marks > 0) {
      return "warning";
    }

    return "danger";
  };

  return (
    <main className="min-h-screen min-w-0 bg-slate-50/70">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-5 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8">

        {/* Score Summary */}
        <section className="relative min-w-0 overflow-hidden rounded-2xl border border-indigo-900/30 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-5 text-white shadow-lg sm:rounded-3xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-xs font-semibold text-indigo-200">
                  <Sparkles size={14} />
                  Evaluation Report
                </div>

                <h1 className="mt-4 break-words text-2xl font-bold tracking-tight sm:text-3xl">
                  {result.passage_title ||
                    "Reading Comprehension Test"}
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300 sm:text-sm">
                  <span className="inline-flex items-center gap-2">
                    <Calendar size={15} className="shrink-0 text-indigo-300" />
                    <span>
                      {formatDate(
                        result.submitted_at || result.started_at
                      )}
                    </span>
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="capitalize">
                      {result.status}
                    </span>
                  </span>
                </div>
              </div>

              {/* Main Score */}
              <div className="flex min-w-0 items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.07] p-4 sm:gap-7 sm:p-5">
                <div className="min-w-0">
                  <p className="text-3xl font-bold tracking-tight sm:text-5xl">
                    {percentage}%
                  </p>
                  <p className="mt-1 text-xs font-medium text-indigo-200">
                    Overall Score
                  </p>
                </div>

                <div className="h-12 w-px shrink-0 bg-white/15" />

                <div className="min-w-0">
                  <p className="break-words text-xl font-bold sm:text-2xl">
                    {result.totalScore} / {result.maxScore}
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    Total Points
                  </p>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="mt-6 grid grid-cols-1 gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs leading-5 text-slate-300">
                  Objective Score
                </p>
                <p className="mt-2 text-xl font-bold text-emerald-300">
                  {result.objectiveScore ?? 0}
                  <span className="ml-1 text-xs font-medium text-slate-400">
                    pts
                  </span>
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs leading-5 text-slate-300">
                  AI Evaluated Score
                </p>
                <p className="mt-2 text-xl font-bold text-indigo-300">
                  {result.aiScore ?? 0}
                  <span className="ml-1 text-xs font-medium text-slate-400">
                    pts
                  </span>
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs leading-5 text-slate-300">
                  Questions Evaluated
                </p>
                <p className="mt-2 text-xl font-bold text-white">
                  {answers.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Actions */}
        <section className="space-y-4">
          <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-900">
                Question Review
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review your answers, scores, and AI feedback.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link to="/practice" className="min-w-0">
                <Button variant="primary" size="sm">
                  <span className="inline-flex items-center gap-1.5">
                    Practice Again
                    <ArrowRight size={15} />
                  </span>
                </Button>
              </Link>

              <Link to="/dashboard" className="min-w-0">
                <Button variant="outline" size="sm">
                  <span className="inline-flex items-center gap-1.5">
                    <LayoutDashboard size={15} />
                    Dashboard
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Scrollable filter bar */}
          <div className="max-w-full overflow-x-auto pb-1">
            <div
              className="inline-flex min-w-full items-center gap-1 rounded-xl border border-slate-200 bg-white p-1.5 sm:min-w-0"
              role="group"
              aria-label="Filter question results"
            >
              {FILTERS.map((item) => {
                const active = filter === item.id;

                let activeStyle =
                  "bg-indigo-50 text-indigo-700";

                if (item.id === "correct") {
                  activeStyle = "bg-emerald-50 text-emerald-700";
                }

                if (item.id === "incorrect") {
                  activeStyle = "bg-rose-50 text-rose-700";
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    aria-pressed={active}
                    className={`shrink-0 cursor-pointer whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      active
                        ? `${activeStyle} shadow-sm`
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    {item.label}
                    {item.id === "all" && (
                      <span className="ml-1">
                        ({answers.length})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Question Cards */}
        <section className="space-y-4">
          {filteredAnswers.map((item, idx) => {
            const isFullMarks =
              item.awarded_marks === item.max_marks;

            const hasNoMarks = item.awarded_marks === 0;

            const scorePercentage =
              Number(item.max_marks) > 0
                ? Math.max(
                    0,
                    Math.min(
                      100,
                      (Number(item.awarded_marks) /
                        Number(item.max_marks)) *
                        100
                    )
                  )
                : 0;

            return (
              <Card
                key={item.question_id ?? idx}
                className="min-w-0 border border-slate-200 shadow-sm transition-shadow hover:shadow-md"
              >
                <CardBody className="min-w-0 space-y-5 p-4 sm:p-6">
                  {/* Question Header */}
                  <div className="flex min-w-0 flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        Q{item.question_order || idx + 1}
                      </span>

                      <Badge variant="neutral" size="sm">
                        {getQuestionType(item.question_type)}
                      </Badge>
                    </div>

                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <Badge
                        variant={getScoreVariant(item)}
                        size="sm"
                      >
                        {item.awarded_marks} / {item.max_marks} pts
                      </Badge>

                      {isFullMarks ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                          <CircleCheck size={14} />
                          Full marks
                        </span>
                      ) : hasNoMarks ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600">
                          <CircleX size={14} />
                          No marks
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Question */}
                  <div className="min-w-0">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Question
                    </p>
                    <p className="break-words text-sm font-semibold leading-6 text-slate-900 sm:text-base sm:leading-7">
                      {item.question_text}
                    </p>
                  </div>

                  {/* Student Answer */}
                  <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Your Answer
                    </p>

                    <p
                      className={`whitespace-pre-wrap break-words text-sm leading-6 ${
                        item.answer_text
                          ? "text-slate-700"
                          : "italic text-slate-400"
                      }`}
                    >
                      {item.answer_text || "(No answer was provided)"}
                    </p>
                  </div>

                  {/* Expected Answer */}
                  {item.correct_answer && (
                    <div className="min-w-0 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-800">
                        Expected Answer
                      </p>

                      <p className="whitespace-pre-wrap break-words text-sm leading-6 text-emerald-950">
                        {item.correct_answer}
                      </p>
                    </div>
                  )}

                  {/* AI Feedback */}
                  {item.ai_feedback && (
                    <div className="min-w-0 overflow-hidden rounded-xl border border-indigo-200 bg-indigo-50/60">
                      <div className="flex items-center gap-2 border-b border-indigo-100 px-4 py-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                          <Sparkles size={16} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-indigo-950">
                            AI Evaluation Feedback
                          </p>
                          <p className="mt-0.5 text-xs text-indigo-600">
                            Personalized answer assessment
                          </p>
                        </div>
                      </div>

                      <div className="p-4">
                        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-indigo-950">
                          {item.ai_feedback}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Score Progress */}
                  <div className="border-t border-slate-100 pt-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-slate-500">
                        Marks awarded
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {Math.round(scorePercentage)}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isFullMarks
                            ? "bg-emerald-500"
                            : hasNoMarks
                              ? "bg-rose-400"
                              : "bg-indigo-500"
                        }`}
                        style={{ width: `${scorePercentage}%` }}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}

          {/* Empty Filter State */}
          {filteredAnswers.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center sm:py-14">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <ClipboardList size={23} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-800">
                No questions found
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">
                There are no questions matching this filter.
                Try viewing all questions instead.
              </p>

              {filter !== "all" && (
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                >
                  <RotateCcw size={15} />
                  Show all questions
                </button>
              )}
            </div>
          )}
        </section>

        {/* Bottom Navigation */}
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Showing {filteredAnswers.length} of {answers.length} questions
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Link to="/practice">
              <Button variant="primary" size="sm">
                Practice Another Test
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>

            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResultPage;
