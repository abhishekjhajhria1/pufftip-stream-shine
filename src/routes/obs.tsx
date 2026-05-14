import { createFileRoute, Link } from "@tanstack/react-router";
import { PaperPage, WashiTape, Highlight, MarkerUnderline, DoodleArrow, StickyNote, Sketch, Stamp } from "@/components/notebook/primitives";

export const Route = createFileRoute("/obs")({
  head: () => ({
    meta: [
      { title: "obs setup — pufftip" },
      { name: "description", content: "Wire up pufftip to OBS in 4 steps. A hand-drawn zine guide for streamers." },
      { property: "og:title", content: "obs setup — pufftip" },
      { property: "og:description", content: "Paste one URL, get tip alerts on stream. Sticky-note overlays, customizable." },
    ],
  }),
  component: ObsPage,
});

function ObsPage() {
  return (
    <PaperPage className="pt-10 pb-12">
      <div className="relative">
        <WashiTape color="teal" rotate={-9} className="left-12 -top-2" style={{ width: "8rem" }} />
        <Stamp color="blue" rotate={6} className="absolute right-2 top-0">zine #1</Stamp>
        <div className="font-label text-sm text-ink-soft">a hand-drawn guide</div>
        <h1 className="font-hand text-6xl text-ink sm:text-7xl">
          <Highlight>wire up OBS</Highlight>
        </h1>
        <p className="mt-3 max-w-xl font-label text-lg text-ink">
          four steps. takes about three minutes. no plugins, no installs — just one browser source URL.
        </p>
      </div>

      <div className="mt-12 space-y-12">
        {[
          {
            n: 1,
            title: "claim your handle",
            body: "pick a @handle (yours forever). pufftip generates a unique URL for your tip overlay.",
            visual: (
              <div className="paper-card rounded-lg p-3 font-mono text-sm">
                <div className="text-ink-soft"># your overlay url</div>
                <div className="text-ink">https://pufftip.com/overlay/<span className="text-marker-red">@yourhandle</span>?key=•••</div>
              </div>
            ),
          },
          {
            n: 2,
            title: "open OBS · add browser source",
            body: "in OBS, hit + on Sources → Browser. paste the URL. set width 800, height 600. transparent by default.",
            visual: (
              <Sketch rotate={-1.5} className="bg-paper">
                <div className="font-label text-sm text-ink">+ Browser Source</div>
                <div className="mt-2 space-y-1 font-mono text-xs">
                  <div>URL: <span className="text-marker-red">[paste]</span></div>
                  <div>Width: 800</div>
                  <div>Height: 600</div>
                  <div>✓ Refresh on becoming active</div>
                </div>
              </Sketch>
            ),
          },
          {
            n: 3,
            title: "test it",
            body: "from your dashboard, hit 'send a fake tip'. it should appear on stream in under a second.",
            visual: (
              <StickyNote color="yellow" rotate={-2}>
                <div className="font-label text-xs text-ink-soft">@cryptowhale · 2.5 SOL</div>
                <div className="font-hand text-xl text-ink">huge play! smoke break for u 🚬</div>
              </StickyNote>
            ),
          },
          {
            n: 4,
            title: "go live, get tipped",
            body: "share your /u/handle URL anywhere — bio, panels, chat. tips land in the wallet you connected.",
            visual: (
              <div className="paper-card rounded-lg p-4 text-center">
                <div className="font-hand text-2xl text-ink">pufftip.com/u/<span className="text-marker-red">yourhandle</span></div>
                <div className="mt-1 font-label text-xs text-ink-soft">share this. that's the page.</div>
              </div>
            ),
          },
        ].map((step, i) => (
          <div key={step.n} className="relative grid gap-6 md:grid-cols-[80px_1fr_1fr] md:items-start">
            <div className="md:pt-2">
              <div className="grid size-16 place-items-center rounded-full border-2 border-ink bg-marker-yellow font-hand text-4xl rotate-doodle-1">{step.n}</div>
            </div>
            <div>
              <h3 className="font-hand text-3xl text-ink"><MarkerUnderline>{step.title}</MarkerUnderline></h3>
              <p className="mt-2 font-label text-base text-ink">{step.body}</p>
              {i === 0 && (
                <p className="mt-2 font-label text-sm text-marker-red">→ keep this URL secret-ish. anyone with it can spoof tips on YOUR overlay.</p>
              )}
            </div>
            <div className="relative">
              {step.visual}
              {i === 1 && <DoodleArrow direction="down-right" className="absolute -left-8 -top-8 hidden h-16 w-16 md:block" />}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ scribbles */}
      <div className="mt-20">
        <h2 className="font-hand text-5xl text-ink">scribbles in the margin</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            { q: "do viewers need a wallet?", a: "yes — phantom or backpack. takes 30 seconds. they can also tip with apple pay (we onramp behind the scenes)." },
            { q: "what's the fee?", a: "1.5%. that's it. see /pricing for the receipt." },
            { q: "what about USDC?", a: "yep, USDC and USDT on solana too. we auto-swap if your viewer sends a different token." },
            { q: "can i customize the overlay?", a: "absolutely — fonts, colors, animations, sounds. dashboard has a live editor." },
          ].map((f, i) => (
            <StickyNote key={f.q} color={(["yellow","pink","teal","green"] as const)[i % 4]} rotate={i % 2 === 0 ? -1.5 : 1.5}>
              <div className="font-hand text-2xl text-ink">{f.q}</div>
              <p className="mt-1 font-label text-sm text-ink">{f.a}</p>
            </StickyNote>
          ))}
        </div>
      </div>

      <div className="mt-16 rounded-2xl border-2 border-dashed border-ink/40 bg-card p-8 text-center">
        <h3 className="font-hand text-4xl text-ink">stuck?</h3>
        <p className="mt-2 font-label text-base text-ink">we hang out in discord. drop in, we'll walk you through it.</p>
        <Link to="/explore" className="mt-4 inline-block rounded-md border-2 border-ink bg-marker-yellow px-4 py-2 font-hand text-xl text-ink shadow-sticker">browse streamers instead</Link>
      </div>
    </PaperPage>
  );
}
