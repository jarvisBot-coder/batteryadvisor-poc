import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CompareProvider } from "@/lib/compare";
import CompareBar from "@/components/CompareBar";
import CookieConsent from "@/components/CookieConsent";
import Analytics from "@/components/Analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BatteryAdvisor.be — Comparatif batteries domestiques Belgique",
    template: "%s | BatteryAdvisor.be",
  },
  description:
    "Comparatifs indépendants et conseils pour choisir votre batterie domestique en Belgique. Scores, tests et avis détaillés.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Google Fonts – Fraunces (display) + Plus Jakarta Sans (body) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Inline script to prevent FOUC on dark mode */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <CompareProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CompareBar />
          <CookieConsent />
        </CompareProvider>
        <Analytics />
      </body>
    </html>
  );
}
