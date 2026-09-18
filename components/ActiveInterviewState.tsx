"use client";

import React, { useState } from "react";

interface ActiveInterviewStateProps {
  role: string;
  question: string;
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  speechError: string | null;
  isLoading: boolean;
  onTranscriptChange: (text: string) => void;
  onStartListening: () => void;
  onStopListening: () => void;
  onSubmit: () => void;
  onReset: () => void;
}

export function ActiveInterviewState({
  role,
  question,
  transcript,
  isListening,
  isSupported,
  speechError,
  isLoading,
  onTranscriptChange,
  onStartListening,
  onStopListening,
  onSubmit,
  onReset,
}: ActiveInterviewStateProps) {
  const [isPressing, setIsPressing] = useState(false);

  // Mouse / Touch handlers for "Hold to Speak"
  const handleMouseDown = () => {
    if (isLoading || !isSupported) return;
    setIsPressing(true);
    onStartListening();
  };

  const handleMouseUp = () => {
    if (!isPressing) return;
    setIsPressing(false);
    onStopListening();
  };

  // Toggle click alternative for accessibility
  const handleToggleClick = () => {
    if (isLoading || !isSupported) return;
    if (isListening) {
      onStopListening();
      setIsPressing(false);
    } else {
      onStartListening();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Role Badge & Navigation Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 ring-1 ring-blue-500/20">
            Interview in Progress
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {role}
          </span>
        </div>
        <button
          onClick={onReset}
          disabled={isLoading}
          className="text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors disabled:opacity-50"
        >
          Change Role / Restart
        </button>
      </div>

      {/* AI Question Card */}
      <div className="p-6 md:p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="flex items-start space-x-3 mb-3">
          <span className="inline-flex items-center justify-center p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">
              Interviewer Question
            </h3>
            <p className="text-lg md:text-xl font-medium text-zinc-900 dark:text-zinc-100 mt-1 leading-relaxed">
              &ldquo;{question}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Speech Control & Microphone Card */}
      <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center space-y-4">
        {speechError && (
          <div className="w-full text-xs text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/50 p-3 rounded-lg border border-amber-200 dark:border-amber-800 text-left">
            {speechError}
          </div>
        )}

        <div className="relative">
          {/* Animated pulsing rings when listening */}
          {isListening && (
            <>
              <span className="absolute -inset-2 rounded-full bg-red-500/20 animate-ping" />
              <span className="absolute -inset-4 rounded-full bg-red-500/10 animate-pulse" />
            </>
          )}

          <button
            type="button"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            disabled={isLoading || !isSupported}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-lg ${
              isListening
                ? "bg-red-500 text-white shadow-red-500/40 ring-4 ring-red-400/30"
                : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/30"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Hold down to speak or tap to toggle recording"
          >
            <svg
              className={`w-8 h-8 ${isListening ? "animate-pulse" : ""}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
          </button>
        </div>

        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {isListening ? "Listening... Release or tap to finish" : "Hold to Speak"}
          </p>
          <div className="flex items-center justify-center space-x-2 mt-1">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isListening ? "bg-red-500 animate-pulse" : "bg-zinc-400"
              }`}
            />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {isListening
                ? "Audio streaming live to transcript"
                : "Hold mouse/touch to record, or use tap to toggle"}
            </span>
            <button
              type="button"
              onClick={handleToggleClick}
              disabled={isLoading || !isSupported}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline ml-1"
            >
              ({isListening ? "Stop" : "Click to Toggle"})
            </button>
          </div>
        </div>
      </div>

      {/* Live Text Transcript Box */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="transcript-area"
            className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center space-x-2"
          >
            <span>Your Response Transcript</span>
            {isListening && (
              <span className="inline-flex items-center text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded">
                LIVE
              </span>
            )}
          </label>
          {transcript && (
            <button
              type="button"
              onClick={() => onTranscriptChange("")}
              disabled={isLoading}
              className="text-xs text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              Clear Text
            </button>
          )}
        </div>

        <textarea
          id="transcript-area"
          rows={5}
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          placeholder={
            isSupported
              ? "Hold the microphone button to dictate your answer, or type directly here..."
              : "Type your answer here..."
          }
          disabled={isLoading}
          className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal text-sm leading-relaxed transition-all resize-y disabled:opacity-50"
        />

        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-1">
          <span>
            {transcript.trim() ? `${transcript.trim().split(/\s+/).length} words` : "0 words"}
          </span>
          <span>Tip: You can edit or elaborate in the box before submitting.</span>
        </div>
      </div>

      {/* Submit Answer Action */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading || !transcript.trim()}
        className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-500 active:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-green-600/20 flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span>Analyzing Answer with AI Coach...</span>
          </>
        ) : (
          <>
            <span>Submit Answer for Evaluation</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
