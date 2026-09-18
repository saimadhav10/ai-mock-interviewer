"use client";

import React from "react";
import { EvaluationResult } from "@/types/interview";

interface FeedbackStateProps {
  role: string;
  question: string;
  transcript: string;
  feedback: EvaluationResult;
  onNextQuestion: () => void;
  onRestart: () => void;
  isLoading: boolean;
}

export function FeedbackState({
  role,
  question,
  transcript,
  feedback,
  onNextQuestion,
  onRestart,
  isLoading,
}: FeedbackStateProps) {
  const score = Math.max(1, Math.min(10, feedback.score));

  const getScoreColor = (val: number) => {
    if (val >= 8) {
      return {
        badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 ring-emerald-500/30",
        scoreText: "text-emerald-600 dark:text-emerald-400",
        status: "Outstanding / High Readiness",
      };
    }
    if (val >= 6) {
      return {
        badge: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 ring-blue-500/30",
        scoreText: "text-blue-600 dark:text-blue-400",
        status: "Good Competence / Minor Refinements Needed",
      };
    }
    if (val >= 4) {
      return {
        badge: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 ring-amber-500/30",
        scoreText: "text-amber-600 dark:text-amber-400",
        status: "Moderate / Needs Practice & Structure",
      };
    }
    return {
      badge: "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 ring-red-500/30",
      scoreText: "text-red-600 dark:text-red-400",
      status: "Needs Significant Improvement",
    };
  };

  const style = getScoreColor(score);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Header Summary Card */}
      <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ring-1 ${style.badge}`}>
              {style.status}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Evaluation Report
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Role: <strong className="text-zinc-800 dark:text-zinc-200">{role}</strong>
            </p>
          </div>

          {/* Large Score Metric */}
          <div className="flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-800/70 rounded-2xl border border-zinc-200 dark:border-zinc-700 min-w-[140px]">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Overall Score
            </span>
            <div className="flex items-baseline space-x-1 my-1">
              <span className={`text-5xl font-extrabold ${style.scoreText}`}>
                {score}
              </span>
              <span className="text-xl font-medium text-zinc-400">/10</span>
            </div>
            {/* Visual Bar */}
            <div className="w-24 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden mt-1">
              <div
                className={`h-full transition-all duration-700 rounded-full ${
                  score >= 8
                    ? "bg-emerald-500"
                    : score >= 6
                    ? "bg-blue-500"
                    : score >= 4
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${(score / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Coach Narrative Summary */}
        <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <h4 className="text-xs uppercase font-bold tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
            Executive Coach Feedback
          </h4>
          <p className="text-base text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal">
            {feedback.feedback}
          </p>
        </div>
      </div>

      {/* Strengths & Improvements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
            <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
              Key Strengths
            </h3>
          </div>
          <ul className="space-y-3">
            {feedback.strengths.length > 0 ? (
              feedback.strengths.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                  <span className="text-emerald-500 mt-1 shrink-0 font-bold">&#10003;</span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-zinc-400 italic">No specific strengths listed.</li>
            )}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
            <span className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </span>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
              Areas for Improvement
            </h3>
          </div>
          <ul className="space-y-3">
            {feedback.improvements.length > 0 ? (
              feedback.improvements.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                  <span className="text-amber-500 mt-1 shrink-0 font-bold">&#x2192;</span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-zinc-400 italic">No specific improvements identified.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Accordion: Question and Candidate Answer review */}
      <details className="p-5 bg-white dark:bg-zinc-900 rounded-2xl shadow border border-zinc-200 dark:border-zinc-800 text-sm group">
        <summary className="font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer list-none flex items-center justify-between">
          <span>Review Interview Question &amp; Your Transcript</span>
          <span className="text-zinc-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3 text-xs md:text-sm">
          <div>
            <span className="font-bold text-zinc-500">Question:</span>
            <p className="text-zinc-800 dark:text-zinc-200 mt-0.5">&ldquo;{question}&rdquo;</p>
          </div>
          <div>
            <span className="font-bold text-zinc-500">Your Answer:</span>
            <p className="text-zinc-800 dark:text-zinc-200 mt-0.5 whitespace-pre-wrap bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
              {transcript}
            </p>
          </div>
        </div>
      </details>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <button
          type="button"
          onClick={onNextQuestion}
          disabled={isLoading}
          className="w-full sm:w-1/2 py-3.5 px-6 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <span>Generating Next Question...</span>
          ) : (
            <>
              <span>Practice Another Question</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onRestart}
          disabled={isLoading}
          className="w-full sm:w-1/2 py-3.5 px-6 rounded-xl font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:bg-zinc-300 disabled:opacity-50 transition-all border border-zinc-200 dark:border-zinc-700 flex items-center justify-center space-x-2"
        >
          <span>Change Role / Start Fresh</span>
        </button>
      </div>
    </div>
  );
}
