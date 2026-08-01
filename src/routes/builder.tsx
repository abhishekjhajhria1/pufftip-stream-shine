import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PaperPage, WashiTape, Highlight, Polaroid, Stamp, Sketch, MarkerUnderline, StickyNote } from "@/components/notebook/primitives";
import { StreamerCustomizer } from "@/components/notebook/StreamerCustomizer";
import { BlockRenderer } from "@/components/notebook/Blocks";
import { useConfig, PAPER_TONES, HEADING_FONTS } from "@/lib/useStreamerConfig";

export const Route = createFileRoute("/builder")({
  head: () => ({
    meta: [
      { title: "page builder — claim your pufftip page" },
      { name: "description", content: "Sketch your own tip page before you sign up: pick a handle, a paper, a font, and stack blocks. Live preview, no wallet needed." },
      { property: "og:title", content: "build your pufftip page" },
      { property: "og:description", content: "Pick a handle, tweak the paper, stack blocks — see your creator page come alive instantly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuilderPage,
});

const slug = (v: string) => v.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20);

function BuilderPage() {
  const [handleInput, setHandleInput] = useState("yourname");
  const handle = slug(handleInput) || "yourname";
  const draftKey = `draft_${handle}`;
  const cfg = useConfig(draftKey);

  const paper = PAPER_TONES[cfg.paperTone ?? "cream"].oklch;
  const font = HEADING_FONTS[cfg.headingFont ?? "caveat"].family;
  const accent = `oklch(0.62 0.22 ${cfg.accentHue ?? 25})`;
  const previewStyle = useMemo(
    () => ({ "--paper": paper, "--marker-red": accent, "--font-hand": font }) as React.CSSProperties,
    [paper, accent, font],
  );

  return (
    <PaperPage className="pt-10 pb-16">
      <div className="relative">
        <WashiTape color="teal" rotate={-7} className="left-6 -top-2" style={{ width: "8rem" }} />
        <Stamp color="green" rotate={6} className="absolute right-2 top-0">free to try</Stamp>
        <div className="font-label text-sm text-ink-soft">no wallet · no signup · nothing saved but your browser</div>
        <h1 className="mt-1 font-hand text-6xl text-ink sm:text-7xl">
          <Highlight>draw your own page</Highlight>
        </h1>
        <p className="mt-2 max-w-2xl font-label text-base text-ink-soft">
          scribble a handle, choose your paper, stack the blocks your fans should see. everything updates live on the right — this is exactly what your real pufftip page looks like.
        </p>
      </div>

      <Sketch rotate={-0.4} className="mt-8 bg-card">
        <label className="font-label text-sm uppercase tracking-wider text-ink-soft">your handle</label>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm text-ink-soft">pufftip.com/u/</span>
          <input
            value={handleInput}
            onChange={(e) => setHandleInput(e.target.value)}
            className="min-w-40 flex-1 rounded-md border-2 border-ink bg-paper px-3 py-1.5 font-hand text-2xl text-ink outline-none focus:bg-marker-yellow/30"
            placeholder="yourname"
          />
          <span className="rotate-doodle-1 rounded-full border-2 border-dashed border-ink/40 px-3 py-1 font-label text-xs uppercase text-ink-soft">
            {handle.length >= 3 ? "available ✓" : "3+ characters"}
          </span>
        </div>
      </Sketch>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <StreamerCustomizer handle={draftKey} />

        <div>
          <div className="mb-2 font-label text-sm uppercase tracking-wider text-ink-soft">live preview</div>
          <div
            style={previewStyle}
            className="rounded-2xl border-2 border-ink bg-paper p-5 shadow-sticker"
          >
            <div className="flex items-start gap-4">
              <Polaroid caption={`@${handle}`} hue={cfg.avatarHue ?? 25} rotate={-3} size={130} emoji={cfg.avatarEmoji ?? "🎧"} />
              <div className="min-w-0">
                <h2 style={{ fontFamily: font }} className="text-4xl text-ink">{cfg.name ?? handle}</h2>
                <p className="font-label text-base text-ink-soft">{cfg.tagline ?? "your one-line pitch goes here"}</p>
                <p className="mt-2 font-label text-sm text-ink">{cfg.bio ?? "tell fans who you are, what you stream, and why a tip matters."}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(cfg.quickAmounts ?? [0.1, 0.5, 1]).map((a) => (
                <span key={a} className="rounded-md border-2 border-ink bg-marker-yellow px-3 py-1 font-hand text-lg text-ink">
                  {a} SOL
                </span>
              ))}
            </div>

            {cfg.goalLabel ? (
              <div className="mt-4 rounded-lg border-2 border-dashed border-ink/40 p-3">
                <div className="font-hand text-2xl text-ink">{cfg.goalLabel}</div>
                <div className="font-label text-sm text-ink-soft">goal · {cfg.goalAmount ?? 0} SOL</div>
              </div>
            ) : null}

            <div className="mt-5 grid gap-5">
              {(cfg.blocks ?? []).length === 0 ? (
                <StickyNote color="teal" rotate={-2}>
                  <div className="font-hand text-2xl">no blocks yet</div>
                  <p className="font-label text-sm">add a schedule, links, a poll or a guestbook from the editor — they show up right here.</p>
                </StickyNote>
              ) : (
                (cfg.blocks ?? []).map((b) => <BlockRenderer key={b.id} block={b} />)
              )}
            </div>
          </div>
        </div>
      </div>

      <Sketch rotate={0.5} className="mt-10 bg-card text-center">
        <h3 className="font-hand text-4xl text-ink"><MarkerUnderline>happy with it?</MarkerUnderline></h3>
        <p className="mt-2 font-label text-base text-ink-soft">real pages connect a Solana wallet + your OBS overlay. peek at how tips arrive first.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link to="/dashboard" className="rounded-md border-2 border-ink bg-marker-yellow px-4 py-2 font-hand text-xl text-ink shadow-sticker">see the dashboard →</Link>
          <Link to="/obs" className="rounded-md border-2 border-dashed border-ink/40 px-4 py-2 font-label text-sm text-ink-soft">obs setup</Link>
          <Link to="/pricing" className="rounded-md border-2 border-dashed border-ink/40 px-4 py-2 font-label text-sm text-ink-soft">fees</Link>
        </div>
      </Sketch>
    </PaperPage>
  );
}
