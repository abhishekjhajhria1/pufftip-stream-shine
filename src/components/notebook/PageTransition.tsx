import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

/** Crossfades + nudges children when the pathname changes — a soft "paper turn". */
export function PageTransition({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [shown, setShown] = useState(path);
  const [stage, setStage] = useState<"in" | "out">("in");

  useEffect(() => {
    if (path === shown) return;
    setStage("out");
    const t = setTimeout(() => {
      setShown(path);
      setStage("in");
    }, 180);
    return () => clearTimeout(t);
  }, [path, shown]);

  return (
    <div
      key={shown}
      className="page-turn"
      data-stage={stage}
    >
      {children}
    </div>
  );
}