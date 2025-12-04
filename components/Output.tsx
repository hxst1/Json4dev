"use client";

import { useState, useRef, useCallback } from "react";

export default function Output({ result }: { result: string }) {
    const [copied, setCopied] = useState(false);
    const contentRef = useRef<HTMLPreElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);

    const isError = result.startsWith("❌");
    const isEmpty = !result || result === "Output will appear here...";

    const lines = result.split("\n");
    const lineCount = lines.length;

    const handleScroll = useCallback(() => {
        if (contentRef.current && lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = contentRef.current.scrollTop;
        }
    }, []);

    const handleCopy = async () => {
        if (!isEmpty && !isError) {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Enhanced syntax highlighting for JSON
    const highlightJSON = (json: string): string => {
        if (isError || isEmpty) return json;

        try {
            // Escape HTML first
            const escaped = json
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

            // Apply syntax highlighting
            return escaped
                // Keys (property names)
                .replace(
                    /(&quot;|")([^"\\]*(?:\\.[^"\\]*)*)(&quot;|")\s*:/g,
                    '<span class="text-cyan-400">"$2"</span>:'
                )
                // String values
                .replace(
                    /:\s*(&quot;|")([^"\\]*(?:\\.[^"\\]*)*)(&quot;|")/g,
                    ': <span class="text-amber-300">"$2"</span>'
                )
                // Numbers
                .replace(
                    /:\s*(-?\d+\.?\d*(?:[eE][+-]?\d+)?)/g,
                    ': <span class="text-violet-400">$1</span>'
                )
                // Booleans
                .replace(
                    /:\s*(true|false)/g,
                    ': <span class="text-rose-400">$1</span>'
                )
                // Null
                .replace(
                    /:\s*(null)/g,
                    ': <span class="text-slate-500 italic">$1</span>'
                )
                // Brackets
                .replace(
                    /(\{|\})/g,
                    '<span class="text-slate-400">$1</span>'
                )
                .replace(
                    /(\[|\])/g,
                    '<span class="text-slate-400">$1</span>'
                );
        } catch {
            return json;
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span
                            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
                            ${isError ? "bg-rose-400" : isEmpty ? "bg-slate-500" : "bg-emerald-400"}`}
                        ></span>
                        <span
                            className={`relative inline-flex rounded-full h-2 w-2
                            ${isError ? "bg-rose-500" : isEmpty ? "bg-slate-600" : "bg-emerald-500"}`}
                        ></span>
                    </span>
                    Output
                </h2>

                {!isEmpty && (
                    <div className="flex items-center gap-3">
                        <div className="flex gap-3 text-xs text-slate-500 font-mono">
                            <span className="px-2 py-1 rounded bg-slate-800/50">{lineCount} lines</span>
                        </div>
                        {!isError && (
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium
                                bg-slate-800/80 backdrop-blur-sm
                                hover:bg-slate-700
                                transition-all duration-200
                                text-slate-400 hover:text-white
                                border border-slate-700/50"
                            >
                                {copied ? (
                                    <>
                                        <svg
                                            className="w-3.5 h-3.5 text-emerald-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        <span className="text-emerald-400">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            className="w-3.5 h-3.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                            />
                                        </svg>
                                        Copy
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Output Container */}
            <div className="relative group">
                <div
                    className={`flex rounded-xl overflow-hidden
                    shadow-2xl shadow-black/40
                    transition-all duration-300
                    ${isError
                            ? "bg-linear-to-br from-rose-950/50 via-slate-900 to-slate-900 border border-rose-500/30"
                            : isEmpty
                                ? "bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/50"
                                : "bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 border border-emerald-500/20"
                        }`}
                >
                    {/* Line Numbers (only show when there's content) */}
                    {!isEmpty && (
                        <div
                            ref={lineNumbersRef}
                            className="shrink-0 overflow-hidden select-none
                            bg-slate-900/80 border-r border-slate-700/50"
                            style={{ width: `${Math.max(3, String(lineCount).length + 1)}rem` }}
                        >
                            <div className="py-4 px-2 font-mono text-sm md:text-base leading-6">
                                {lines.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`text-right transition-colors
                                        ${isError ? "text-rose-800 hover:text-rose-600" : "text-slate-600 hover:text-slate-400"}`}
                                    >
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <pre
                        ref={contentRef}
                        onScroll={handleScroll}
                        className={`flex-1 w-full h-[260px] sm:h-80 md:h-[380px] lg:h-[440px] xl:h-[500px]
                        overflow-auto font-mono text-sm md:text-base leading-6
                        ${isEmpty ? "" : "py-4 px-4"}
                        ${isError ? "text-rose-400" : "text-slate-200"}`}
                    >
                        {isEmpty ? (
                            <span className="flex flex-col items-center justify-center h-full text-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-cyan-500/10 blur-2xl rounded-full"></div>
                                    <svg
                                        className="relative w-20 h-20 text-slate-700"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-500 font-medium">No output yet</p>
                                    <p className="text-slate-600 text-sm">Your formatted JSON will appear here</p>
                                </div>
                            </span>
                        ) : isError ? (
                            <code className="block whitespace-pre-wrap">{result}</code>
                        ) : (
                            <code
                                className="block"
                                dangerouslySetInnerHTML={{ __html: highlightJSON(result) }}
                            />
                        )}
                    </pre>
                </div>

                {/* Status Badge */}
                {!isEmpty && (
                    <div className="absolute bottom-3 right-3">
                        {isError ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
                            bg-rose-500/10 backdrop-blur-sm
                            border border-rose-500/30 
                            text-rose-400 text-xs font-semibold
                            shadow-lg shadow-rose-500/10">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Invalid JSON
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
                            bg-emerald-500/10 backdrop-blur-sm
                            border border-emerald-500/30 
                            text-emerald-400 text-xs font-semibold
                            shadow-lg shadow-emerald-500/10">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Valid JSON
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}