import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

/* ============================================================
 * PUFFTIP — Neon Cockpit, Puff House identity
 * Every tip arrives with a complimentary "puff" — the house
 * compliment, like a cafe slipping a smoke in with the espresso.
 * ============================================================ */

const TIPS = [
  { user: "cryptowhale.sol", amount: "2.50 SOL", msg: "Huge play! Keep the smoke coming.", t: "JUST NOW", flagship: true },
  { user: "zerog_pete", amount: "0.50 SOL", msg: "The new overlay looks insane…", t: "2M AGO" },
  { user: "miso.eth", amount: "120 USDC", msg: "First time tipping crypto. Easy.", t: "8M AGO" },
  { user: "ghostroast", amount: "0.18 SOL", msg: "Pour me another one barista", t: "14M AGO" },
  { user: "lateshift", amount: "1.20 SOL", msg: "GG. Smoke break for the boys.", t: "22M AGO" },
];

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative size-9 rounded-xl bg-primary/15 ring-1 ring-primary/30 flex items-center justify-center overflow-hidden">
        <div className="size-2 rounded-full bg-ember animate-ember" />
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 size-2 rounded-full bg-smoke animate-puff" style={{ animationDelay: "0s" }} />
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-smoke animate-puff" style={{ animationDelay: "1.2s" }} />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-semibold tracking-tight text-foreground">pufftip<span className="text-primary">.</span>com</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">a tip / a smoke on the house</span>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="hidden md:flex items-center gap-8">
          {["Network", "Overlay", "House Menu", "Pricing", "Docs"].map((l) => (
            <a key={l} href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2">Login</button>
          <button className="bg-primary text-primary-foreground text-sm font-semibold py-2 px-4 rounded-md ring-1 ring-primary flex items-center gap-2 hover:brightness-110 transition-all shadow-[var(--shadow-neon)]">
            <span className="size-1.5 rounded-full bg-ember animate-ember" />
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative pt-24 pb-24 px-6 overflow-hidden">
      <div className="puff-glow absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[2px] bg-primary/10 animate-scanline pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 mb-8">
          <span className="flex size-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent">Live on Solana Mainnet · 4.2ms</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground tracking-tight leading-[1.05] text-balance max-w-4xl mb-6">
          Tips that arrive with a{" "}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "var(--gradient-neon)" }}>complimentary smoke</span>
            <span className="absolute -top-3 -right-3 size-2 rounded-full bg-ember animate-ember" />
          </span>
          .
        </h1>
        <p className="text-lg text-muted-foreground text-pretty max-w-[52ch] mb-10">
          Pufftip is the streamer-native crypto tip counter. Plug into OBS, accept Solana, and let every viewer message land on stream with a little ember of recognition. The house always sends a puff.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-foreground text-background text-sm font-semibold py-3 px-5 rounded-md flex items-center gap-2 hover:opacity-90 transition-all">
            Connect OBS Overlay <span className="font-mono text-[10px] text-muted-foreground">⌘O</span>
          </button>
          <button className="bg-secondary text-foreground text-sm font-semibold py-3 px-5 rounded-md ring-1 ring-border hover:ring-primary/50 transition-all">
            Pour me a sample tip →
          </button>
        </div>

        {/* Live ticker mockup — the espresso bar receipt printer */}
        <div className="mt-20 w-full max-w-3xl bg-card/60 border border-border rounded-3xl p-2 shadow-[var(--shadow-cockpit)]">
          <div className="bg-background rounded-[1.25rem] p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-destructive animate-pulse" />
                <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">Live tip counter · the bar</span>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">today: 47 tips · 23.4 SOL</span>
            </div>
            {TIPS.slice(0, 3).map((tip, i) => <TipRow key={i} {...tip} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function TipRow({ user, amount, msg, t, flagship }: typeof TIPS[number]) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-xl border ${flagship ? "bg-primary/5 border-primary/20" : "bg-card/40 border-border"}`}>
      <div className="relative size-9 rounded-lg bg-secondary flex items-center justify-center font-mono text-[11px] text-primary flex-shrink-0">
        {user.slice(0, 2).toUpperCase()}
        {flagship && <span className="absolute -top-1 -right-1 size-2 rounded-full bg-ember animate-ember" />}
      </div>
      <div className="text-left flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          <span className={flagship ? "text-primary" : ""}>{user}</span>
          <span className="text-muted-foreground"> tipped </span>
          <span className="font-mono">{amount}</span>
        </p>
        <p className="text-xs text-muted-foreground truncate italic">"{msg}"</p>
      </div>
      <div className="ml-auto text-[10px] text-muted-foreground font-mono flex-shrink-0">{t}</div>
    </div>
  );
}

function ChainStrip() {
  const items = ["SOLANA · primary", "USDC · accepted", "JUP · routed", "BONK · welcomed", "PHANTOM · auth", "BACKPACK · auth"];
  return (
    <div className="border-y border-border py-6 bg-card/30 overflow-hidden">
      <div className="flex animate-ticker whitespace-nowrap gap-12 px-6">
        {[...items, ...items].map((label, i) => (
          <span key={i} className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-3">
            <span className="size-1 rounded-full bg-primary" /> {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function HouseMenu() {
  /* Riff on the brand: each step framed like a coffee-shop chalkboard menu item */
  const items = [
    { code: "01_BREW", title: "Connect Phantom", body: "Sign in with your Solana wallet. No accounts, no waiters, no waiting.", tag: "house special" },
    { code: "02_PLATE", title: "Drop the OBS source", body: "Paste your private browser-source URL into OBS or Streamlabs. Your overlay is live in under 60 seconds.", tag: "served hot" },
    { code: "03_SMOKE", title: "Tips arrive lit", body: "Every tip lands as a puff on stream — animated smoke, viewer message, and a little ember the chat can see.", tag: "on the house" },
  ];
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">// the house menu</span>
            <h2 className="text-3xl md:text-4xl font-semibold mt-3 max-w-xl">Three steps. The fourth is the smoke we slip you for free.</h2>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">est. block 142,058,320</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <div key={i} className="relative p-8 bg-card/40 rounded-2xl border border-border hover:border-primary/40 transition-colors group">
              <div className="absolute top-6 right-6 font-mono text-[9px] uppercase tracking-widest px-2 py-1 rounded-full bg-ember/15 text-ember border border-ember/30">{it.tag}</div>
              <span className="font-mono text-[10px] text-primary mb-6 block">{it.code}</span>
              <h3 className="text-xl font-medium text-foreground mb-3">{it.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[35ch]">{it.body}</p>
              <div className="mt-8 pt-6 border-t border-border flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase">
                <span>step {String(i + 1).padStart(2, "0")} / 03</span>
                <span className="group-hover:text-primary transition-colors">→ open</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OverlayPreview() {
  return (
    <section className="py-24 px-6 bg-card/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">// overlay preview</span>
          <h2 className="text-3xl md:text-4xl font-semibold mt-3 mb-6">The puff that lands on screen.</h2>
          <p className="text-base text-muted-foreground mb-8 max-w-[44ch]">
            Customize the smoke trail, ember color, voice line, and message physics. Every alert is rendered at 60fps in a transparent OBS browser source — no plugins, no native binaries.
          </p>
          <ul className="space-y-3">
            {[
              "Custom alert duration, easing, and smoke density",
              "AI moderation — keep ugly messages off your stream",
              "Tier ladder: bigger tip → bigger puff → louder ember",
              "Text-to-speech with 12 voice presets",
            ].map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="size-5 rounded bg-primary/15 ring-1 ring-primary/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="size-1.5 rounded-full bg-primary" />
                </div>
                <span className="text-sm text-foreground">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-background shadow-[var(--shadow-cockpit)]">
            {/* faux stream feed */}
            <div className="absolute inset-0" style={{
              background: "radial-gradient(circle at 30% 30%, oklch(0.62 0.27 300 / 0.25), transparent 50%), radial-gradient(circle at 70% 70%, oklch(0.88 0.22 155 / 0.2), transparent 60%)"
            }} />
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: "linear-gradient(transparent 50%, oklch(0 0 0 / 0.4) 50%)",
              backgroundSize: "100% 4px"
            }} />

            <div className="absolute top-4 left-4 flex items-center gap-2 bg-background/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-border">
              <span className="size-2 rounded-full bg-destructive animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground">live · 1,284 viewers</span>
            </div>

            <div className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">/obs-source</div>

            {/* floating puff alert */}
            <div className="absolute bottom-8 left-8 right-8 max-w-md">
              <div className="relative">
                <div className="absolute -top-12 left-8 size-8 rounded-full bg-smoke animate-puff" />
                <div className="absolute -top-10 left-12 size-6 rounded-full bg-smoke animate-puff" style={{ animationDelay: "0.6s" }} />
                <div className="absolute -top-8 left-16 size-4 rounded-full bg-smoke animate-puff" style={{ animationDelay: "1.2s" }} />

                <div className="relative bg-background/85 backdrop-blur-xl rounded-2xl border border-primary/30 p-4 flex items-center gap-4 shadow-[var(--shadow-neon)]">
                  <div className="size-12 rounded-xl flex-shrink-0 flex items-center justify-center font-mono text-primary text-lg" style={{ background: "var(--gradient-neon)", color: "var(--background)" }}>
                    Φ
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ember mb-0.5">+ tip · puff served</p>
                    <p className="text-sm font-semibold text-foreground">cryptowhale.sol — 2.5 SOL</p>
                    <p className="text-xs text-muted-foreground italic mt-1">"Huge play! Keep the smoke coming."</p>
                  </div>
                  <span className="size-2 rounded-full bg-ember animate-ember flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Dashboard() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">// command center</span>
            <h2 className="text-3xl md:text-4xl font-semibold mt-3 max-w-xl">A cockpit that reads like a register tape.</h2>
          </div>
          <button className="font-mono text-[11px] uppercase tracking-widest text-primary hover:underline">open dashboard →</button>
        </div>

        <div className="bg-card/40 border border-border rounded-3xl p-2 shadow-[var(--shadow-cockpit)]">
          <div className="bg-background rounded-[1.5rem] overflow-hidden">
            {/* topbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-destructive" />
                <div className="size-2 rounded-full bg-ember" />
                <div className="size-2 rounded-full bg-primary" />
                <span className="ml-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">dashboard / live</span>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">connected · 4f8z…9pL2</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border">
              {[
                { label: "today's volume", val: "23.4", unit: "SOL", sub: "≈ $4,218 USD" },
                { label: "tips received", val: "47", unit: "tips", sub: "8 in the last hour" },
                { label: "puffs served", val: "47", unit: "smokes", sub: "100% on the house" },
              ].map((s, i) => (
                <div key={i} className="bg-background p-6">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">{s.label}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold text-foreground">{s.val}</span>
                    <span className="font-mono text-xs text-muted-foreground">{s.unit}</span>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">{s.sub}</div>
                </div>
              ))}
            </div>

            <div className="p-6 space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">recent activity</div>
              {TIPS.map((tip, i) => <TipRow key={i} {...tip} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HouseSpecial() {
  /* The brand quirk made literal: the cig-with-coffee compliment as a feature */
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="ember-glow absolute top-1/2 right-0 -translate-y-1/2 size-[400px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-ember">// house special</span>
            <h2 className="text-3xl md:text-5xl font-semibold mt-3 mb-6 leading-[1.1]">
              The puff is on the house.<br />
              <span className="text-muted-foreground">Every. Single. Tip.</span>
            </h2>
            <p className="text-base text-muted-foreground mb-8 max-w-[48ch]">
              Other platforms hand you a transaction. We hand you a moment — a wisp of smoke, a glowing ember, a viewer's voice rising for two and a half seconds. It's the smoke you didn't order but you light anyway. That's the pufftip identity.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1.5 rounded-full bg-secondary border border-border font-mono text-[11px] uppercase tracking-widest text-muted-foreground">no plugins</span>
              <span className="px-3 py-1.5 rounded-full bg-secondary border border-border font-mono text-[11px] uppercase tracking-widest text-muted-foreground">no custodian</span>
              <span className="px-3 py-1.5 rounded-full bg-ember/10 border border-ember/30 font-mono text-[11px] uppercase tracking-widest text-ember">smoke included</span>
            </div>
          </div>

          {/* big cig/ember illustration in pure CSS */}
          <div className="relative h-[420px] flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-[5/2] rounded-full bg-secondary border border-border overflow-visible">
              {/* the "cigarette" body */}
              <div className="absolute inset-y-0 left-0 w-2/3 bg-background border-r border-border rounded-l-full" />
              <div className="absolute inset-y-0 left-2/3 right-12 bg-card flex items-center justify-center">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground rotate-0">pufftip · the house</span>
              </div>
              {/* the lit ember */}
              <div className="absolute inset-y-0 right-0 w-12 rounded-r-full animate-ember" style={{ background: "var(--gradient-ember)" }} />
              {/* smoke puffs */}
              <div className="absolute -top-8 right-2 size-6 rounded-full bg-smoke animate-puff" />
              <div className="absolute -top-12 right-6 size-8 rounded-full bg-smoke animate-puff" style={{ animationDelay: "0.7s" }} />
              <div className="absolute -top-16 right-12 size-10 rounded-full bg-smoke animate-puff" style={{ animationDelay: "1.4s" }} />
              <div className="absolute -top-20 right-20 size-12 rounded-full bg-smoke animate-puff" style={{ animationDelay: "2.1s" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">// the tab</span>
        <h2 className="text-3xl md:text-4xl font-semibold mt-3 mb-10">Stream-first pricing. We only get paid when the bar rings.</h2>
        <div className="bg-card/40 rounded-3xl p-2 border border-border shadow-[var(--shadow-cockpit)]">
          <div className="bg-background rounded-[1.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left">
              <div className="text-6xl font-semibold text-foreground tracking-tight">1.2<span className="text-primary">%</span></div>
              <div className="text-sm text-muted-foreground mt-2">per tip · solana network only</div>
            </div>
            <div className="h-px w-full md:h-20 md:w-px bg-border" />
            <div className="text-left">
              <div className="text-xl font-medium text-foreground">No subs. No floor.</div>
              <p className="text-sm text-muted-foreground max-w-[24ch] mt-1">Smoke, alerts, dashboard, and OBS source — included.</p>
            </div>
            <button className="w-full md:w-auto bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-xl hover:scale-[1.02] transition-transform shadow-[var(--shadow-neon)]">
              Start streaming
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const qs = [
    { q: "Do my viewers need a wallet?", a: "Yes — Phantom, Backpack, Solflare, or any Solana wallet. We also accept USDC for the ones who think in dollars." },
    { q: "Where do tips actually go?", a: "Straight to your wallet. Pufftip is non-custodial. We never hold a single lamport." },
    { q: "Is the puff really free?", a: "Always. The smoke is the brand. The 1.2% covers the bar. The puff is on the house." },
    { q: "Will it break my OBS scene?", a: "It's a single transparent browser source — drop it in, resize once, forget it exists." },
  ];
  return (
    <section className="py-24 px-6 bg-card/20">
      <div className="max-w-3xl mx-auto">
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">// over the counter</span>
        <h2 className="text-3xl md:text-4xl font-semibold mt-3 mb-10">Questions we hear at the bar.</h2>
        <div className="divide-y divide-border border-y border-border">
          {qs.map((it, i) => (
            <details key={i} className="group py-5">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="font-medium text-foreground pr-6">{it.q}</span>
                <span className="font-mono text-xs text-muted-foreground group-open:text-primary transition-colors">[ + ]</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="puff-glow absolute inset-x-0 bottom-0 h-[400px] pointer-events-none" />
      <div className="max-w-4xl mx-auto text-center relative">
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-6">
          Light the ember.<br />
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: "var(--gradient-neon)" }}>Pour the first puff.</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-[40ch] mx-auto mb-10">
          Sixty seconds from connect-wallet to first tip on stream. No middleman behind the bar.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-xl shadow-[var(--shadow-neon)] hover:scale-[1.02] transition-transform">Connect wallet</button>
          <button className="bg-secondary text-foreground font-semibold py-3 px-6 rounded-xl ring-1 ring-border hover:ring-primary/50 transition-all">Read the docs</button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background/80">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2 space-y-5">
          <Logo />
          <p className="text-sm text-muted-foreground max-w-[34ch]">
            Built for the next generation of streamers on Solana. Fast, non-custodial, and weightless. The puff is on the house.
          </p>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">all systems · optimal</span>
          </div>
        </div>
        {[
          { h: "Protocol", l: ["Security", "Developers", "Fees", "Audit"] },
          { h: "Legal", l: ["Privacy", "Terms", "Taxes", "Acceptable use"] },
        ].map((col) => (
          <div key={col.h} className="flex flex-col gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{col.h}</span>
            {col.l.map((l) => (
              <a key={l} href="#" className="text-sm text-foreground hover:text-primary transition-colors">{l}</a>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>© 2026 pufftip · the house</span>
          <span>block 142,058,320 · ↑</span>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground relative">
      <Nav />
      <Hero />
      <ChainStrip />
      <HouseMenu />
      <OverlayPreview />
      <Dashboard />
      <HouseSpecial />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
