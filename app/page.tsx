"use client";

import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import Output from "@/components/Output";
import Editor from "@/components/Editor";

export default function Page() {
  const [result, setResult] = useState("");

  return (
    <div className="min-h-screen flex justify-center bg-color:var(--bg-primary) text-color:var(--text-primary)">
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
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                Format, validate & beautify your JSON
              </p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {/* Main grid */}
        <main className="max-w-7xl px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Editor onChange={setResult} />
            <Output result={result} />
          </div>
        </main>

        {/* Footer con más separación */}
        <footer className="mt-10 md:mt-5 pt-6 md:pt-8 border-t border-color:var(--border-default) text-center">
          <p className="text-sm text-slate-500">
            Made with ❤️ for developers
          </p>
        </footer>
      </div>
    </div>
  );
}
