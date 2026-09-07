"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ThemeMode } from "./types";

const STORAGE_KEY = "buzq-theme";

function resolve(mode: ThemeMode) {
  if (mode === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
}

function apply(mode: ThemeMode) {
  const resolved = resolve(mode);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.dataset.theme = resolved;
}

interface ThemeContextType {
  mode: ThemeMode;
  resolved: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const initial = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    setModeState(initial);
    const r = resolve(initial);
    setResolved(r);
    apply(initial);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (mode === "system") {
        const r = resolve("system");
        setResolved(r);
        apply("system");
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    localStorage.setItem(STORAGE_KEY, next);
    const r = resolve(next);
    setResolved(r);
    apply(next);
  }, []);

  const toggle = useCallback(() => {
    setMode(resolved === "dark" ? "light" : "dark");
  }, [resolved, setMode]);

  const value = useMemo(() => ({ mode, resolved, setMode, toggle }), [mode, resolved, setMode, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
