import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { PaperPage, Polaroid, WashiTape, StickyNote, Highlight, MarkerUnderline, SmokeCurl, Stamp } from "@/components/notebook/primitives";
import { TipModal } from "@/components/notebook/TipModal";
import { getStreamer, STREAMERS } from "@/lib/mockData";
import { useDemoWallet } from "@/lib/useDemoWallet";

export const Route = createFileRoute("/u/$handle")({
  head: ({ params }) => {
    const s = getStreamer(params.handle);
    const name = s?.name ?? params.handle;
    return {
      meta: [
        { title: `${name} — tip on pufftip` },
        { name: "description", content: s?.tagline ?? "Tip this streamer in SOL with a note. Drawn by hand on pufftip." },
        { property: "og:title", content: `${name} on pufftip` },
        { property: "og:description", content: s?.bio ?? "Send SOL with a note. Their page on pufftip." },
      ],
    };
  },
  loader: ({ params }) => {
    const s = getStreamer(params.handle);
    if (!s) throw notFound();
    return { streamer: s };
  },
  notFoundComponent: () => (
    <PaperPage className="py-20 text-center">
      <h1 className="font-hand text-6xl">streamer not found</h1>
      <p className="mt-3 font-label text-ink-soft">that handle isn't on pufftip yet.</p>
      <Link to="/explore" className="mt-6 inline-block rounded-md border-2 border-ink bg-marker-yellow px-4 py-2 font-hand text-xl">browse streamers</Link>
    </PaperPage>
  ),
  errorComponent: ({ error }) => (
    <PaperPage className="py-20 text-center">
      <h1 className="font-hand text-4xl">page didn't load</h1>
      <p className="mt-2 font-label text-ink-soft">{error.message}</p>
    </PaperPage>
  ),
  component: StreamerPage,
});

const EMOJIS: Record<string, string> = {
  smokeyjazz: "🎸", ghostroast: "👻", lateshift: "💻", misokitchen: "🍜", zerogpete: "🚀", polaroid_kid: "📷",
};

function StreamerPage() {
  const { streamer } = Route.useLoaderData();
  const tips = useDemoWallet((s) => s.tipsByStreamer[streamer.handle] ?? []);
  const [open, setOpen] = useState(false);

  // top fans = aggregate by sender
  const fanMap = new Map<string, number>();
  for (const t of tips) fanMap.set(t.from, (fanMap.get(t.from) ?? 0) + t.amount);
  const topFans = [...fanMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <PaperPage className="pb-12 pt-8">
      {/* Header */}
      <div className="relative">
        <WashiTape color="pink" rotate={-8} className="left-1/4 -top-2" style={{ width: "10rem" }} />
        <WashiTape color="teal" rotate={5} className="right-12 -top-2" style={{ width: "7rem" }} />
        <div className="paper-card relative rounded-2xl p-6 sm:p-8">
          {streamer.live && <Stamp color="red" rotate={-10} className="absolute -right-3 -top-4">on air</Stamp>}
          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            <Polaroid hue={streamer.avatarHue} emoji={EMOJIS[streamer.handle] ?? "🎤"} label={streamer.name} caption={`@${streamer.handle}`} size={180} rotate={-3} />
            <div className="flex-1">
              <div className="font-label text-sm text-ink-soft">streamer · {streamer.game}</div>
              <h1 className="mt-1 font-hand text-6xl text-ink sm:text-7xl">
                <Highlight>{streamer.name}</Highlight>
              </h1>
              <p className="mt-3 max-w-xl font-label text-lg text-ink">{streamer.bio}</p>
              <div className="mt-4 flex flex-wrap gap-4 font-label text-sm text-ink-soft">
                <span><strong className="font-mono text-ink">{streamer.totalReceived.toFixed(1)}</strong> SOL received</span>
                <span><strong className="font-mono text-ink">{streamer.followers}</strong> fans</span>
                <span><strong className="font-mono text-ink">{tips.length}</strong> tips on the wall</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={() => setOpen(true)} className="rotate-doodle-1 rounded-md border-2 border-ink bg-marker-red px-5 py-2.5 font-hand text-2xl text-paper shadow-sticker">
                  send a puff ✈️
                </button>
                <Link to="/u/$handle/wishlist" params={{ handle: streamer.handle }} className="rotate-doodle-2 rounded-md border-2 border-ink bg-marker-yellow px-5 py-2.5 font-hand text-2xl text-ink shadow-sticker">
                  see wishlist →
                </Link>
              </div>
            </div>
            <SmokeCurl className="absolute right-6 top-6 hidden h-20 w-12 md:block" />
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[2fr_1fr]">
        {/* Tip Wall */}
        <div>
          <div className="flex items-end justify-between">
            <h2 className="font-hand text-4xl text-ink"><MarkerUnderline>the tip wall</MarkerUnderline></h2>
            <span className="font-label text-sm text-ink-soft">pinned by viewers, in real time</span>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {tips.length === 0 && (
              <StickyNote color="yellow" rotate={-2}>
                <div className="font-hand text-2xl text-ink">no tips yet</div>
                <p className="mt-1 font-label text-base text-ink">be the first to leave a note.</p>
              </StickyNote>
            )}
            {tips.map((t, i) => (
              <StickyNote
                key={t.id}
                color={t.color ?? "yellow"}
                rotate={(i % 2 === 0 ? -1 : 1) * (1 + (i % 3))}
                className="break-words"
              >
                <div className="flex items-baseline justify-between font-label text-xs text-ink-soft">
                  <span>@{t.from}</span>
                  <span className="font-mono text-sm text-ink">{t.amount.toFixed(2)} SOL</span>
                </div>
                <div className="mt-1.5 font-hand text-2xl leading-tight text-ink">{t.message}</div>
                <div className="mt-2 font-label text-[11px] text-ink-soft">{t.ago}</div>
              </StickyNote>
            ))}
          </div>
        </div>

        {/* Sidebar — top fans + quick tip */}
        <div className="space-y-8">
          <div className="paper-card rounded-xl p-5">
            <h3 className="font-hand text-3xl text-ink">top fans 🏆</h3>
            {topFans.length === 0 ? (
              <p className="mt-2 font-label text-sm text-ink-soft">no fans yet — be the first.</p>
            ) : (
              <ol className="mt-3 space-y-2">
                {topFans.map(([name, amt], i) => (
                  <li key={name} className="flex items-center gap-3 border-b border-dashed border-ink/15 pb-2 last:border-0 last:pb-0">
                    <span className={`grid size-8 place-items-center rounded-full border-2 border-ink font-hand text-lg ${i === 0 ? "bg-marker-yellow" : i === 1 ? "bg-paper-deep" : i === 2 ? "bg-ember/40" : "bg-paper"}`}>{i + 1}</span>
                    <span className="flex-1 font-hand text-xl text-ink">@{name}</span>
                    <span className="font-mono text-sm text-ink">{amt.toFixed(2)}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="paper-card rounded-xl p-5">
            <h3 className="font-hand text-3xl text-ink">quick tip</h3>
            <p className="mt-1 font-label text-sm text-ink-soft">pre-set amounts. no fuss.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[0.1, 0.5, 1, 2.5].map((a) => (
                <button key={a} onClick={() => setOpen(true)} className="rounded-md border-2 border-ink bg-paper py-3 font-hand text-2xl text-ink hover:bg-marker-yellow">
                  {a} SOL
                </button>
              ))}
            </div>
          </div>

          {/* other streamers */}
          <div>
            <h3 className="font-hand text-2xl text-ink">also on pufftip</h3>
            <div className="mt-3 space-y-2">
              {STREAMERS.filter((s) => s.handle !== streamer.handle).slice(0, 3).map((s) => (
                <Link key={s.handle} to="/u/$handle" params={{ handle: s.handle }} className="flex items-center gap-3 rounded-md border-2 border-dashed border-ink/30 bg-card p-2 hover:border-marker-red">
                  <Polaroid hue={s.avatarHue} emoji={EMOJIS[s.handle] ?? "🎤"} size={44} rotate={-2} tape={false} />
                  <div>
                    <div className="font-hand text-lg text-ink">{s.name}</div>
                    <div className="font-label text-xs text-ink-soft">@{s.handle}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TipModal streamer={streamer} open={open} onClose={() => setOpen(false)} />
    </PaperPage>
  );
}
