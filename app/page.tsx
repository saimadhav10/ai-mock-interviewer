"use client";

import React, { useState } from "react";
import { InterviewState, EvaluationResult } from "@/types/interview";
import { SetupState } from "@/components/SetupState";
import { ActiveInterviewState } from "@/components/ActiveInterviewState";
import { FeedbackState } from "@/components/FeedbackState";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

export default function Home() {
  const [step, setStep] = useState<InterviewState>("setup");
  const [role, setRole] = useState("");
  const [question, setQuestion] = useState("");
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Web Speech API hook
  const {
    isListening,
    transcript,
    setTranscript,
    isSupported,
    errorMessage: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Phase 4: Fetch interview question from secure server endpoint
  const handleStartInterview = async (selectedRole: string) => {
    setIsLoading(true);
    setApiError(null);
    setRole(selectedRole);
    resetTranscript();

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: selectedRole,
          action: "question",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to generate interview question from server."
        );
      }

      setQuestion(data.question);
      setStep("active");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Phase 4: Submit candidate transcript to secure server endpoint for evaluation
  const handleSubmitAnswer = async () => {
    if (!transcript.trim()) return;

    // Stop recording if active
    if (isListening) {
      stopListening();
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          question,
          answer: transcript.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to evaluate response from server.");
      }

      setFeedback(data);
      setStep("feedback");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Practice another question with the same role
  const handleNextQuestion = () => {
    handleStartInterview(role);
  };

  // Reset back to Setup state
  const handleRestart = () => {
    if (isListening) {
      stopListening();
    }
    setStep("setup");
    setQuestion("");
    setFeedback(null);
    setApiError(null);
    resetTranscript();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 via-zinc-100/60 to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation / Header */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Mock Interview Coach • Secure MVP</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Master Your Next Interview
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Practice real-time oral responses with voice dictation and receive instant, constructive scoring from an AI coach.
          </p>
        </header>

        {/* Global Server Error Banner */}
        {apiError && (
          <div className="max-w-2xl mx-auto p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/80 text-red-800 dark:text-red-200 text-sm flex items-start space-x-3 shadow-sm">
            <svg
              className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex-1">
              <p className="font-semibold">Request Error</p>
              <p className="text-xs mt-0.5 leading-relaxed">{apiError}</p>
            </div>
            <button
              onClick={() => setApiError(null)}
              className="text-red-400 hover:text-red-600 dark:hover:text-red-200 text-xs font-bold px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dynamic State Rendering */}
        <section className="transition-all">
          {step === "setup" && (
            <SetupState
              onStart={handleStartInterview}
              isLoading={isLoading}
            />
          )}

          {step === "active" && (
            <ActiveInterviewState
              role={role}
              question={question}
              transcript={transcript}
              isListening={isListening}
              isSupported={isSupported}
              speechError={speechError}
              isLoading={isLoading}
              onTranscriptChange={setTranscript}
              onStartListening={startListening}
              onStopListening={stopListening}
              onSubmit={handleSubmitAnswer}
              onReset={handleRestart}
            />
          )}

          {step === "feedback" && feedback && (
            <FeedbackState
              role={role}
              question={question}
              transcript={transcript}
              feedback={feedback}
              onNextQuestion={handleNextQuestion}
              onRestart={handleRestart}
              isLoading={isLoading}
            />
          )}
        </section>

        {/* Footer info badge */}
        <footer className="text-center pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60 text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
          <p>
            Zero Client-Side Secrets • All AI calls are mediated through Next.js Server Route Handlers.
          </p>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            Powered by Next.js App Router, Tailwind CSS, Google Gemini API &amp; Web Speech API.
          </p>
        </footer>
      </div>
    </main>
  );
}
