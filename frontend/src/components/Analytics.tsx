"use client";

import { useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Loads Google Analytics 4 only when (a) a measurement ID is configured and
 * (b) the visitor has consented to audience-measurement cookies. Inert otherwise.
 */
export default function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;

    function load() {
      if (document.getElementById("ga4-src")) return;
      const s = document.createElement("script");
      s.id = "ga4-src";
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(s);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      // eslint-disable-next-line prefer-rest-params
      w.gtag = function () { w.dataLayer.push(arguments); };
      w.gtag("js", new Date());
      w.gtag("config", GA_ID, { anonymize_ip: true });
    }

    let consent: string | null = null;
    try { consent = localStorage.getItem("ba-consent"); } catch { /* */ }
    if (consent === "all") load();

    function onChange(e: Event) {
      if ((e as CustomEvent).detail === "all") load();
    }
    window.addEventListener("ba-consent-change", onChange);
    return () => window.removeEventListener("ba-consent-change", onChange);
  }, []);

  return null;
}
