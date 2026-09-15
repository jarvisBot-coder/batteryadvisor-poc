interface PullQuoteProps {
  children: React.ReactNode;
}

export default function PullQuote({ children }: PullQuoteProps) {
  return (
    <blockquote className="my-5 rounded-r-lg border-l-[3px] border-[var(--color-primary)] bg-[var(--color-primary)]/5 px-5 py-4 font-display text-[.95rem] font-medium italic leading-relaxed text-[var(--color-primary)]">
      {children}
    </blockquote>
  );
}
