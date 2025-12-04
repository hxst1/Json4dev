"use client";

import { useState } from "react";
import { formatJSON, minifyJSON, validateJSON } from "@/lib/json";

const SAMPLE_JSON = {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "address": {
        "street": "123 Main St",
        "city": "New York"
    },
    "hobbies": ["reading", "coding", "music"]
};

export default function Editor({ onChange }: { onChange: (v: string) => void }) {
    const [text, setText] = useState("");
    const [copied, setCopied] = useState(false);

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

        onChange(
            res.ok ? res.output : `❌ Error:\n${res.output}`
        );
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

    const charCount = text.length;
    const lineCount = text.split('\n').length;

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-300 light:text-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    Input
                </h2>
                <div className="flex gap-2 text-xs text-slate-500">
                    <span>{lineCount} lines</span>
                    <span>•</span>
                    <span>{charCount} chars</span>
                </div>
            </div>

            <div className="relative group">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your JSON here... or try a sample →"
                    className="w-full h-[400px] p-4 rounded-xl
                       bg-slate-900 light:bg-white
                       border border-slate-800 light:border-slate-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       text-sm font-mono resize-none
                       text-slate-100 light:text-slate-900
                       placeholder:text-slate-600 light:placeholder:text-slate-400
                       transition-all duration-200
                       shadow-xl shadow-black/20"
                    spellCheck={false}
                />

                {/* Botones flotantes en el textarea */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleCopy}
                        disabled={!text}
                        className="p-2 rounded-lg bg-slate-800 light:bg-slate-100 
                                 hover:bg-slate-700 light:hover:bg-slate-200
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all duration-200 shadow-lg"
                        title="Copy to clipboard"
                    >
                        {copied ? (
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        )}
                    </button>
                    <button
                        onClick={handleClear}
                        disabled={!text}
                        className="p-2 rounded-lg bg-slate-800 light:bg-slate-100 
                                 hover:bg-red-500 light:hover:bg-red-500
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all duration-200 shadow-lg group/clear"
                        title="Clear"
                    >
                        <svg className="w-4 h-4 text-slate-400 group-hover/clear:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => handle("format")}
                    className="flex-1 min-w-[100px] px-4 py-2.5 rounded-lg font-medium text-sm
                             bg-blue-600 hover:bg-blue-700 text-white
                             transition-all duration-200
                             shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50
                             disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!text}
                >
                    ✨ Format
                </button>
                <button
                    onClick={() => handle("minify")}
                    className="flex-1 min-w-[100px] px-4 py-2.5 rounded-lg font-medium text-sm
                             bg-purple-600 hover:bg-purple-700 text-white
                             transition-all duration-200
                             shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50
                             disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!text}
                >
                    🗜️ Minify
                </button>
                <button
                    onClick={() => handle("validate")}
                    className="flex-1 min-w-[100px] px-4 py-2.5 rounded-lg font-medium text-sm
                             bg-green-600 hover:bg-green-700 text-white
                             transition-all duration-200
                             shadow-lg shadow-green-500/30 hover:shadow-green-500/50
                             disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!text}
                >
                    ✓ Validate
                </button>
                <button
                    onClick={loadSample}
                    className="px-4 py-2.5 rounded-lg font-medium text-sm
                             bg-slate-700 light:bg-slate-200 hover:bg-slate-600 light:hover:bg-slate-300
                             text-slate-200 light:text-slate-700
                             transition-all duration-200
                             border border-slate-600 light:border-slate-300"
                >
                    📝 Sample
                </button>
            </div>
        </div>
    );
}