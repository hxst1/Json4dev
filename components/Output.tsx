"use client";

import { useState } from "react";

export default function Output({ result }: { result: string }) {
    const [copied, setCopied] = useState(false);
    const isError = result.startsWith("❌");
    const isEmpty = !result || result === "Output will appear here...";

    const handleCopy = async () => {
        if (!isEmpty && !isError) {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Simple syntax highlighting for JSON
    const highlightJSON = (json: string) => {
        if (isError || isEmpty) return json;

        try {
            return json
                .replace(/("(?:\\.|[^"\\])*")\s*:/g, '<span class="text-blue-400">$1</span>:')
                .replace(/:\s*("(?:\\.|[^"\\])*")/g, ': <span class="text-green-400">$1</span>')
                .replace(/:\s*(\d+)/g, ': <span class="text-orange-400">$1</span>')
                .replace(/:\s*(true|false|null)/g, ': <span class="text-purple-400">$1</span>');
        } catch {
            return json;
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-300 light:text-slate-700 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isError ? 'bg-red-500' : isEmpty ? 'bg-slate-500' : 'bg-green-500'} animate-pulse`}></span>
                    Output
                </h2>
                {!isEmpty && !isError && (
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs
                                 bg-slate-800 light:bg-slate-100
                                 hover:bg-slate-700 light:hover:bg-slate-200
                                 transition-all duration-200
                                 text-slate-300 light:text-slate-700"
                    >
                        {copied ? (
                            <>
                                <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy
                            </>
                        )}
                    </button>
                )}
            </div>

            <div className="relative group">
                <pre
                    className={`w-full h-[400px] p-4 rounded-xl overflow-auto font-mono text-sm
                          border shadow-xl shadow-black/20
                          ${isError
                            ? "bg-red-950/30 border-red-500/50 text-red-400"
                            : isEmpty
                                ? "bg-slate-900 light:bg-white border-slate-800 light:border-slate-200 text-slate-500"
                                : "bg-slate-900 light:bg-white border-slate-800 light:border-slate-200 text-slate-100 light:text-slate-900"
                        }
                          transition-all duration-200`}
                >
                    {isEmpty ? (
                        <span className="flex flex-col items-center justify-center h-full text-center gap-3">
                            <svg className="w-16 h-16 text-slate-700 light:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-slate-600 light:text-slate-400">
                                Your formatted JSON will appear here...
                            </span>
                        </span>
                    ) : isError ? (
                        result
                    ) : (
                        <span dangerouslySetInnerHTML={{ __html: highlightJSON(result) }} />
                    )}
                </pre>

                {/* Badge de estado */}
                {!isEmpty && (
                    <div className="absolute bottom-3 right-3">
                        {isError ? (
                            <span className="px-2 py-1 rounded-md bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-medium">
                                ❌ Invalid
                            </span>
                        ) : (
                            <span className="px-2 py-1 rounded-md bg-green-500/20 border border-green-500/50 text-green-400 text-xs font-medium">
                                ✓ Valid JSON
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}