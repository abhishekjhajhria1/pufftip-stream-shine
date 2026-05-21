import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { getStreamer } from "@/lib/mockData";
import { useDemoWallet } from "@/lib/useDemoWallet";
import { StickyNote, SmokeCurl } from "@/components/notebook/primitives";

export const Route = createFileRoute("/overlay/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `overlay · @${params.handle} — pufftip` },
      { name: "description", content: "OBS browser-source overlay. Drop this URL into a Browser source in OBS." },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: ({ params }) => {
    const s = getStreamer(params.handle);
    if (!s) throw notFound();
    return { handle: params.handle, name: s.name };
  },
  component: OverlayPage,
});

type Alert = { id: string; from: string; amount: number; message: string };

function OverlayPage() {
  const { handle, name } = Route.useLoaderData()!;
  const tips = useDemoWallet((s) => s.tipsByStreamer[handle] ?? []);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const seen = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  useEffect(() => {
    // First mount: prime seen ids so we don't replay the seed history.
    if (!initialized.current) {
      tips.forEach((t) => seen.current.add(t.id));
      initialized.current = true;
      return;
    }
    const fresh = tips.filter((t) => !seen.current.has(t.id));
    if (!fresh.length) return;
    fresh.forEach((t) => seen.current.add(t.id));
    setAlerts((a) => [
      ...a,
      ...fresh.map((t) => ({ id: t.id, from: t.from, amount: t.amount, message: t.message })),
    ]);
    // auto-dismiss after 8s
    fresh.forEach((t) => {
      setTimeout(() => setAlerts((a) => a.filter((x) => x.id !== t.id)), 8000);
    });
  }, [tips]);

  const fireTest = () => {
    const id = `test_${Date.now()}`;
    seen.current.add(id);
    setAlerts((a) => [...a, { id, from: "you", amount: 0.42, message: "test alert from the overlay 💌" }]);
    setTimeout(() => setAlerts((a) => a.filter((x) => x.id !== id)), 8000);
  };

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: "transparent" }}>
      {/* Tiny status pill so streamers know it's wired */}
      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full border-2 border-ink bg-paper/85 px-3 py-1 font-label text-xs text-ink shadow-sticker backdrop-blur">
        <span className="size-2 animate-ember rounded-full bg-marker-green" />
        overlay · @{handle} ({name})
        <button onClick={fireTest} className="ml-2 rounded border border-ink/40 px-1.5 font-hand text-sm hover:bg-marker-yellow">test</button>
      </div>

      {/* Alert stack — top-right of OBS canvas */}
      <div className="absolute right-6 top-6 flex w-[min(420px,90vw)] flex-col items-end gap-3">
        {alerts.map((a, i) => (
          <div key={a.id} className="relative w-full animate-pop" style={{ ["--r" as string]: `${i % 2 === 0 ? -2 : 2}deg` }}>
            <SmokeCurl className="absolute -left-10 -top-6 h-16 w-10" />
            <StickyNote color={(["yellow","pink","teal","green"] as const)[i % 4]} rotate={i % 2 === 0 ? -2 : 2}>
              <div className="flex items-baseline justify-between font-label text-xs text-ink-soft">
                <span>@{a.from}</span>
                <span className="font-mono text-sm text-ink">{a.amount.toFixed(2)} SOL</span>
              </div>
              <div className="mt-1 font-hand text-3xl leading-tight text-ink">{a.message}</div>
            </StickyNote>
          </div>
        ))}
      </div>
    </div>
  );
}
