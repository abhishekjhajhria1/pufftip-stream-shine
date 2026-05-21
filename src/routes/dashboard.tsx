import { createFileRoute, Link } from "@tanstack/react-router";
import { PaperPage, WashiTape, Highlight, Polaroid, Stamp, StickyNote, MarkerUnderline, Sketch } from "@/components/notebook/primitives";
import { STREAMERS, SEED_TIPS } from "@/lib/mockData";
import { StreamerCustomizer } from "@/components/notebook/StreamerCustomizer";
import { useStreamerConfig } from "@/lib/useStreamerConfig";
import { OverlayTools } from "@/components/notebook/OverlayTools";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "dashboard preview — pufftip" },
      { name: "description", content: "Peek at the streamer cockpit. Tip log, weekly chart, OBS overlay editor — all hand-drawn." },
      { property: "og:title", content: "dashboard preview — pufftip" },
      { property: "og:description", content: "What streamers see when they log in. No auth needed to look around." },
    ],
  }),
  component: Dashboard,
});

const DAYS = ["mon","tue","wed","thu","fri","sat","sun"];
const BARS = [3.2, 5.8, 4.1, 7.6, 12.4, 9.1, 6.3];
const MAX_BAR = Math.max(...BARS);

function Dashboard() {
  const ownerHandle = useStreamerConfig((s) => s.ownerHandle);
  const me = STREAMERS.find((s) => s.handle === ownerHandle) ?? STREAMERS[0];
  const tips = SEED_TIPS[me.handle] ?? [];
  const weekTotal = BARS.reduce((a, b) => a + b, 0);

  return (
    <PaperPage className="pt-10 pb-12">
      <div className="relative">
        <WashiTape color="yellow" rotate={-9} className="left-8 -top-2" style={{ width: "7rem" }} />
        <Stamp color="blue" rotate={5} className="absolute right-2 top-0">peek</Stamp>
        <div className="font-label text-sm text-ink-soft">streamer cockpit · viewing as @{me.handle}</div>
        <h1 className="mt-1 font-hand text-6xl text-ink sm:text-7xl">
          <Highlight>your week, in pen</Highlight>
        </h1>
        <p className="mt-2 max-w-xl font-label text-base text-ink-soft">
          this is what your dashboard looks like — wired straight to your wallet, your overlay, your fans. no auth needed to look around.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "this week", v: `${weekTotal.toFixed(1)} SOL`, sub: "+18% vs last", c: "yellow" },
          { l: "all-time", v: `${me.totalReceived.toFixed(0)} SOL`, sub: "since you joined", c: "pink" },
          { l: "tips today", v: "12", sub: "avg. 0.42 SOL", c: "teal" },
          { l: "top tip", v: "5.0 SOL", sub: "from @spookz", c: "green" },
        ].map((s, i) => (
          <StickyNote key={s.l} color={s.c as "yellow"} rotate={i % 2 === 0 ? -1.5 : 1.5}>
            <div className="font-label text-xs uppercase text-ink-soft">{s.l}</div>
            <div className="mt-1 font-hand text-4xl text-ink">{s.v}</div>
            <div className="mt-0.5 font-label text-xs text-ink-soft">{s.sub}</div>
          </StickyNote>
        ))}
      </div>

      {/* Chart + recent tips */}
      <div className="mt-12 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <Sketch rotate={-0.6} className="bg-card">
          <div className="flex items-baseline justify-between">
            <h3 className="font-hand text-3xl text-ink"><MarkerUnderline>tips this week</MarkerUnderline></h3>
            <span className="font-label text-sm text-ink-soft">drawn by hand, in marker</span>
          </div>
          <div className="mt-6 flex h-64 items-stretch justify-between gap-3 border-b-2 border-l-2 border-ink/40 pl-3 pb-2">
            {BARS.map((b, i) => (
              <div key={i} className="relative flex flex-1 flex-col items-center justify-end">
                <span className="font-mono text-xs text-ink-soft">{b}</span>
                <div
                  className="mt-1 w-full rounded-t-md border-2 border-ink"
                  style={{
                    height: `${(b / MAX_BAR) * 90}%`,
                    background: i === 4
                      ? "repeating-linear-gradient(45deg, var(--marker-red) 0 8px, oklch(0.55 0.22 25) 8px 16px)"
                      : "repeating-linear-gradient(45deg, var(--marker-yellow) 0 8px, oklch(0.85 0.16 95) 8px 16px)",
                  }}
                />
                <div className="mt-1 font-label text-xs text-ink">{DAYS[i]}</div>
              </div>
            ))}
          </div>
          <p className="mt-4 font-label text-sm text-ink-soft">friday was a banger. also you streamed for 6h that day, so. yeah.</p>
        </Sketch>

        <div className="paper-card rounded-xl p-5">
          <h3 className="font-hand text-3xl text-ink">recent tips</h3>
          <div className="mt-3 max-h-[300px] space-y-2 overflow-y-auto pr-1">
            {tips.map((t) => (
              <div key={t.id} className="border-b border-dashed border-ink/15 pb-2 last:border-0">
                <div className="flex justify-between font-label text-xs text-ink-soft">
                  <span>@{t.from}</span>
                  <span>{t.ago}</span>
                </div>
                <div className="font-hand text-lg text-ink">{t.message}</div>
                <div className="font-mono text-sm text-marker-green">+{t.amount.toFixed(2)} SOL</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay editor mock */}
      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="paper-card rounded-xl p-5">
          <h3 className="font-hand text-3xl text-ink"><MarkerUnderline>overlay editor</MarkerUnderline></h3>
          <p className="mt-1 font-label text-sm text-ink-soft">tweak how tips show up on stream.</p>
          <div className="mt-4 space-y-3">
            {[
              { l: "style", v: "sticky note ✓" },
              { l: "duration", v: "8 seconds" },
              { l: "sound", v: "match strike 🚬" },
              { l: "min. amount", v: "0.05 SOL" },
              { l: "TTS", v: "off (good for vibes)" },
            ].map((o, i) => (
              <div key={o.l} className="flex items-center justify-between border-b-2 border-dashed border-ink/15 pb-2">
                <span className="font-label text-sm text-ink-soft">{o.l}</span>
                <span className="font-hand text-xl text-ink rotate-doodle-1">{o.v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 font-mono text-xs text-ink-soft">
            <div>browser source url:</div>
            <div className="mt-1 truncate rounded border-2 border-dashed border-ink/30 bg-paper p-2 text-ink">https://pufftip.com/overlay/@smokeyjazz?key=•••</div>
          </div>
        </div>

        <div className="relative">
          <WashiTape color="pink" rotate={-12} className="-top-3 left-1/3" style={{ width: "5rem" }} />
          <div className="paper-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-hand text-3xl text-ink">live preview</h3>
              <Stamp color="red" rotate={-4} className="text-base">on stream</Stamp>
            </div>
            <div className="mt-4 grid h-72 place-items-end overflow-hidden rounded-lg border-2 border-ink bg-gradient-to-br from-ink to-paper-deep p-4">
              <StickyNote color="yellow" rotate={-3} className="max-w-[260px]">
                <div className="font-label text-xs text-ink-soft">@cryptowhale · 2.5 SOL</div>
                <div className="mt-1 font-hand text-2xl text-ink">huge play! smoke break for u 🚬</div>
              </StickyNote>
            </div>
            <p className="mt-2 text-center font-label text-xs text-ink-soft">↑ that's how tips appear on stream</p>
          </div>
        </div>
      </div>

      {/* Page customizer */}
      <div id="customize" className="mt-12">
        <StreamerCustomizer handle={me.handle} />
      </div>

      {/* Overlay & embed tools */}
      <div id="overlay" className="mt-12">
        <OverlayTools handle={me.handle} />
      </div>

      {/* Switch streamer */}
      <div className="mt-12">
        <div className="font-label text-sm text-ink-soft">try the dashboard as a different streamer:</div>
        <div className="mt-3 flex flex-wrap gap-3">
          {STREAMERS.map((s, i) => (
            <Link key={s.handle} to="/u/$handle" params={{ handle: s.handle }} className="flex items-center gap-2 rounded-full border-2 border-dashed border-ink/40 bg-card px-3 py-1.5 hover:border-marker-red" style={{ transform: `rotate(${(i % 3 - 1) * 1.2}deg)` }}>
              <Polaroid hue={s.avatarHue} emoji={["🎸","👻","💻","🍜","🚀","📷"][i % 6]} size={28} rotate={0} tape={false} />
              <span className="font-hand text-lg text-ink">{s.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </PaperPage>
  );
}
