import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { PaperPage, Polaroid, Highlight, Stamp, MarkerUnderline, TornPaper, WashiTape } from "@/components/notebook/primitives";
import { TipModal } from "@/components/notebook/TipModal";
import { getStreamer, WISHLISTS, type WishlistItem } from "@/lib/mockData";
import { useDemoWallet } from "@/lib/useDemoWallet";

export const Route = createFileRoute("/u/$handle_/wishlist")({
  head: ({ params }) => {
    const s = getStreamer(params.handle);
    return {
      meta: [
        { title: `${s?.name ?? params.handle}'s wishlist — pufftip` },
        { name: "description", content: `Help ${s?.name ?? "this streamer"} fund the things they actually need. Mics, rent, kebabs.` },
        { property: "og:title", content: `${s?.name ?? params.handle}'s wishlist` },
        { property: "og:description", content: "Chip in toward gear, rent, or a smoke break. Hand-drawn wishlist on pufftip." },
      ],
    };
  },
  loader: ({ params }) => {
    const s = getStreamer(params.handle);
    if (!s) throw notFound();
    return { streamer: s, wishlist: WISHLISTS[params.handle] ?? [] };
  },
  notFoundComponent: () => (
    <PaperPage className="py-20 text-center">
      <h1 className="font-hand text-6xl">no wishlist here</h1>
      <Link to="/explore" className="mt-6 inline-block rounded-md border-2 border-ink bg-marker-yellow px-4 py-2 font-hand text-xl">browse streamers</Link>
    </PaperPage>
  ),
  errorComponent: ({ error }) => (
    <PaperPage className="py-20 text-center"><p className="font-label">{error.message}</p></PaperPage>
  ),
  component: WishlistPage,
});

const EMOJIS: Record<string, string> = {
  smokeyjazz: "🎸", ghostroast: "👻", lateshift: "💻", misokitchen: "🍜", zerogpete: "🚀", polaroid_kid: "📷",
};

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="relative h-5 w-full rounded-full border-2 border-ink bg-paper">
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.min(100, pct)}%`,
          background: "repeating-linear-gradient(45deg, var(--marker-green) 0 8px, oklch(0.6 0.16 145) 8px 16px)",
        }}
      />
      <span className="absolute inset-0 grid place-items-center font-label text-xs text-ink mix-blend-multiply">{pct.toFixed(0)}%</span>
    </div>
  );
}

function WishlistPage() {
  const data = Route.useLoaderData()!;
  const streamer = data.streamer;
  const wishlist: WishlistItem[] = data.wishlist;
  const [openTip, setOpenTip] = useState(false);
  const [activeItem, setActiveItem] = useState<WishlistItem | null>(null);
  const { sentCount } = useDemoWallet();

  const totalGoal = wishlist.reduce((a: number, w: WishlistItem) => a + w.goal, 0);
  const totalRaised = wishlist.reduce((a: number, w: WishlistItem) => a + w.raised, 0);

  return (
    <PaperPage className="pb-12 pt-8">
      <Link to="/u/$handle" params={{ handle: streamer.handle }} className="font-label text-sm text-ink-soft hover:text-marker-red">← back to @{streamer.handle}</Link>

      <div className="mt-4 flex items-end gap-5">
        <Polaroid hue={streamer.avatarHue} emoji={EMOJIS[streamer.handle] ?? "🎤"} size={120} rotate={-3} />
        <div>
          <div className="font-label text-sm text-ink-soft">@{streamer.handle}'s</div>
          <h1 className="font-hand text-6xl text-ink sm:text-7xl">
            <Highlight>wishlist</Highlight>
          </h1>
          <p className="mt-1 font-label text-base text-ink">things they actually need. chip in any amount.</p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="paper-card rounded-xl p-4 rotate-doodle-1">
          <div className="font-label text-xs uppercase text-ink-soft">total raised</div>
          <div className="font-hand text-4xl text-ink">{totalRaised.toFixed(2)} <span className="font-mono text-base">SOL</span></div>
        </div>
        <div className="paper-card rounded-xl p-4 rotate-doodle-2">
          <div className="font-label text-xs uppercase text-ink-soft">total goal</div>
          <div className="font-hand text-4xl text-ink">{totalGoal.toFixed(2)} <span className="font-mono text-base">SOL</span></div>
        </div>
        <div className="paper-card rounded-xl p-4 rotate-doodle-3">
          <div className="font-label text-xs uppercase text-ink-soft">items left</div>
          <div className="font-hand text-4xl text-ink">{wishlist.filter((w: WishlistItem) => w.raised < w.goal).length} <span className="font-mono text-base">/ {wishlist.length}</span></div>
        </div>
      </div>

      {/* Wishlist grid */}
      <div className="mt-12">
        <h2 className="font-hand text-4xl text-ink"><MarkerUnderline>the list</MarkerUnderline></h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          {wishlist.map((item: WishlistItem, i: number) => {
            const pct = (item.raised / item.goal) * 100;
            const done = pct >= 100;
            return (
              <div key={item.id} className="relative">
                <WashiTape color={(["pink","teal","yellow"] as const)[i % 3]} rotate={-6} className="-top-2 left-8" style={{ width: "5rem" }} />
                <TornPaper rotate={i % 2 === 0 ? -1 : 1.5} className="bg-card">
                  {done && <Stamp color="green" rotate={-15} className="absolute -right-2 -top-2 text-base">funded!</Stamp>}
                  <div className="flex items-start gap-4">
                    <div className="grid size-16 shrink-0 place-items-center rounded-xl border-2 border-dashed border-ink/40 bg-paper text-4xl">{item.emoji}</div>
                    <div className="flex-1">
                      <div className="font-hand text-3xl text-ink">{item.title}</div>
                      <p className="font-label text-sm text-ink-soft">{item.why}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between font-label text-sm text-ink">
                      <span><span className="font-mono">{item.raised.toFixed(2)}</span> raised</span>
                      <span className="text-ink-soft">goal: <span className="font-mono">{item.goal.toFixed(2)}</span> SOL</span>
                    </div>
                    <div className="mt-1.5"><ProgressBar pct={pct} /></div>
                  </div>
                  <button
                    onClick={() => { setActiveItem(item); setOpenTip(true); }}
                    disabled={done}
                    className="mt-4 w-full rounded-md border-2 border-ink bg-marker-red px-3 py-2 font-hand text-2xl text-paper shadow-sticker disabled:bg-paper-deep disabled:text-ink-soft"
                  >
                    {done ? "fully funded ✓" : `chip in →`}
                  </button>
                </TornPaper>
              </div>
            );
          })}
        </div>
      </div>

      {sentCount > 0 && (
        <p className="mt-10 text-center font-hand text-2xl text-marker-green">you've sent {sentCount} demo tip{sentCount === 1 ? "" : "s"} so far. nice.</p>
      )}

      {activeItem && (
        <TipModal
          streamer={streamer}
          open={openTip}
          onClose={() => setOpenTip(false)}
          context={`chipping in toward "${activeItem.title}" ${activeItem.emoji}`}
        />
      )}
    </PaperPage>
  );
}
