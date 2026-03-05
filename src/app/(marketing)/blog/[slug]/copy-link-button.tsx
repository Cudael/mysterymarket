"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-[8px] border border-[#D9DCE3] bg-[#FFFFFF] px-4 py-2 text-sm font-medium text-[#1A1A1A]/70 hover:border-[#3A5FCD]/40 hover:text-[#3A5FCD] transition-colors"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-600" />
          Copied!
        </>
      ) : (
        <>
          <Link2 className="h-4 w-4" />
          Copy link
        </>
      )}
    </button>
  );
}
