import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileCheck2,
  Calendar,
  ArrowRight,
  Sparkles,
  AlertCircle,
  BookOpen,
  Target,
  ChevronRight,
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

export const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await resultApi.getAttemptHistory();

        if (isMounted) {
          setHistory(data.attempts || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to load test history:", err);
          setError(
            err.response?.data?.message ||
              "Failed to load test attempt history."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <LoadingSpinner
        fullPage
        message="Loading your past test attempts..."
      />
    );
  }

  const totalAttempts = history.length;

  const gradedAttempts = history.filter(
    (attempt) => attempt.status === "graded"
  );

  const averageScore =
    gradedAttempts.length > 0
      ? Math.round(
          gradedAttempts.reduce(
            (sum, attempt) =>
              sum +
              Number(
                formatPercentage(
                  attempt.total_score,
                  attempt.max_score
                )
              ),
            0
          ) / gradedAttempts.length
        )
      : 0;

  return (
    <main className="min-h-screen min-w-0 bg-slate-50/70">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8">

        {/* Page Header */}
        <section className="flex min-w-0 flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600">
              <FileCheck2 size={22} />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
                Test History
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Review your previous tests, scores, and AI evaluation feedback.
              </p>
            </div>
          </div>

          <Link to="/practice" className="shrink-0 self-start sm:self-auto">
            <Button variant="primary" size="sm">
              <span className="inline-flex items-center gap-2">
                New Practice Test
                <ArrowRight size={15} />
              </span>
            </Button>
          </Link>
        </section>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="flex min-w-0 items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
          >
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <p className="min-w-0 break-words leading-6">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        {!error && history.length > 0 && (
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <BookOpen size={20} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">
                  Total Attempts
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {totalAttempts}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Target size={20} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">
                  Graded Tests
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {gradedAttempts.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <Sparkles size={20} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">
                  Average Score
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {averageScore}%
                </p>
              </div>
            </div>
          </section>
        )}

        {/* History Heading */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                Previous Attempts
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {totalAttempts} {totalAttempts === 1 ? "test" : "tests"} in your history
              </p>
            </div>
          </div>

          {/* Attempt Cards */}
          {history.length > 0 && (
            <div className="space-y-3">
              {history.map((attempt) => {
                const percentage = Number(
                  formatPercentage(
                    attempt.total_score,
                    attempt.max_score
                  )
                );

                const isGraded = attempt.status === "graded";

                const scoreColor = !isGraded
                  ? "text-slate-500"
                  : percentage >= 70
                    ? "text-emerald-600"
                    : "text-indigo-600";

                const progressColor = !isGraded
                  ? "bg-slate-300"
                  : percentage >= 70
                    ? "bg-emerald-500"
                    : "bg-indigo-500";

                return (
                  <Card
                    key={attempt.id}
                    hover
                    className="min-w-0 border border-slate-200 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <CardBody className="min-w-0 p-4 sm:p-5 lg:p-6">
                      <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        {/* Attempt Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="primary" size="sm">
                              Attempt #{attempt.id}
                            </Badge>

                            <Badge
                              variant={
                                isGraded
                                  ? percentage >= 70
                                    ? "success"
                                    : "warning"
                                  : "info"
                              }
                              size="sm"
                            >
                              {attempt.status}
                            </Badge>
                          </div>

                          <h3 className="mt-3 break-words text-base font-bold leading-6 text-slate-900 sm:text-lg">
                            {attempt.passage_title ||
                              "Reading Comprehension Test"}
                          </h3>

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar
                                size={14}
                                className="shrink-0 text-slate-400"
                              />
                              <span>
                                {formatDate(
                                  attempt.submitted_at ||
                                    attempt.started_at
                                )}
                              </span>
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                              <Target
                                size={14}
                                className="shrink-0 text-slate-400"
                              />
                              <span>
                                Objective:{" "}
                                <strong className="font-semibold text-slate-700">
                                  {attempt.objective_score ?? 0} pts
                                </strong>
                              </span>
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                              <Sparkles
                                size={14}
                                className="shrink-0 text-indigo-500"
                              />
                              <span>
                                AI Score:{" "}
                                <strong className="font-semibold text-indigo-600">
                                  {attempt.ai_score ?? 0} pts
                                </strong>
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Score and Action */}
                        <div className="flex min-w-0 items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:gap-6 lg:w-56 lg:shrink-0 lg:flex-col lg:items-stretch lg:justify-center lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                          <div className="min-w-0 flex-1 lg:flex-none">
                            <div className="flex items-baseline gap-1.5 lg:justify-between">
                              <span
                                className={`text-2xl font-bold tracking-tight sm:text-3xl ${scoreColor}`}
                              >
                                {percentage}%
                              </span>

                              <span className="text-xs text-slate-500">
                                {attempt.total_score} / {attempt.max_score} pts
                              </span>
                            </div>

                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full transition-all ${progressColor}`}
                                style={{
                                  width: `${Math.max(
                                    0,
                                    Math.min(100, percentage)
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>

                          <Link
                            to={`/results/${attempt.id}`}
                            className="shrink-0"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                                View Report
                                <ChevronRight size={15} />
                              </span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {history.length === 0 && !error && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center sm:py-16">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                <FileCheck2 size={27} />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900">
                No Test History Yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Complete your first practice test to see your scores,
                track your progress, and review AI evaluation feedback here.
              </p>

              <Link to="/practice" className="mt-5 inline-flex">
                <Button variant="primary">
                  Start Practicing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default HistoryPage;
