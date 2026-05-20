import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { STREAMERS } from "@/lib/mockData";
import { StickyNote } from "./primitives";

type Item =
  | { kind: "page"; label: string; to: string; hint: string }
  | { kind: "streamer"; label: string; handle: string; hint: string };

const PAGES: Item[] = [
  { kind: "page", label: "home", to: "/", hint: "the landing notebook" },
  { kind: "page", label: "explore the corkboard", to: "/explore", hint: "all streamers" },
  { kind: "page", label: "streamer dashboard", to: "/dashboard", hint: "what creators see" },
  { kind: "page", label: "obs setup zine", to: "/obs", hint: "wire up your overlay" },
  { kind: "page", label: "fees & pricing", to: "/pricing", hint: "1.5%. that's it." },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((v) => !v); }
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault(); setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => { if (open) { setTimeout(() => inputRef.current?.focus(), 30); setQ(""); setActive(0); } }, [open]);

  const items: Item[] = useMemo(() => {
    const streamerItems: Item[] = STREAMERS.map((s) => ({
      kind: "streamer" as const, label: `${s.name}`, handle: s.handle, hint: `@${s.handle} · ${s.tagline}`,
    }));
    const all = [...PAGES, ...streamerItems];
    if (!q.trim()) return all;
    const ql = q.toLowerCase();
    return all.filter((i) => i.label.toLowerCase().includes(ql) || i.hint.toLowerCase().includes(ql));
  }, [q]);

  useEffect(() => { setActive(0); }, [q]);

  if (!open) return null;

  const go = (item: Item) => {
    setOpen(false);
    if (item.kind === "page") navigate({ to: item.to });
    else navigate({ to: "/u/$handle", params: { handle: item.handle } });
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-start bg-ink/40 p-4 pt-[12vh]" onClick={() => setOpen(false)}>
      <div className="mx-auto w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <StickyNote color="yellow" rotate={-1.2} className="!p-3">
          <div className="flex items-center gap-2 border-b-2 border-dashed border-ink/30 pb-2">
            <span className="font-hand text-2xl text-ink">/</span>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(items.length - 1, a + 1)); }
                if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
                if (e.key === "Enter") { e.preventDefault(); items[active] && go(items[active]); }
              }}
              placeholder="jump to a page or a streamer…"
              className="w-full bg-transparent font-hand text-2xl text-ink outline-none placeholder:text-ink-soft"
            />
            <span className="hidden rounded border-2 border-ink/40 px-1.5 py-0.5 font-mono text-[10px] text-ink-soft sm:inline">esc</span>
          </div>
          <div className="mt-2 max-h-[50vh] space-y-1 overflow-y-auto">
            {items.length === 0 && (
              <div className="px-2 py-6 text-center font-label text-sm text-ink-soft">nothing matches. try a name.</div>
            )}
            {items.map((it, i) => (
              <button
                key={`${it.kind}-${it.label}-${i}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(it)}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left transition ${i === active ? "bg-ink/10" : ""}`}
              >
                <div>
                  <div className="font-hand text-lg text-ink">{it.label}</div>
                  <div className="font-label text-xs text-ink-soft">{it.hint}</div>
                </div>
                <span className="font-label text-[10px] uppercase tracking-wider text-ink-soft">
                  {it.kind === "page" ? "page" : "streamer"}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-2 flex justify-between border-t-2 border-dashed border-ink/30 pt-2 font-label text-[11px] text-ink-soft">
            <span>↑↓ to move · ↵ to jump</span>
            <span>⌘K to open</span>
          </div>
        </StickyNote>
      </div>
    </div>
  );
}