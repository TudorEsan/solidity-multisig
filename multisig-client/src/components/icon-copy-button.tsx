"use client";

import React from "react";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";

interface Props {
  text: string;
}

export function IconCopyButton({ text }: Props) {
  const [copied, setCopied] = React.useState(false);
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <button
      onClick={handleClick}
      aria-label={copied ? "Copied" : "Copy to clipboard"} // Accessible label for screen readers
      type="button"
    >
      {copied ? (
        <CheckIcon className="w-4 h-4" />
      ) : (
        <CopyIcon className="w-4 h-4" />
      )}
    </button>
  );
}
