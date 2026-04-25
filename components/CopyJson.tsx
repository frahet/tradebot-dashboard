"use client";

import { useState } from "react";

export function CopyJson({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <pre
        className="text-xs rounded-lg p-4 overflow-x-auto"
        style={{ background: "var(--bg-deep)", color: "var(--text-sec)", border: "1px solid var(--border)" }}
      >
        {value}
      </pre>
      <button
        onClick={copy}
        className="text-xs font-mono px-3 py-1.5 rounded-lg transition-colors"
        style={{
          background: copied ? "rgba(16,185,129,0.15)" : "var(--bg-raised)",
          color: copied ? "var(--green)" : "var(--text-sec)",
          border: `1px solid ${copied ? "var(--green)" : "var(--border)"}`,
          cursor: "pointer",
        }}
      >
        {copied ? "Copied!" : "Copy JSON"}
      </button>
    </div>
  );
}
