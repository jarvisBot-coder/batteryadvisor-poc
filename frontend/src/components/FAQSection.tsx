"use client";

import { useState } from "react";
import type { FAQItem } from "@/lib/types";

interface FAQSectionProps {
  items: FAQItem[];
}

function FAQEntry({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--color-border)] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold text-[var(--color-text)] transition-colors hover:text-[var(--color-primary)]"
      >
        {item.question}
        <span className="ml-4 shrink-0 text-lg text-[var(--color-primary)]">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-[var(--color-text-mid)]">
          {item.answer}
        </p>
      )}
    </div>
  );
}

export default function FAQSection({ items }: FAQSectionProps) {
  return (
    <div className="px-4 py-7 sm:px-6">
      <h2 className="mb-3 font-display text-lg font-bold">
        Questions fréquentes
      </h2>
      <div>
        {items.map((item, i) => (
          <FAQEntry key={i} item={item} />
        ))}
      </div>
    </div>
  );
}
