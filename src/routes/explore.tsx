import { createFileRoute, Link } from "@tanstack/react-router";
import { PaperPage, Polaroid, WashiTape, Highlight, Stamp, MarkerUnderline } from "@/components/notebook/primitives";
import { Ticker } from "@/components/notebook/Ticker";
import { STREAMERS } from "@/lib/mockData";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "explore streamers — pufftip" },
      { name: "description", content: "Browse streamers on pufftip. Sticky-note leaderboards, live tip ticker, and a corkboard of polaroids." },
      { property: "og:title", content: "explore streamers on pufftip" },
      { property: "og:description", content: "A corkboard of streamers accepting Solana tips. Find someone, send a puff." },
    ],
  }),
  component: Explore,
});

const EMOJIS = ["🎸","👻","💻","🍜","🚀","📷"];
const ROT = [-2, 1.5, -1, 2, -2.4, 1];

function Explore() {
  const sorted = [...STREAMERS].sort((a, b) => b.totalReceived - a.totalReceived);
  return (
    <>
      <Ticker />
      <PaperPage>
        <div className="relative pb-8 pt-10">
          <WashiTape color="yellow" rotate={-6} className="left-10 top-2" style={{ width: "9rem" }} />
          <h1 className="font-hand text-6xl text-ink sm:text-7xl">
            <Highlight>the corkboard</Highlight>
          </h1>
          <p className="mt-3 max-w-xl font-label text-lg text-ink">
            every streamer on pufftip, pinned up like polaroids. click one, send a puff, leave a note.
          </p>
        </div>

        {/* Filter chips */}
        <div className="mb-8 flex flex-wrap gap-2">
          {[
            { l: "all", active: true },
            { l: "● live now" },
            { l: "music" },
            { l: "irl" },
            { l: "gaming" },
            { l: "code" },
            { l: "art" },
          ].map((c, i) => (
            <button key={c.l} className={`rounded-full border-2 border-ink px-3 py-1 font-label text-sm ${c.active ? "bg-ink text-paper" : "bg-paper text-ink"} ${i % 2 ? "rotate-doodle-1" : "rotate-doodle-2"}`}>
              {c.l}
            </button>
          ))}
        </div>

        {/* Corkboard */}
        <div className="relative rounded-2xl border-2 border-dashed border-ink/30 bg-paper-deep p-6 sm:p-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {STREAMERS.map((s, i) => (
              <Link key={s.handle} to="/u/$handle" params={{ handle: s.handle }} className="group relative block">
                <WashiTape color={(["pink","teal","yellow"] as const)[i % 3]} rotate={ROT[i] * -3} className="-top-3 left-1/2 -translate-x-1/2" style={{ width: "4.5rem" }} />
                <div className="paper-card rounded-xl p-4 transition-all group-hover:-translate-y-1 group-hover:rotate-0" style={{ transform: `rotate(${ROT[i]}deg)` }}>
                  {s.live && <Stamp color="red" rotate={12} className="absolute -right-4 -top-3 text-base">live</Stamp>}
                  <div className="flex justify-center pb-2">
                    <Polaroid hue={s.avatarHue} emoji={EMOJIS[i % 6]} label={s.name} caption={`@${s.handle}`} size={150} rotate={0} tape={false} />
                  </div>
                  <p className="mt-2 text-center font-label text-sm text-ink">{s.tagline}</p>
                  <div className="mt-3 flex justify-between border-t-2 border-dashed border-ink/20 pt-2 font-label text-xs text-ink-soft">
                    <span>{s.followers} fans</span>
                    <span className="font-mono">{s.totalReceived.toFixed(0)} SOL</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="mt-16">
          <h2 className="font-hand text-5xl text-ink">
            <MarkerUnderline>top earners</MarkerUnderline>
            <span className="ml-3 font-label text-base text-ink-soft">(this week, give or take)</span>
          </h2>
          <div className="mt-6 paper-card rounded-xl p-6">
            <ol className="space-y-3">
              {sorted.map((s, i) => (
                <li key={s.handle} className="flex items-center gap-4 border-b-2 border-dashed border-ink/15 pb-3 last:border-0 last:pb-0">
                  <span className="grid size-10 place-items-center rounded-full border-2 border-ink bg-marker-yellow font-hand text-2xl rotate-doodle-2">{i + 1}</span>
                  <Polaroid hue={s.avatarHue} emoji={EMOJIS[i % 6]} size={56} rotate={-3} tape={false} />
                  <div className="flex-1">
                    <Link to="/u/$handle" params={{ handle: s.handle }} className="font-hand text-2xl text-ink hover:text-marker-red">{s.name}</Link>
                    <div className="font-label text-xs text-ink-soft">@{s.handle} · {s.game}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-lg text-ink">{s.totalReceived.toFixed(1)} SOL</div>
                    <div className="font-label text-xs text-ink-soft">{s.followers} fans</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </PaperPage>
    </>
  );
}
