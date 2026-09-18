"use client";

import React, { useState } from "react";

interface SetupStateProps {
  onStart: (role: string) => void;
  isLoading: boolean;
}

const COMMON_ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Engineer",
  "Product Manager",
  "Data Scientist",
  "DevOps Engineer",
];

export function SetupState({ onStart, isLoading }: SetupStateProps) {
  const [role, setRole] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) {
      setError("Please enter or select a job role to begin.");
      return;
    }
    setError(null);
    onStart(role.trim());
  };

  const handleSelectRole = (selectedRole: string) => {
    setRole(selectedRole);
    setError(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 transition-all">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4 ring-1 ring-blue-500/20">
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Target Job Role
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
          Tell our AI coach which position you are interviewing for. We will craft a realistic interview question for your session.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="role-input"
            className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Job Title / Position
          </label>
          <input
            id="role-input"
            type="text"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. Senior Full Stack Engineer"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
          />
          {error && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-2 font-medium">
              {error}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5">
            Suggested Positions
          </p>
          <div className="flex flex-wrap gap-2">
            {COMMON_ROLES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSelectRole(item)}
                disabled={isLoading}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  role === item
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !role.trim()}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2"
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
              <span>Generating Interview Question...</span>
            </>
          ) : (
            <>
              <span>Start Interview</span>
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
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
