interface QuickTakeProps {
  text: string;
}

export default function QuickTake({ text }: QuickTakeProps) {
  return (
    <div className="mx-4 rounded-r-lg border-l-[3px] border-amber-400 bg-amber-50 px-5 py-4 dark:bg-amber-950/20 sm:mx-0">
      <div className="mb-1 font-display text-sm font-bold text-amber-600 dark:text-amber-400">
        ⚡ En bref
      </div>
      <p className="text-sm leading-relaxed text-[var(--color-text-mid)]">
        {text}
      </p>
    </div>
  );
}
