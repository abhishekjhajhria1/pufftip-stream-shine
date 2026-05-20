import { useEffect, useState } from "react";
import { useRouterState, useNavigate } from "@tanstack/react-router";

const HINTS_BY_ROUTE: Record<string, string[]> = {
  "/": [
    "psst — hit Cmd+K to jump anywhere.",
    "every tip you send shows up on the streamer's overlay in real time.",
    "you've got 5 demo SOL. spend it like a kid at an arcade.",
  ],
  "/explore": [
    "click any polaroid to see that streamer's page.",
    "the live badge means they're streaming right now.",
    "top earners is updated every… ok it's mock data. but soon.",
  ],
  "/dashboard": [
    "this is what a streamer sees when they log in.",
    "scroll down — you can fully customize the public page.",
    "switch streamers at the bottom to test other vibes.",
  ],
  "/obs": [
    "single browser source URL. no plugins. no node_modules. clean.",
    "the overlay is just a webpage. you can style it later if you really want.",
  ],
  "/pricing": [
    "1.5% flat. nothing weird. no hidden 'platform fee'.",
    "subscriptions, payouts, and 1099s are coming — we're cooking.",
  ],
};

const FALLBACK = [
  "draw outside the lines.",
  "made by night-owls, for night-owls.",
  "if something looks off, that's by design. probably.",
];

export function PuffyMascot() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const nav = useNavigate();
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);
  const [hintIdx, setHintIdx] = useState(0);

  // load persisted dismissal
  useEffect(() => {
    if (typeof document !== "undefined" && document.cookie.includes("pufftip_mascot=off")) {
      setDismissed(true);
    }
  }, []);

  // pick hints for current route
  const route = Object.keys(HINTS_BY_ROUTE).find((r) => (r === "/" ? path === "/" : path.startsWith(r))) ?? "/";
  const hints = HINTS_BY_ROUTE[route] ?? FALLBACK;
  const hint = hints[hintIdx % hints.length];

  useEffect(() => { setHintIdx(0); setOpen(false); }, [route]);
  useEffect(() => {
    if (dismissed) return;
    const t = setInterval(() => setHintIdx((i) => i + 1), 9000);
    return () => clearInterval(t);
  }, [dismissed]);

  // auto-peek a hint shortly after route change
  useEffect(() => {
    if (dismissed) return;
    const t = setTimeout(() => setOpen(true), 800);
    const t2 = setTimeout(() => setOpen(false), 6500);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [route, hintIdx, dismissed]);

  if (dismissed) {
    return (
      <button
        aria-label="bring puffy back"
        onClick={() => { document.cookie = "pufftip_mascot=on; path=/; max-age=31536000"; setDismissed(false); }}
        className="fixed bottom-4 right-4 z-40 rounded-full border-2 border-dashed border-ink/40 bg-card px-2.5 py-1 font-label text-xs text-ink-soft hover:border-ember"
      >
        bring puffy back
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-end gap-2 sm:right-6 sm:bottom-6">
      {open && (
        <div
          className="animate-pop max-w-[230px] rounded-xl border-2 border-ink bg-card px-3 py-2 font-label text-sm text-ink shadow-sticker"
          style={{ ["--r" as string]: "-1.5deg" } as React.CSSProperties}
        >
          <div className="leading-snug">{hint}</div>
          <div className="mt-1 flex justify-between gap-2 text-[11px] uppercase tracking-wider text-ink-soft">
            <button onClick={() => setHintIdx((i) => i + 1)} className="hover:text-ember">another →</button>
            <button onClick={() => { nav({ to: "/explore" }); }} className="hover:text-ember">explore</button>
          </div>
        </div>
      )}
      <button
        aria-label="puffy the mascot"
        onClick={() => setOpen((v) => !v)}
        onDoubleClick={() => { document.cookie = "pufftip_mascot=off; path=/; max-age=31536000"; setDismissed(true); }}
        title="single-click: tips · double-click: dismiss"
        className="group relative grid size-14 place-items-center rounded-full border-2 border-ink bg-paper text-2xl shadow-sticker transition hover:rotate-3"
      >
        <span className="absolute -top-3 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-ember animate-ember" />
        <span className="absolute -top-5 right-1 select-none text-base opacity-70 group-hover:opacity-100">💨</span>
        <span aria-hidden>👻</span>
      </button>
    </div>
  );
}