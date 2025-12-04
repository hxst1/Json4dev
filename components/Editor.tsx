"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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
    const [highlightedText, setHighlightedText] = useState("");
    const [isDark, setIsDark] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);
    const highlightRef = useRef<HTMLDivElement>(null);

    const lines = text.split("\n");
    const lineCount = lines.length;
    const charCount = text.length;

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

    // Syntax highlighting
    const highlightSyntax = useCallback((code: string): string => {
        if (!code) return "";

        const escaped = code
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
    }, [isDark]);

    useEffect(() => {
        setHighlightedText(highlightSyntax(text));
    }, [text, highlightSyntax]);

    // Sync scroll - textarea controls everything
    const handleScroll = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        if (lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textarea.scrollTop;
        }
        if (highlightRef.current) {
            highlightRef.current.scrollTop = textarea.scrollTop;
            highlightRef.current.scrollLeft = textarea.scrollLeft;
        }
    }, []);

    // Handle keyboard
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
                    const beforeCursor = value.substring(0, start);
                    const lineStart = beforeCursor.lastIndexOf("\n") + 1;
                    const lineContent = value.substring(lineStart, start);

                    if (lineContent.startsWith("  ")) {
                        const newValue = value.substring(0, lineStart) + value.substring(lineStart).replace(/^  /, "");
                        setText(newValue);
                        onChange(newValue);
                        requestAnimationFrame(() => {
                            textarea.selectionStart = textarea.selectionEnd = Math.max(lineStart, start - 2);
                        });
                    }
                } else {
                    const newValue = value.substring(0, start) + "  " + value.substring(end);
                    setText(newValue);
                    onChange(newValue);
                    requestAnimationFrame(() => {
                        textarea.selectionStart = textarea.selectionEnd = start + 2;
                    });
                }
            }

            // Auto-close
            const pairs: Record<string, string> = { "{": "}", "[": "]", '"': '"' };
            if (pairs[e.key]) {
                const textarea = textareaRef.current;
                if (!textarea) return;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const value = textarea.value;

                if (start === end) {
                    e.preventDefault();
                    const newValue = value.substring(0, start) + e.key + pairs[e.key] + value.substring(end);
                    setText(newValue);
                    onChange(newValue);
                    requestAnimationFrame(() => {
                        textarea.selectionStart = textarea.selectionEnd = start + 1;
                    });
                }
            }

            // Auto-indent
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

                if (charBefore === "{" || charBefore === "[") {
                    e.preventDefault();
                    const extraIndent = indent + "  ";

                    if ((charBefore === "{" && charAfter === "}") || (charBefore === "[" && charAfter === "]")) {
                        const newValue = value.substring(0, start) + "\n" + extraIndent + "\n" + indent + value.substring(start);
                        setText(newValue);
                        onChange(newValue);
                        requestAnimationFrame(() => {
                            textarea.selectionStart = textarea.selectionEnd = start + 1 + extraIndent.length;
                        });
                    } else {
                        const newValue = value.substring(0, start) + "\n" + extraIndent + value.substring(start);
                        setText(newValue);
                        onChange(newValue);
                        requestAnimationFrame(() => {
                            textarea.selectionStart = textarea.selectionEnd = start + 1 + extraIndent.length;
                        });
                    }
                } else if (indent) {
                    e.preventDefault();
                    const newValue = value.substring(0, start) + "\n" + indent + value.substring(start);
                    setText(newValue);
                    onChange(newValue);
                    requestAnimationFrame(() => {
                        textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length;
                    });
                }
            }
        },
        [onChange]
    );

    const handle = (action: "format" | "minify" | "validate") => {
        let res;
        switch (action) {
            case "format": res = formatJSON(text); break;
            case "minify": res = minifyJSON(text); break;
            case "validate": res = validateJSON(text); break;
        }
        if (res.ok && action !== "validate") setText(res.output);
        onChange(res.ok ? res.output : `❌ Error:\n${res.output}`);
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => { setText(""); onChange(""); };

    const loadSample = () => {
        const sample = JSON.stringify(SAMPLE_JSON, null, 2);
        setText(sample);
        onChange(sample);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        onChange(e.target.value);
    };

    const handleDownload = () => {
        if (!text) return;
        const blob = new Blob([text], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "data.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleUpload = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json,application/json";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const content = ev.target?.result as string;
                    setText(content);
                    onChange(content);
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Header */}
            <div className="flex items-center justify-between h-8">
                <h2 className="text-sm font-semibold flex items-center gap-2 text-color:var(--text-primary)">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                    </span>
                    Input
                </h2>
                <div className="flex gap-2 text-xs font-mono text-color:var(--text-secondary)">
                    <span className="px-2 py-1 rounded bg-color:var(--bg-tertiary)">{lineCount} lines</span>
                    <span className="px-2 py-1 rounded bg-color:var(--bg-tertiary)">{charCount} chars</span>
                </div>
            </div>

            {/* Editor */}
            <div className="relative group">
                <div
                    ref={containerRef}
                    className="flex rounded-xl overflow-hidden border border-color:var(--border-default) bg-color:var(--bg-secondary) focus-within:border-blue-500/50 transition-all duration-300"
                >
                    {/* Line Numbers */}
                    <div
                        ref={lineNumbersRef}
                        className="shrink-0 overflow-hidden select-none border-r border-color:var(--border-default) bg-color:var(--bg-tertiary)"
                        style={{ width: `${Math.max(3, String(lineCount).length + 1)}rem` }}
                    >
                        <div className="py-4 px-2 font-mono text-sm leading-6">
                            {lines.map((_, i) => (
                                <div key={i} className="text-right text-color:var(--text-secondary) hover:text-color:var(--text-primary) transition-colors h-6">
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Code Area - Using a wrapper div for proper scrolling */}
                    <div className="relative flex-1 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px]">
                        {/* Highlight layer - scrolls with textarea */}
                        <div
                            ref={highlightRef}
                            className="absolute inset-0 overflow-hidden pointer-events-none"
                            aria-hidden="true"
                        >
                            <pre
                                className="py-4 px-4 font-mono text-sm leading-6 whitespace-pre text-color:var(--text-primary) min-w-max"
                                dangerouslySetInnerHTML={{ __html: highlightedText + '\n' }}
                            />
                        </div>

                        {/* Textarea - handles all scrolling and interaction */}
                        <textarea
                            ref={textareaRef}
                            value={text}
                            onChange={handleTextChange}
                            onScroll={handleScroll}
                            onKeyDown={handleKeyDown}
                            placeholder="Paste your JSON here..."
                            spellCheck={false}
                            wrap="off"
                            className="absolute inset-0 w-full h-full
                                py-4 px-4 bg-transparent focus:outline-none
                                text-sm font-mono resize-none leading-6
                                text-transparent caret-blue-500 selection:bg-blue-500/30
                                placeholder:text-color:var(--text-secondary)
                                overflow-auto whitespace-pre"
                        />
                    </div>
                </div>

                {/* Floating Buttons */}
                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    {[
                        { action: handleUpload, icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12", title: "Upload" },
                        { action: handleDownload, icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4", title: "Download", disabled: !text },
                        { action: handleCopy, icon: copied ? "M5 13l4 4L19 7" : "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z", title: "Copy", disabled: !text, success: copied },
                        { action: handleClear, icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16", title: "Clear", disabled: !text, danger: true },
                    ].map(({ action, icon, title, disabled, success, danger }) => (
                        <button
                            key={title}
                            onClick={action}
                            disabled={disabled}
                            className={`p-2 rounded-lg transition-all duration-200 border border-color:var(--border-default)
                            bg-color:var(--bg-tertiary) disabled:opacity-30 disabled:cursor-not-allowed
                            ${danger ? "hover:bg-rose-600 hover:border-rose-600" : "hover:bg-color:var(--bg-hover)"}`}
                            title={title}
                        >
                            <svg className={`w-4 h-4 ${success ? "text-emerald-400" : "text-color:var(--text-secondary)"} ${danger ? "group-hover:text-white" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                            </svg>
                        </button>
                    ))}
                </div>

                {/* Shortcuts hint */}
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <div className="flex gap-2 text-[10px] text-color:var(--text-secondary)">
                        <span className="px-1.5 py-0.5 rounded bg-color:var(--bg-tertiary) border border-color:var(--border-default)">Tab</span>
                        <span>indent</span>
                        <span className="px-1.5 py-0.5 rounded bg-color:var(--bg-tertiary) border border-color:var(--border-default)">Shift+Tab</span>
                        <span>outdent</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-5 gap-2">
                <button onClick={() => handle("format")} disabled={!text}
                    className="px-3 py-2.5 rounded-lg font-medium text-sm text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all">
                    <span className="flex items-center justify-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                        <span className="hidden sm:inline">Format</span>
                    </span>
                </button>
                <button onClick={() => handle("minify")} disabled={!text}
                    className="px-3 py-2.5 rounded-lg font-medium text-sm text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all">
                    <span className="flex items-center justify-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        <span className="hidden sm:inline">Minify</span>
                    </span>
                </button>
                <button onClick={() => handle("validate")} disabled={!text}
                    className="px-3 py-2.5 rounded-lg font-medium text-sm text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all">
                    <span className="flex items-center justify-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="hidden sm:inline">Validate</span>
                    </span>
                </button>
                <button onClick={loadSample}
                    className="px-3 py-2.5 rounded-lg font-medium text-sm cursor-pointer transition-all border
                    bg-color:var(--bg-tertiary) text-color:var(--text-primary) border-color:var(--border-default) hover:bg-color:var(--bg-hover)">
                    <span className="flex items-center justify-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="hidden sm:inline">Sample</span>
                    </span>
                </button>
                <button onClick={handleUpload}
                    className="px-3 py-2.5 rounded-lg font-medium text-sm cursor-pointer transition-all border
                    bg-color:var(--bg-tertiary) text-color:var(--text-primary) border-color:var(--border-default) hover:bg-color:var(--bg-hover)">
                    <span className="flex items-center justify-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="hidden sm:inline">Upload</span>
                    </span>
                </button>
            </div>
        </div>
    );
}