"use client";

import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import Output from "@/components/Output";
import Editor from "@/components/Editor";

export default function Page() {
  const [result, setResult] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 light:from-slate-50 light:via-white light:to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header mejorado */}
        <header className="flex items-center justify-between mb-10 md:mb-14">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                JSON 4 DEV
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                Format, validate & beautify your JSON
              </p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {/* Grid mejorado con mejor espaciado y animaciones */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          <Editor onChange={setResult} />
          <Output result={result} />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-800 light:border-slate-200 text-center">
          <p className="text-sm text-slate-500">
            Made with ❤️ for developers
          </p>
        </footer>
      </div>
    </div>
  );
}