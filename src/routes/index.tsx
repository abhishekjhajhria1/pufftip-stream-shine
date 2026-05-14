import { createFileRoute, Link } from "@tanstack/react-router";
import { PaperPage, Polaroid, WashiTape, StickyNote, DoodleArrow, MarkerUnderline, Highlight, SmokeCurl, Sketch, Stamp, StarDoodle } from "@/components/notebook/primitives";
import { Ticker } from "@/components/notebook/Ticker";
import { STREAMERS } from "@/lib/mockData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "pufftip — crypto tips for streamers, on the house" },
      { name: "description", content: "Solana tips with a smoke on the house. Streamers get their own page, viewers send tips with a note. Drawn by hand, runs on chain." },
      { property: "og:title", content: "pufftip — tips with a smoke on the house" },
      { property: "og:description", content: "Solana tipping for streamers. Their page, their tip wall, their wishlist. No signups to browse." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Ticker />
      <PaperPage className="relative pt-16 pb-12">
        {/* Top decorations */}
        <WashiTape color="pink" rotate={-12} className="left-8 top-2" style={{ width: "8rem" }} />
        <WashiTape color="teal" rotate={6} className="right-12 top-4" style={{ width: "6rem" }} />

        {/* HERO */}
        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-3 inline-block font-label text-sm text-marker-red">
              <span className="rotate-doodle-1 inline-block">★ a streamer tipping notebook</span>
            </div>
            <h1 className="font-hand text-6xl leading-[0.95] text-ink sm:text-7xl lg:text-8xl">
              tips with a <Highlight>smoke</Highlight>
              <br />
              on the <span className="marker-underline">house.</span>
              <SmokeCurl className="ml-2 inline-block h-16 w-10 align-top" />
            </h1>
            <p className="mt-6 max-w-md font-label text-lg text-ink">
              pufftip is a <strong>solana</strong> tipping page for streamers — every viewer's tip arrives in OBS with a note, an animation, and a little compliment from the house. drawn by hand, runs on chain.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/explore" className="rotate-doodle-1 rounded-md border-2 border-ink bg-marker-red px-5 py-2.5 font-hand text-2xl text-paper shadow-sticker">
                find a streamer →
              </Link>
              <Link to="/u/$handle" params={{ handle: "smokeyjazz" }} className="rotate-doodle-2 rounded-md border-2 border-ink bg-marker-yellow px-5 py-2.5 font-hand text-2xl text-ink shadow-sticker">
                see a sample page
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-3 font-label text-sm text-ink-soft">
              <span className="size-2 animate-ember rounded-full bg-marker-green" />
              <span>3,412 tips sent today · ~$48k volume · 0 sign-ups required</span>
            </div>
          </div>

          {/* Hero card mock — streamer page preview */}
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rotate-1 rounded-2xl bg-paper-deep shadow-paper" />
            <div className="paper-card rotate-doodle-2 rounded-xl p-5">
              <WashiTape color="yellow" rotate={-4} className="-top-3 left-1/3" style={{ width: "5rem" }} />
              <div className="flex items-start gap-3">
                <Polaroid hue={25} emoji="🎸" size={86} rotate={-4} tape={false} />
                <div className="pt-2">
                  <div className="font-hand text-3xl text-ink">smokey jazz</div>
                  <div className="font-label text-sm text-ink-soft">@smokeyjazz · live now</div>
                  <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-marker-red/10 px-2 py-0.5 font-label text-xs text-marker-red">
                    <span className="size-1.5 animate-ember rounded-full bg-marker-red" /> ON AIR
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center font-label text-xs">
                <div className="rounded-md border-2 border-dashed border-ink/30 p-2"><div className="font-hand text-2xl">412</div>SOL received</div>
                <div className="rounded-md border-2 border-dashed border-ink/30 p-2"><div className="font-hand text-2xl">12.4k</div>fans</div>
                <div className="rounded-md border-2 border-dashed border-ink/30 p-2"><div className="font-hand text-2xl">238</div>tips this week</div>
              </div>
              <div className="mt-3 space-y-2">
                {[
                  { c: "yellow", from: "cryptowhale", a: "2.5", m: "this set goes hard. smoke break for u" },
                  { c: "pink", from: "miso", a: "0.5", m: "play the rain one again pls" },
                ].map((t, i) => (
                  <StickyNote key={i} color={t.c as "yellow" | "pink"} rotate={i % 2 === 0 ? -1 : 1.2} className="text-base">
                    <div className="font-label text-xs text-ink-soft">@{t.from} · {t.a} SOL</div>
                    <div className="font-hand text-xl text-ink">{t.m}</div>
                  </StickyNote>
                ))}
              </div>
              <Link to="/u/$handle" params={{ handle: "smokeyjazz" }} className="mt-3 block rounded-md border-2 border-ink bg-ink py-2 text-center font-hand text-xl text-paper">
                send a puff →
              </Link>
            </div>
            <Stamp color="red" className="absolute -right-4 -top-4 z-10">live demo</Stamp>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="mt-24">
          <h2 className="font-hand text-5xl text-ink">
            <Highlight>how it works</Highlight>
            <span className="ml-3 font-label text-base text-ink-soft">(it's three steps, in pen)</span>
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-3">
            {[
              { n: 1, title: "make your page", body: "claim your @handle. drop a polaroid, write your bio in marker. takes 90 seconds.", emoji: "📓" },
              { n: 2, title: "wire up OBS", body: "paste a single browser source URL. tips show up on stream as sticky notes.", emoji: "🖥️" },
              { n: 3, title: "get tipped", body: "viewers send SOL with a note. money lands in your wallet, smoke lands on stream.", emoji: "✈️" },
            ].map((step, i) => (
              <div key={step.n} className="relative">
                <Sketch rotate={i === 1 ? 1.5 : i === 0 ? -1.5 : 0.8} className="bg-card">
                  <div className="flex items-baseline gap-3">
                    <span className="grid size-10 place-items-center rounded-full border-2 border-ink bg-marker-yellow font-hand text-2xl">{step.n}</span>
                    <div className="font-hand text-3xl text-ink">{step.title}</div>
                    <div className="ml-auto text-3xl">{step.emoji}</div>
                  </div>
                  <p className="mt-3 font-label text-base text-ink">{step.body}</p>
                </Sketch>
                {i < 2 && <DoodleArrow direction="right" className="absolute -right-6 top-1/2 hidden h-12 w-12 -translate-y-1/2 md:block" />}
              </div>
            ))}
          </div>
        </div>

        {/* FEATURED STREAMERS */}
        <div className="mt-24">
          <div className="flex items-end justify-between">
            <h2 className="font-hand text-5xl text-ink">people on pufftip <StarDoodle className="ml-1 inline size-8 text-marker-yellow" /></h2>
            <Link to="/explore" className="font-label text-sm text-marker-red marker-underline">see all →</Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STREAMERS.slice(0, 6).map((s, i) => (
              <Link key={s.handle} to="/u/$handle" params={{ handle: s.handle }} className="group block">
                <div className="paper-card rounded-xl p-4 transition-transform group-hover:-rotate-1">
                  <div className="flex gap-3">
                    <Polaroid hue={s.avatarHue} emoji={["🎸","👻","💻","🍜","🚀","📷"][i % 6]} size={70} rotate={-3} tape={false} />
                    <div>
                      <div className="font-hand text-2xl text-ink">{s.name}</div>
                      <div className="font-label text-xs text-ink-soft">@{s.handle}</div>
                      {s.live && <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-marker-red/10 px-2 py-0.5 font-label text-[10px] text-marker-red">● LIVE</span>}
                    </div>
                  </div>
                  <p className="mt-3 font-label text-sm text-ink">{s.tagline}</p>
                  <div className="mt-3 flex justify-between font-label text-xs text-ink-soft">
                    <span>{s.followers} fans</span>
                    <span className="font-mono">{s.totalReceived.toFixed(0)} SOL received</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="relative mt-24 overflow-hidden rounded-2xl border-2 border-dashed border-ink/40 bg-card p-10 text-center">
          <WashiTape color="pink" rotate={-8} className="left-1/4 top-2" style={{ width: "8rem" }} />
          <WashiTape color="teal" rotate={6} className="right-1/4 top-2" style={{ width: "6rem" }} />
          <h2 className="font-hand text-5xl text-ink">your page is waiting.</h2>
          <p className="mx-auto mt-3 max-w-md font-label text-base text-ink">
            grab a handle. paste an OBS URL. start collecting tips by tonight. seriously, that's it.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/explore" className="rounded-md border-2 border-ink bg-ink px-5 py-2.5 font-hand text-2xl text-paper shadow-sticker">
              browse streamers
            </Link>
            <Link to="/obs" className="rounded-md border-2 border-ink bg-marker-yellow px-5 py-2.5 font-hand text-2xl text-ink shadow-sticker">
              read the obs guide
            </Link>
          </div>
        </div>
      </PaperPage>
    </>
  );
}
