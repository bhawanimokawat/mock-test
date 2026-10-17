import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  LayoutGrid,
  BookOpen,
  FileQuestion,
  AlertTriangle,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { attemptApi } from "../../api/attemptApi";
import { useTimer } from "../../hooks/useTimer";
import PassageViewer from "../../components/test/PassageViewer";
import QuestionCard from "../../components/test/QuestionCard";
import QuestionPalette from "../../components/test/QuestionPalette";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export const TestPage = () => {
  const { id: attemptId } = useParams();
  const navigate = useNavigate();

  // Test state
  const [attempt, setAttempt] = useState(null);
  const [passage, setPassage] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [saveStatus, setSaveStatus] = useState("idle"); // "idle" | "saving" | "saved"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // UI state
  const [activeTabMobile, setActiveTabMobile] = useState("question"); // "passage" | "question"
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Debounce ref for auto-saving
  const saveTimeoutRef = useRef(null);

  // 1. Fetch test attempt, passage, and questions on mount
  useEffect(() => {
    let isMounted = true;

    const fetchTestData = async () => {
      try {
        setLoading(true);
        const data = await attemptApi.getAttemptQuestions(attemptId);

        if (!isMounted) return;

        if (data.attempt.status !== "in_progress") {
          navigate(`/results/${attemptId}`, { replace: true });
          return;
        }

        setAttempt(data.attempt);
        setPassage(data.passage);
        setQuestions(data.questions || []);

        // Populate initial answered map from backend
        const initialAnswers = {};
        (data.questions || []).forEach((q) => {
          if (q.answer_text) {
            initialAnswers[q.id] = q.answer_text;
          }
        });
        setAnswers(initialAnswers);
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to load attempt questions:", err);
        if (err.response?.status === 409 && err.response?.data?.timeExpired) {
          // Time already over, auto-submit
          handleAutoSubmit();
        } else {
          setError(
            err.response?.data?.message || "Failed to load test attempt questions."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTestData();

    return () => {
      isMounted = false;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [attemptId, navigate]);

  // 2. Setup Timer Hook with deadline
  const handleAutoSubmit = async () => {
    try {
      setSubmitting(true);
      await attemptApi.submitAttempt(attemptId);
      navigate(`/results/${attemptId}`, { replace: true });
    } catch (err) {
      console.error("Auto submit failed:", err);
      navigate(`/results/${attemptId}`, { replace: true });
    }
  };

  const { formatted: timerFormatted, isExpiringSoon, isCritical, isExpired } = useTimer(
    attempt?.deadlineAt,
    handleAutoSubmit
  );

  // 3. Save Answer Handler with debounce
  const handleAnswerChange = (value) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: value,
    }));

    setSaveStatus("saving");

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await attemptApi.saveAnswer(attemptId, currentQ.id, value);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (err) {
        console.error("Error saving answer:", err);
        setSaveStatus("idle");
      }
    }, 600);
  };

  // 4. Test Submission
  const handleConfirmSubmit = async () => {
    try {
      setSubmitting(true);
      await attemptApi.submitAttempt(attemptId);
      navigate(`/results/${attemptId}`);
    } catch (err) {
      console.error("Failed to submit attempt:", err);
      alert(err.response?.data?.message || "Error submitting test. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading exam environment and questions..." />;
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-6 bg-white rounded-2xl border border-rose-200 text-center space-y-4 shadow-sm">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Unable to Load Test</h2>
        <p className="text-sm text-slate-600">{error}</p>
        <Button variant="primary" onClick={() => navigate("/practice")}>
          Return to Practice Tests
        </Button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = questions.filter(
    (q) => answers[q.id] !== undefined && String(answers[q.id]).trim() !== ""
  ).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-50 overflow-hidden">
      {/* Top Test Navigation Bar */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 shadow-xs z-20">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-slate-800 hidden sm:inline truncate max-w-xs md:max-w-md">
            {passage?.title || "English Reading Comprehension"}
          </span>
        </div>

        {/* Center: Mobile View Switcher (Passage vs Question) */}
        <div className="flex md:hidden items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTabMobile("passage")}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTabMobile === "passage"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600"
            }`}
          >
            Passage
          </button>
          <button
            onClick={() => setActiveTabMobile("question")}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTabMobile === "question"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600"
            }`}
          >
            Questions ({currentIndex + 1}/{questions.length})
          </button>
        </div>

        {/* Right: Timer & Submit Action */}
        <div className="flex items-center gap-3">
          {/* Countdown Timer */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono transition-colors border ${
              isCritical
                ? "bg-rose-100 text-rose-700 border-rose-300 animate-pulse"
                : isExpiringSoon
                ? "bg-amber-50 text-amber-700 border-amber-300"
                : "bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timerFormatted}</span>
          </div>

          {/* Palette button (toggle popup on mobile/desktop) */}
          <button
            onClick={() => setPaletteOpen(!paletteOpen)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
            title="Question Palette"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          {/* Submit Test Button */}
          <Button
            variant="danger"
            size="sm"
            onClick={() => setSubmitModalOpen(true)}
            icon={Send}
          >
            Submit Test
          </Button>
        </div>
      </header>

      {/* Main Two-Phase Split Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Phase: Passage from Backend (50% on md+) */}
        <div
          className={`w-full md:w-1/2 h-full ${
            activeTabMobile === "passage" ? "block" : "hidden md:block"
          }`}
        >
          <PassageViewer
            title={passage?.title}
            content={passage?.content}
          />
        </div>

        {/* Right Phase: Questions from Backend (50% on md+) */}
        <div
          className={`w-full md:w-1/2 h-full flex flex-col bg-slate-50 ${
            activeTabMobile === "question" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Question Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <QuestionCard
                question={currentQ}
                currentIndex={currentIndex}
                totalQuestions={questions.length}
                currentAnswer={answers[currentQ?.id]}
                onAnswerChange={handleAnswerChange}
                saveStatus={saveStatus}
              />
            </div>
          </div>

          {/* Bottom Question Navigation Footer */}
          <div className="h-16 bg-white border-t border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs z-10">
            <Button
              variant="outline"
              size="sm"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              icon={ChevronLeft}
            >
              Previous
            </Button>

            <span className="text-xs text-slate-500 font-medium">
              Question {currentIndex + 1} of {questions.length}
            </span>

            {currentIndex < questions.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  setCurrentIndex((prev) =>
                    Math.min(questions.length - 1, prev + 1)
                  )
                }
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                variant="success"
                size="sm"
                onClick={() => setSubmitModalOpen(true)}
                icon={Send}
              >
                Review & Submit
              </Button>
            )}
          </div>
        </div>

        {/* Sliding Question Palette Drawer (overlay) */}
        {paletteOpen && (
          <div className="absolute right-4 top-4 z-30 w-72 shadow-xl animate-in fade-in slide-in-from-top-2">
            <QuestionPalette
              questions={questions}
              currentIndex={currentIndex}
              onSelectQuestion={(idx) => {
                setCurrentIndex(idx);
                setPaletteOpen(false);
                setActiveTabMobile("question");
              }}
              answers={answers}
              onClose={() => setPaletteOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={submitModalOpen}
        onClose={() => !submitting && setSubmitModalOpen(false)}
        title="Ready to Submit Test?"
        confirmText="Yes, Submit My Test"
        confirmVariant="danger"
        onConfirm={handleConfirmSubmit}
        isLoading={submitting}
      >
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Total Questions:</span>
              <span className="font-bold text-slate-900">{questions.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-700 font-medium">Answered:</span>
              <span className="font-bold text-emerald-700">{answeredCount}</span>
            </div>
            {unansweredCount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-amber-700 font-medium">Unanswered:</span>
                <span className="font-bold text-amber-700">{unansweredCount}</span>
              </div>
            )}
          </div>

          {unansweredCount > 0 ? (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                You have {unansweredCount} unanswered question(s). You can still submit, but unanswered questions will receive 0 marks.
              </span>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Great job! You have answered all {questions.length} questions.</span>
            </div>
          )}

          {submitting && (
            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200 text-indigo-700 text-xs flex items-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Submitting test and running Google Gemini AI short-answer evaluator...</span>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TestPage;
