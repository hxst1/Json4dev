"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export default function Output({ result }: { result: string }) {
    const [copied, setCopied] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const contentRef = useRef<HTMLPreElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);

    const isError = result.startsWith("❌");
    const isEmpty = !result || result === "Output will appear here...";

    const lines = result.split("\n");
    const lineCount = lines.length;
    const charCount = result.length;

    // Detect theme changes
    useEffect(() => {
        const checkTheme = () => {
            const isDarkMode = document.documentElement.classList.contains("dark");
            setIsDark(isDarkMode);
        };

        checkTheme();

        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"]
        });

        return () => observer.disconnect();
    }, []);

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

    const handleDownload = () => {
        if (isEmpty || isError) return;
        const blob = new Blob([result], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "output.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    // Syntax highlighting
    const highlightJSON = (json: string): string => {
        if (isError || isEmpty) return json;

        try {
            const escaped = json
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

            if (isDark) {
                return escaped
                    .replace(/("(?:\\.|[^"\\])*")(\s*:)/g, '<span style="color:#7dd3fc">$1</span>$2')
                    .replace(/:(\s*)("(?:\\.|[^"\\])*")/g, ':$1<span style="color:#fcd34d">$2</span>')
                    .replace(/:(\s*)(-?\d+\.?\d*(?:[eE][+-]?\d+)?)([\s,\n\]}])/g, ':$1<span style="color:#c4b5fd">$2</span>$3')
                    .replace(/:(\s*)(true|false)([\s,\n\]}])/g, ':$1<span style="color:#fb7185">$2</span>$3')
                    .replace(/:(\s*)(null)([\s,\n\]}])/g, ':$1<span style="color:#64748b">$2</span>$3')
                    .replace(/([{}\[\]])/g, '<span style="color:#64748b">$1</span>');
            } else {
                return escaped
                    .replace(/("(?:\\.|[^"\\])*")(\s*:)/g, '<span style="color:#2563eb">$1</span>$2')
                    .replace(/:(\s*)("(?:\\.|[^"\\])*")/g, ':$1<span style="color:#059669">$2</span>')
                    .replace(/:(\s*)(-?\d+\.?\d*(?:[eE][+-]?\d+)?)([\s,\n\]}])/g, ':$1<span style="color:#7c3aed">$2</span>$3')
                    .replace(/:(\s*)(true|false)([\s,\n\]}])/g, ':$1<span style="color:#ea580c">$2</span>$3')
                    .replace(/:(\s*)(null)([\s,\n\]}])/g, ':$1<span style="color:#9ca3af">$2</span>$3')
                    .replace(/([{}\[\]])/g, '<span style="color:#6b7280">$1</span>');
            }
        } catch {
            return json;
        }
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Header - Same height as Editor */}
            <div className="flex items-center justify-between h-8">
                <h2 className="text-sm font-semibold flex items-center gap-2 text-color:var(--text-primary)">
                    <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
                            ${isError ? "bg-rose-500" : isEmpty ? "bg-slate-500" : "bg-emerald-500"}`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2
                            ${isError ? "bg-rose-500" : isEmpty ? "bg-slate-500" : "bg-emerald-500"}`}></span>
                    </span>
                    Output
                </h2>

                <div className="flex items-center gap-2">
                    {!isEmpty && (
                        <div className="flex gap-2 text-xs font-mono text-color:var(--text-secondary)">
                            <span className="px-2 py-1 rounded bg-color:var(--bg-tertiary)">{lineCount} lines</span>
                            <span className="px-2 py-1 rounded bg-color:var(--bg-tertiary)">{charCount} chars</span>
                        </div>
                    )}
                    {!isEmpty && !isError && (
                        <div className="flex gap-1.5">
                            <button
                                onClick={handleDownload}
                                className="p-1.5 rounded-lg text-xs font-medium transition-all duration-200 border
                                bg-color:var(--bg-tertiary) text-color:var(--text-secondary) hover:text-color:var(--text-primary)
                                border-color:var(--border-default) hover:bg-color:var(--bg-hover)"
                                title="Download JSON"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </button>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border
                                bg-color:var(--bg-tertiary) text-color:var(--text-secondary) hover:text-color:var(--text-primary)
                                border-color:var(--border-default) hover:bg-color:var(--bg-hover)"
                            >
                                {copied ? (
                                    <>
                                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-emerald-400">Copied!</span>
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
                        </div>
                    )}
                </div>
            </div>

            {/* Output Container */}
            <div className="relative group">
                <div className={`flex rounded-xl overflow-hidden border transition-all duration-300
                    bg-color:var(--bg-secondary)
                    ${isError
                        ? "border-rose-500/30"
                        : isEmpty
                            ? "border-color:var(--border-default)"
                            : "border-emerald-500/20"
                    }`}
                >
                    {/* Line Numbers */}
                    {!isEmpty && (
                        <div
                            ref={lineNumbersRef}
                            className="shrink-0 overflow-hidden select-none border-r border-color:var(--border-default) bg-color:var(--bg-tertiary)"
                            style={{ width: `${Math.max(3, String(lineCount).length + 1)}rem` }}
                        >
                            <div className="py-4 px-2 font-mono text-sm leading-6">
                                {lines.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`text-right transition-colors
                                        ${isError
                                                ? "text-rose-700 hover:text-rose-500"
                                                : "text-color:var(--text-secondary) hover:text-color:var(--text-primary)"
                                            }`}
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
                        className={`flex-1 w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]
                        overflow-auto font-mono text-sm leading-6
                        ${isEmpty ? "" : "py-4 px-4"}
                        ${isError ? "text-rose-400" : "text-color:var(--text-primary)"}`}
                    >
                        {isEmpty ? (
                            <span className="flex flex-col items-center justify-center h-full text-center gap-4">
                                <svg
                                    className="w-16 h-16 text-color:var(--text-secondary) opacity-30"
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
                                <div className="space-y-1">
                                    <p className="font-medium text-color:var(--text-secondary)">No output yet</p>
                                    <p className="text-sm text-color:var(--text-secondary) opacity-60">Your formatted JSON will appear here</p>
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
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                            bg-rose-500/10 border border-rose-500/30 text-rose-400">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Invalid JSON
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                            bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
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