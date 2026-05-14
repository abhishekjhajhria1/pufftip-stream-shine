import { useEffect, useState } from "react";

export type Theme = "notebook" | "studio";
const COOKIE = "pufftip_theme";
const ONE_YEAR = 60 * 60 * 24 * 365;

function readCookie(): Theme | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(?:^|; )" + COOKIE + "=([^;]+)"));
  const v = m?.[1];
  return v === "notebook" || v === "studio" ? v : null;
}

function writeCookie(t: Theme) {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE}=${t}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

function apply(t: Theme) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", t);
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("notebook");

  useEffect(() => {
    const saved = readCookie() ?? "notebook";
    setThemeState(saved);
    apply(saved);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    writeCookie(t);
    apply(t);
  };

  const toggle = () => setTheme(theme === "notebook" ? "studio" : "notebook");

  return { theme, setTheme, toggle };
}
