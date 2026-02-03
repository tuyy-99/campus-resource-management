"use client";

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount to avoid server/client mismatch
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") {
        setTheme(stored as "dark" | "light");
        return;
      }
    } catch (e) {}
    // Fallback to OS preference if available
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  // Apply theme class when it changes
  useEffect(() => {
    if (!theme) return;
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
  }, [theme]);

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
    >
      {/* Render icon only after hydration to avoid mismatch with server HTML */}
      {mounted ? (theme === "dark" ? "🌙" : "☀️") : null}
    </button>
  );
}
