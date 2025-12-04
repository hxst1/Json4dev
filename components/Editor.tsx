"use client";

import { useState, useRef, useCallback } from "react";
import { formatJSON, minifyJSON, validateJSON } from "@/lib/json";

const SAMPLE_JSON = {
    name: "John Doe",
    age: 30,
    email: "john@example.com",
    address: {
        street: "123 Main St",
        city: "New York",
    },
    hobbies: ["reading", "coding", "music"],
};

export default function Editor({ onChange }: { onChange: (v: string) => void }) {
    const [text, setText] = useState("");
    const [copied, setCopied] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);

    const lines = text.split("\n");
    const lineCount = lines.length;
    const charCount = text.length;

    // Sync scroll between textarea and line numbers
    const handleScroll = useCallback(() => {
        if (textareaRef.current && lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    }, []);

    // Handle tab key for indentation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Tab") {
                e.preventDefault();
                const textarea = textareaRef.current;
                if (!textarea) return;

                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const value = textarea.value;

                if (e.shiftKey) {
                    // Shift+Tab: Remove indentation
                    const beforeCursor = value.substring(0, start);
                    const lineStart = beforeCursor.lastIndexOf("\n") + 1;
                    const lineContent = value.substring(lineStart, start);

                    if (lineContent.startsWith("  ")) {
                        const newValue =
                            value.substring(0, lineStart) +
                            value.substring(lineStart).replace(/^  /, "");
                        setText(newValue);
                        onChange(newValue);
                        // Restore cursor position
                        requestAnimationFrame(() => {
                            textarea.selectionStart = textarea.selectionEnd = Math.max(
                                lineStart,
                                start - 2
                            );
                        });
                    }
                } else {
                    // Tab: Add indentation (2 spaces)
                    const newValue =
                        value.substring(0, start) + "  " + value.substring(end);
                    setText(newValue);
                    onChange(newValue);
                    // Move cursor after the inserted spaces
                    requestAnimationFrame(() => {
                        textarea.selectionStart = textarea.selectionEnd = start + 2;
                    });
                }
            }

            // Auto-close brackets and quotes
            const pairs: Record<string, string> = {
                "{": "}",
                "[": "]",
                '"': '"',
            };

            if (pairs[e.key]) {
                const textarea = textareaRef.current;
                if (!textarea) return;

                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const value = textarea.value;

                // Only auto-close if nothing is selected
                if (start === end) {
                    e.preventDefault();
                    const newValue =
                        value.substring(0, start) +
                        e.key +
                        pairs[e.key] +
                        value.substring(end);
                    setText(newValue);
                    onChange(newValue);
                    requestAnimationFrame(() => {
                        textarea.selectionStart = textarea.selectionEnd = start + 1;
                    });
                }
            }

            // Enter key: Auto-indent
            if (e.key === "Enter") {
                const textarea = textareaRef.current;
                if (!textarea) return;

                const start = textarea.selectionStart;
                const value = textarea.value;
                const beforeCursor = value.substring(0, start);
                const lineStart = beforeCursor.lastIndexOf("\n") + 1;
                const currentLine = beforeCursor.substring(lineStart);
                const indent = currentLine.match(/^\s*/)?.[0] || "";
                const charBefore = value[start - 1];
                const charAfter = value[start];

                // Extra indent after { or [
                if (charBefore === "{" || charBefore === "[") {
                    e.preventDefault();
                    const extraIndent = indent + "  ";

                    // If closing bracket follows, add it on new line
                    if (
                        (charBefore === "{" && charAfter === "}") ||
                        (charBefore === "[" && charAfter === "]")
                    ) {
                        const newValue =
                            value.substring(0, start) +
                            "\n" +
                            extraIndent +
                            "\n" +
                            indent +
                            value.substring(start);
                        setText(newValue);
                        onChange(newValue);
                        requestAnimationFrame(() => {
                            textarea.selectionStart = textarea.selectionEnd =
                                start + 1 + extraIndent.length;
                        });
                    } else {
                        const newValue =
                            value.substring(0, start) +
                            "\n" +
                            extraIndent +
                            value.substring(start);
                        setText(newValue);
                        onChange(newValue);
                        requestAnimationFrame(() => {
                            textarea.selectionStart = textarea.selectionEnd =
                                start + 1 + extraIndent.length;
                        });
                    }
                } else if (indent) {
                    // Maintain current indentation
                    e.preventDefault();
                    const newValue =
                        value.substring(0, start) + "\n" + indent + value.substring(start);
                    setText(newValue);
                    onChange(newValue);
                    requestAnimationFrame(() => {
                        textarea.selectionStart = textarea.selectionEnd =
                            start + 1 + indent.length;
                    });
                }
            }
        },
        [onChange]
    );

    const handle = (action: "format" | "minify" | "validate") => {
        let res;

        switch (action) {
            case "format":
                res = formatJSON(text);
                break;
            case "minify":
                res = minifyJSON(text);
                break;
            case "validate":
                res = validateJSON(text);
                break;
        }

        if (res.ok && action !== "validate") {
            setText(res.output);
        }

        onChange(res.ok ? res.output : `❌ Error:\n${res.output}`);
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setText("");
        onChange("");
    };

    const loadSample = () => {
        const sample = JSON.stringify(SAMPLE_JSON, null, 2);
        setText(sample);
        onChange(sample);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        onChange(e.target.value);
    };

    return (
        <div className="flex flex-col gap-4 w-full mb-6 md:mb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    Input
                </h2>
                <div className="flex gap-3 text-xs text-slate-500 font-mono">
                    <span className="px-2 py-1 rounded bg-slate-800/50">{lineCount} lines</span>
                    <span className="px-2 py-1 rounded bg-slate-800/50">{charCount} chars</span>
                </div>
            </div>

            {/* Editor Container */}
            <div className="relative group">
                <div
                    className="flex rounded-xl overflow-hidden
                    bg-linear-to-br from-slate-900 via-slate-900 to-slate-800
                    border border-slate-700/50
                    shadow-2xl shadow-black/40
                    focus-within:ring-2 focus-within:ring-cyan-500/50 focus-within:border-cyan-500/50
                    transition-all duration-300"
                >
                    {/* Line Numbers */}
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
                                    className="text-right text-slate-600 hover:text-slate-400 transition-colors"
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={handleTextChange}
                        onScroll={handleScroll}
                        onKeyDown={handleKeyDown}
                        placeholder="Paste your JSON here..."
                        spellCheck={false}
                        className="flex-1 w-full h-[260px] sm:h-80 md:h-[380px] lg:h-[440px] xl:h-[500px]
                        py-4 px-4 
                        bg-transparent
                        
                        text-sm md:text-base font-mono resize-none
                        "
                    />
                </div>

                {/* Floating Action Buttons */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                        onClick={handleCopy}
                        disabled={!text}
                        className="p-2.5 rounded-lg 
                        bg-slate-800/90 backdrop-blur-sm
                        hover:bg-slate-700 hover:scale-105
                        disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100
                        transition-all duration-200 
                        shadow-lg shadow-black/30
                        border border-slate-700/50"
                        title="Copy to clipboard"
                    >
                        {copied ? (
                            <svg
                                className="w-4 h-4 text-emerald-400"
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
                        ) : (
                            <svg
                                className="w-4 h-4 text-slate-400"
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
                        )}
                    </button>
                    <button
                        onClick={handleClear}
                        disabled={!text}
                        className="p-2.5 rounded-lg 
                        bg-slate-800/90 backdrop-blur-sm
                        hover:bg-rose-600 hover:scale-105
                        disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100
                        transition-all duration-200 
                        shadow-lg shadow-black/30
                        border border-slate-700/50
                        group/clear"
                        title="Clear"
                    >
                        <svg
                            className="w-4 h-4 text-slate-400 group-hover/clear:text-white transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                </div>

                {/* Keyboard shortcuts hint */}
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex gap-2 text-[10px] text-slate-600">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/50">Tab</span>
                        <span>indent</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/50">Shift+Tab</span>
                        <span>outdent</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-2">
                <button
                    onClick={() => handle("format")}
                    disabled={!text}
                    className="flex-1 sm:flex-none min-w-[130px] px-5 py-3.5 rounded-xl font-semibold text-sm md:text-base
                    bg-linear-to-r from-cyan-600 to-blue-600 
                    hover:from-cyan-500 hover:to-blue-500
                    text-white
                    transition-all duration-300
                    shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40
                    hover:scale-[1.02] active:scale-[0.98]
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none
                    border border-cyan-400/20 cursor-pointer"
                >
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                        Format
                    </span>
                </button>
                <button
                    onClick={() => handle("minify")}
                    disabled={!text}
                    className="flex-1 sm:flex-none min-w-[130px] px-5 py-3.5 rounded-xl font-semibold text-sm md:text-base
                    bg-linear-to-r from-violet-600 to-purple-600
                    hover:from-violet-500 hover:to-purple-500
                    text-white
                    transition-all duration-300
                    shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40
                    hover:scale-[1.02] active:scale-[0.98]
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none
                    border border-violet-400/20 cursor-pointer"
                >
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        Minify
                    </span>
                </button>
                <button
                    onClick={() => handle("validate")}
                    disabled={!text}
                    className="flex-1 sm:flex-none min-w-[130px] px-5 py-3.5 rounded-xl font-semibold text-sm md:text-base
                    bg-linear-to-r from-emerald-600 to-green-600
                    hover:from-emerald-500 hover:to-green-500
                    text-white
                    transition-all duration-300
                    shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40
                    hover:scale-[1.02] active:scale-[0.98]
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none
                    border border-emerald-400/20 cursor-pointer"
                >
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Validate
                    </span>
                </button>
                <button
                    onClick={loadSample}
                    className="px-5 py-3.5 rounded-xl font-semibold text-sm md:text-base
                    bg-slate-800
                    text-slate-300
                    hover:bg-slate-700 hover:text-white
                    transition-all duration-300
                    hover:scale-[1.02] active:scale-[0.98]
                    border border-slate-700/50 hover:border-slate-600 cursor-pointer"
                >
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Sample
                    </span>
                </button>
            </div>
        </div>
    );
}