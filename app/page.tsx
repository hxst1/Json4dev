"use client";

import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import Output from "@/components/Output";
import Editor from "@/components/Editor";

function GitHubStarButton() {
  return (
    <a
      href="https://github.com/hxst1/Json4dev"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border
            bg-(--bg-tertiary) text-(--text-primary) border-(--border-default) 
            hover:bg-(--bg-hover) hover:border-(--border-strong)"
    >
      <svg
        className="w-4 h-4"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
      <svg
        className="w-4 h-4 text-yellow-500"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
      </svg>
      <span className="hidden sm:inline">Star</span>
    </a>
  );
}

export default function Page() {
  const [result, setResult] = useState("");

  return (
    <div className="min-h-screen flex justify-center bg-(--bg-primary) text-(--text-primary)">
      <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 md:mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg
                className="w-6 h-6 md:w-7 md:h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                JSON 4 DEV
              </h1>
              <p className="text-xs md:text-sm text-(--text-secondary) mt-0.5">
                Format, validate & beautify your JSON
              </p>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-3">
            <GitHubStarButton />
            <ThemeToggle />
          </div>
        </header>

        {/* Main grid */}
        <main className="flex-1 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Editor onChange={setResult} />
            <Output result={result} />
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-10 md:mt-8 pt-6 border-t border-(--border-default)">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-(--text-secondary)">
              Made with <span className="text-red-500">❤️</span> for developers
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/hxst1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>Created by <span className="font-medium text-(--text-primary)">hxst1</span></span>
              </a>

              <span className="text-(--border-default)">•</span>

              <a
                href="https://github.com/hxst1/Json4dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                <span>Source Code</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}