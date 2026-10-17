
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Clock,
  HelpCircle,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  FileText,
  Target,
  Brain,
  ShieldCheck,
  X,
  Timer,
  GraduationCap,
  RefreshCw,
} from "lucide-react";

import { passageApi } from "../../api/passageApi";
import { attemptApi } from "../../api/attemptApi";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Modal from "../../components/common/Modal";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export const PracticePage = () => {
  const navigate = useNavigate();

  const [passages, setPassages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPassage, setSelectedPassage] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

  const loadPassages = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await passageApi.getPassages();
      setPassages(data.passages || []);
    } catch (err) {
      console.error("Error loading passages:", err);
      setError(
        "Unable to load practice passages. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPassages();
  }, []);

  const handleStartTest = async () => {
    if (!selectedPassage || isStarting) return;

    try {
      setIsStarting(true);

      const res = await attemptApi.startAttempt(selectedPassage.id);

      if (res.success && res.attempt) {
        navigate(`/test/${res.attempt.id}`);
      } else {
        setError("The test could not be started. Please try again.");
        setIsStarting(false);
      }
    } catch (err) {
      console.error("Failed to start attempt:", err);
      setError(
        err.response?.data?.message ||
          "Could not start the test. Please try again."
      );
      setIsStarting(false);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner
        fullPage
        message="Preparing your practice tests..."
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/80">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* Page Header */}
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
              <BookOpen size={14} />
              YOUR PRACTICE CENTER
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Reading Comprehension
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Build your reading skills, test your understanding, and
              receive AI-powered feedback on your answers.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen size={21} />
            </div>
            <div>
              <p className="text-xl font-extrabold leading-6 text-slate-900">
                {passages.length}
              </p>
              <p className="text-xs font-medium text-slate-500">
                Available tests
              </p>
            </div>
          </div>
        </section>

        {/* Intro Banner */}
        <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 p-6 shadow-xl shadow-indigo-950/10 sm:p-8 lg:p-9">
          <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 -z-10 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100">
                <Sparkles size={15} className="text-amber-300" />
                SMART PRACTICE WITH AI
              </div>

              <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
                Every test takes you one step further.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100/80 sm:text-base">
                Read carefully, answer confidently, and learn from
                detailed feedback on your descriptive responses.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:w-64 md:shrink-0">
              <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-sm">
                <Brain size={22} className="text-violet-200" />
                <p className="mt-3 text-sm font-bold text-white">
                  AI Feedback
                </p>
                <p className="mt-1 text-xs text-indigo-100/70">
                  Smarter review
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-sm">
                <Timer size={22} className="text-amber-200" />
                <p className="mt-3 text-sm font-bold text-white">
                  Timed Tests
                </p>
                <p className="mt-1 text-xs text-indigo-100/70">
                  Practice focus
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-2">
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={loadPassages}
              className="flex shrink-0 items-center gap-2 font-semibold hover:text-rose-900"
            >
              <RefreshCw size={15} />
              Reload passages
            </button>
          </div>
        )}

        {/* Section Heading */}
        <section>
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                Explore Practice Tests
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Select a passage to view the instructions and begin.
              </p>
            </div>

            <p className="text-xs font-medium text-slate-400">
              {passages.length} {passages.length === 1 ? "test" : "tests"} available
            </p>
          </div>

          {/* Passage Grid */}
          {passages.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {passages.map((passage, index) => (
                <Card
                  key={passage.id}
                  className="group flex flex-col overflow-hidden border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/5"
                >
                  {/* Card Top Accent */}
                  <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

                  <CardBody className="flex flex-1 flex-col p-5 sm:p-6">
                    {/* Card Meta */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1.5 text-[11px] font-bold text-indigo-700">
                        <BookOpen size={13} />
                        TEST {index + 1}
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                        <Clock size={14} className="text-indigo-500" />
                        {passage.duration_minutes || 30} min
                      </span>
                    </div>

                    {/* Card Title */}
                    <div className="mt-6">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-600 transition-all duration-300 group-hover:scale-105 group-hover:from-indigo-100 group-hover:to-violet-100">
                        <FileText size={24} strokeWidth={1.8} />
                      </div>

                      <h3 className="break-words text-lg font-extrabold leading-7 text-slate-900 transition-colors duration-200 group-hover:text-indigo-700">
                        {passage.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Strengthen your comprehension with multiple-choice,
                        fill-in-the-blank, and descriptive questions.
                      </p>
                    </div>

                    {/* Test Details */}
                    <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 text-slate-400">
                          <HelpCircle size={17} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {passage.question_count || 26}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            Questions
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 text-emerald-600">
                          <CheckCircle size={17} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            AI Review
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            Answer feedback
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Start Button */}
                    <div className="mt-auto pt-6">
                      <Button
                        variant="primary"
                        size="md"
                        className="w-full justify-center transition-all duration-200 hover:shadow-lg hover:shadow-indigo-600/15 active:scale-[0.98]"
                        onClick={() => setSelectedPassage(passage)}
                      >
                        Start Practice
                        <ArrowRight
                          size={17}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {passages.length === 0 && !error && (
            <Card className="border border-dashed border-slate-300 bg-white shadow-none">
              <CardBody className="px-5 py-14 text-center sm:py-16">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                  <GraduationCap size={32} strokeWidth={1.6} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  No practice tests available
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  There are no published passages right now. Please check
                  back later or contact your administrator.
                </p>

                <button
                  type="button"
                  onClick={loadPassages}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <RefreshCw size={16} />
                  Refresh tests
                </button>
              </CardBody>
            </Card>
          )}
        </section>

        {/* Bottom Information */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: Clock,
              title: "Manage your time",
              description: "Read the instructions before starting the timer.",
            },
            {
              icon: Target,
              title: "Focus on accuracy",
              description: "Read each passage carefully before answering.",
            },
            {
              icon: ShieldCheck,
              title: "Review your answers",
              description: "Use available feedback to learn from each test.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 transition-all duration-200 hover:border-indigo-100 hover:shadow-md sm:p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-indigo-600">
                  <Icon size={20} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </section>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!selectedPassage}
        onClose={() => {
          if (!isStarting) setSelectedPassage(null);
        }}
        title="Ready to begin?"
        confirmText="Start Test Now"
        onConfirm={handleStartTest}
        isLoading={isStarting}
      >
        {selectedPassage && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                  <BookOpen size={22} />
                </div>

                <div className="min-w-0">
                  <p className="text-base font-bold leading-6 text-slate-900">
                    {selectedPassage.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Review the details before starting your test.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white bg-white/80 p-3">
                  <Clock size={17} className="text-indigo-600" />
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {selectedPassage.duration_minutes || 30} minutes
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Time limit</p>
                </div>

                <div className="rounded-xl border border-white bg-white/80 p-3">
                  <HelpCircle size={17} className="text-indigo-600" />
                  <p className="mt-2 text-sm font-bold text-slate-900">
                    {selectedPassage.question_count || 26} questions
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Test length</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Before you start
              </h3>

              <ul className="mt-3 space-y-3">
                {[
                  "The passage and questions appear in the test interface.",
                  "Answers are automatically saved as you respond, as supported by the test system.",
                  "The test is automatically submitted when the timer expires.",
                  "Descriptive answers are evaluated using Google Gemini AI.",
                ].map((instruction, index) => (
                  <li
                    key={instruction}
                    className="flex items-start gap-2.5 text-sm leading-5 text-slate-600"
                  >
                    <CheckCircle
                      size={17}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
              <strong>Tip:</strong> Find a quiet place and make sure you
              have enough time to complete the test before beginning.
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default PracticePage;
