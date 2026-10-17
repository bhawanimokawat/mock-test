
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Target,
  Zap,
  Trophy,
  BookMarked,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { resultApi } from "../../api/resultApi";
import { passageApi } from "../../api/passageApi";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { formatDate, formatPercentage } from "../../utils/formatters";

const statsConfig = [
  {
    label: "Tests Taken",
    key: "attempts",
    description: "Total attempts",
    icon: BookOpen,
    iconStyle: "bg-indigo-50 text-indigo-600",
  },
  {
    label: "Average Score",
    key: "average",
    description: "Across graded tests",
    icon: TrendingUp,
    iconStyle: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Personal Best",
    key: "highest",
    description: "Your highest score",
    icon: Trophy,
    iconStyle: "bg-amber-50 text-amber-600",
  },
  {
    label: "Available Tests",
    key: "passages",
    description: "Ready to practice",
    icon: BookMarked,
    iconStyle: "bg-sky-50 text-sky-600",
  },
];

export const DashboardPage = () => {
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [passages, setPassages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [historyRes, passagesRes] = await Promise.all([
        resultApi.getAttemptHistory().catch(() => ({ attempts: [] })),
        passageApi.getPassages().catch(() => ({ passages: [] })),
      ]);

      setHistory(historyRes.attempts || []);
      setPassages(passagesRes.passages || []);
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError("Unable to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const completedAttempts = history.filter(
    (attempt) =>
      attempt.status === "graded" &&
      Number(attempt.max_score) > 0
  );

  const totalAttempts = history.length;

  const averagePercentage =
    completedAttempts.length > 0
      ? Math.round(
          completedAttempts.reduce(
            (sum, attempt) =>
              sum +
              (Number(attempt.total_score) /
                Number(attempt.max_score)) *
                100,
            0
          ) / completedAttempts.length
        )
      : 0;

  const highestScore =
    completedAttempts.length > 0
      ? Math.round(
          Math.max(
            ...completedAttempts.map(
              (attempt) =>
                (Number(attempt.total_score) /
                  Number(attempt.max_score)) *
                100
            )
          )
        )
      : 0;

  const stats = {
    attempts: totalAttempts,
    average: `${averagePercentage}%`,
    highest: `${highestScore}%`,
    passages: passages.length,
  };

  if (loading) {
    return (
      <LoadingSpinner
        fullPage
        message="Preparing your learning dashboard..."
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/80">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* Page Heading */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              YOUR LEARNING SPACE
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track your progress and keep improving every day.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Learning journey active
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <div className="flex items-center gap-2">
              <AlertCircle size={19} />
              {error}
            </div>
            <button
              onClick={fetchDashboardData}
              className="flex items-center gap-2 font-semibold hover:text-rose-900"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        )}

        {/* Welcome Banner */}
        <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 p-6 shadow-xl shadow-indigo-950/10 sm:p-9 lg:p-10">
          {/* Decorative Background */}
          <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-1/4 -z-10 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100 backdrop-blur-sm">
                <Sparkles size={15} className="text-amber-300" />
                AI-POWERED LEARNING
              </div>

              <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-[42px]">
                Welcome back,{" "}
                <span className="text-indigo-300">
                  {user?.name?.split(" ")[0] || "Student"}
                </span>
                !
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-indigo-100/80 sm:text-base">
                Sharpen your English reading skills with focused practice
                and get intelligent feedback powered by Google Gemini AI.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link to="/practice">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full border-0 bg-amber-100 font-bold text-indigo-950 shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-50 sm:w-auto"
                  >
                    Start Practice Test
                    <ArrowRight size={17} />
                  </Button>
                </Link>

                <Link to="/history">
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full border-white/25 bg-white/5 text-white transition-all duration-200 hover:bg-white/15 sm:w-auto"
                  >
                    View My Results
                  </Button>
                </Link>
              </div>
            </div>

            {/* Decorative Learning Icon */}
            <div className="hidden lg:flex lg:items-center lg:justify-center">
              <div className="flex h-40 w-40 items-center justify-center rounded-[2rem] border border-white/15 bg-white/[0.07] shadow-2xl backdrop-blur-sm">
                <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-white/10">
                  <Target
                    size={68}
                    strokeWidth={1.2}
                    className="text-indigo-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Your Performance
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              A quick overview of your practice activity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statsConfig.map((item) => {
              const Icon = item.icon;

              return (
                <Card
                  key={item.key}
                  className="group border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/60"
                >
                  <CardBody className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          {item.label}
                        </p>
                        <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                          {stats[item.key]}
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                          {item.description}
                        </p>
                      </div>

                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${item.iconStyle}`}
                      >
                        <Icon size={23} strokeWidth={1.8} />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">

          {/* Recommended Passages */}
          <section className="space-y-5 lg:col-span-2">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  Recommended Practice
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Choose a passage and test your understanding.
                </p>
              </div>

              <Link
                to="/practice"
                className="flex shrink-0 items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
              >
                View all <ArrowRight size={15} />
              </Link>
            </div>

            <div className="space-y-4">
              {passages.slice(0, 3).map((passage, index) => (
                <Card
                  key={passage.id}
                  className="group border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-950/5"
                >
                  <CardBody className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex min-w-0 gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors duration-200 group-hover:bg-indigo-100">
                        <BookOpen size={23} />
                      </div>

                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
                            Reading Practice
                          </span>
                          <span className="text-xs text-slate-400">
                            Test {index + 1}
                          </span>
                        </div>

                        <h3 className="break-words text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-700">
                          {passage.title}
                        </h3>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {passage.duration_minutes || 30} minutes
                          </span>
                          <span className="flex items-center gap-1.5">
                            <BookOpen size={14} />
                            {passage.question_count || "Multiple"} questions
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/practice"
                      className="shrink-0"
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full transition-all duration-200 hover:shadow-md sm:w-auto"
                      >
                        Start Test
                        <ArrowRight size={15} />
                      </Button>
                    </Link>
                  </CardBody>
                </Card>
              ))}

              {passages.length === 0 && (
                <Card className="border border-dashed border-slate-300 bg-white shadow-none">
                  <CardBody className="px-5 py-12 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <BookOpen size={26} />
                    </div>
                    <h3 className="mt-4 font-bold text-slate-800">
                      No practice passages yet
                    </h3>
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      New reading passages will appear here when they are
                      published.
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="space-y-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  Recent Activity
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your latest test attempts.
                </p>
              </div>

              <Link
                to="/history"
                className="shrink-0 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
              >
                See all
              </Link>
            </div>

            <Card className="border border-slate-200/80 bg-white shadow-sm">
              <CardBody className="divide-y divide-slate-100 p-0">
                {history.slice(0, 4).map((attempt) => {
                  const percentage = formatPercentage(
                    attempt.total_score,
                    attempt.max_score
                  );

                  const graded = attempt.status === "graded";
                  const passed = graded && Number(percentage) >= 70;

                  return (
                    <div
                      key={attempt.id}
                      className="p-4 transition-colors duration-200 hover:bg-slate-50/80 sm:p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-800">
                            {attempt.passage_title || "Practice Test"}
                          </h3>

                          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                            <Calendar size={13} />
                            {formatDate(
                              attempt.submitted_at || attempt.started_at
                            )}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold ${
                            !graded
                              ? "bg-sky-50 text-sky-700"
                              : passed
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {graded ? `${percentage}%` : attempt.status}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="text-xs font-medium text-slate-500">
                          {attempt.total_score ?? 0} / {attempt.max_score ?? 0} points
                        </span>

                        <Link
                          to={`/results/${attempt.id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 transition-all hover:gap-2 hover:text-indigo-800"
                        >
                          Review
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  );
                })}

                {history.length === 0 && (
                  <div className="px-5 py-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                      <Zap size={23} />
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-slate-800">
                      Your journey starts here
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Take your first test to see your results and progress.
                    </p>
                    <Link to="/practice" className="mt-4 inline-block">
                      <Button variant="primary" size="sm">
                        Start First Test
                      </Button>
                    </Link>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Learning Tip */}
            <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-5">
              <div className="flex items-center gap-2 text-violet-700">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Sparkles size={18} />
                </div>
                <h3 className="text-sm font-bold">A little tip</h3>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Consistent practice helps you identify weak areas. Review
                your previous feedback before attempting another passage.
              </p>

              <Link
                to="/history"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-violet-700 transition-all hover:gap-2.5"
              >
                Review your progress <ArrowRight size={15} />
              </Link>
            </div>
          </section>
        </div>

        {/* Bottom CTA */}
        <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Award size={25} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                Ready for your next challenge?
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Keep practicing and work towards your personal best.
              </p>
            </div>
          </div>

          <Link to="/practice">
            <Button
              variant="primary"
              size="md"
              className="w-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
            >
              Practice Now <ArrowRight size={17} />
            </Button>
          </Link>
        </section>
      </div>
    </main>
  );
};

export default DashboardPage;
