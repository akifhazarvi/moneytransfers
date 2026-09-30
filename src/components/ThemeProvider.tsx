"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({ theme: "light", toggleTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

// The layout's <meta name="theme-color"> pair follows the OS colour scheme.
// A manual toggle overrides that, so point both at the chosen surface colour:
// it tints the browser bar and, once installed, the app's title/status bar.
function syncThemeColor(theme: Theme) {
  const color = theme === "dark" ? "#0B0C0E" : "#FFFFFF";
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", color));
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
    if (stored) syncThemeColor(initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    syncThemeColor(next);
  };

  // Always render the Provider. This used to return a bare fragment until
  // mount, but swapping Fragment -> Provider at the same position makes React
  // unmount and rebuild the whole site tree after hydration: every page's
  // <header>, <main> and <footer> were thrown away and repainted, which moved
  // LCP behind all the JS (/send-money: H1 painted at FCP, then again at ~5.5s
  // simulated) and ran every effect twice. The flash of wrong theme is already
  // prevented before paint by THEME_INLINE in the layout.
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
