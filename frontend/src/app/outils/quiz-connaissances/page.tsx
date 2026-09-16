import type { Metadata } from "next";
import QuizConnaissancesClient from "./QuizConnaissancesClient";

export const metadata: Metadata = {
  title: "Quiz : testez vos connaissances sur les batteries domestiques",
  description:
    "Six questions pour tester ce que vous savez sur les batteries domestiques plug-in : chimie, rendement, tarif dynamique, backup et plus.",
};

export default function QuizConnaissancesPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <header className="text-center">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Quiz connaissances</h1>
        <p className="mx-auto mt-2 max-w-xl text-[var(--color-text-mid)]">
          Testez vos connaissances sur les batteries domestiques en 6 questions.
        </p>
      </header>
      <QuizConnaissancesClient />
    </div>
  );
}
