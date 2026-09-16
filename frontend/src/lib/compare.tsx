"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface CompareItem {
  slug: string;
  name: string;
  brand?: string;
}

interface CompareCtx {
  items: CompareItem[];
  has: (slug: string) => boolean;
  toggle: (item: CompareItem) => void;
  remove: (slug: string) => void;
  clear: () => void;
  max: number;
}

const KEY = "ba-compare";
const MAX = 4;
const Ctx = createContext<CompareCtx | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const has = useCallback((slug: string) => items.some((i) => i.slug === slug), [items]);
  const toggle = useCallback((item: CompareItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.slug === item.slug)) return prev.filter((i) => i.slug !== item.slug);
      if (prev.length >= MAX) return prev;
      return [...prev, item];
    });
  }, []);
  const remove = useCallback((slug: string) => setItems((prev) => prev.filter((i) => i.slug !== slug)), []);
  const clear = useCallback(() => setItems([]), []);

  return <Ctx.Provider value={{ items, has, toggle, remove, clear, max: MAX }}>{children}</Ctx.Provider>;
}

export function useCompare() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCompare must be used within CompareProvider");
  return c;
}
