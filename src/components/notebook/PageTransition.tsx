import { useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";

/** Soft paper-turn on route change. Pure CSS — re-keys on path so the
 *  fade-in animation replays without orchestrating exit state. */
export function PageTransition({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div key={path} className="page-turn-in">
      {children}
    </div>
  );
}