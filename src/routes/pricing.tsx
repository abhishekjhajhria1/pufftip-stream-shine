import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PaperPage, WashiTape, Highlight, Stamp, StickyNote, MarkerUnderline } from "@/components/notebook/primitives";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "pricing — pufftip" },
      { name: "description", content: "1.5% flat fee, no subscription, no hidden BS. The receipt is taped to the page." },
      { property: "og:title", content: "pricing — pufftip" },
      { property: "og:description", content: "1.5% flat. that's the whole thing." },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [acceptedAt, setAcceptedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const at = localStorage.getItem("pufftip_tnc_accepted_at");
      if (at) { setAcceptedAt(at); setAgreed(true); }
    } catch {}
  }, []);

  function openCheckout() {
    if (acceptedAt) {
      navigate({ to: "/explore" });
    } else {
      setModal(true);
    }
  }

  function confirm() {
    if (!agreed) return;
    const now = new Date().toISOString();
    try { localStorage.setItem("pufftip_tnc_accepted_at", now); } catch {}
    setAcceptedAt(now);
    setModal(false);
    navigate({ to: "/explore" });
  }

  return (
    <PaperPage className="pt-10 pb-12">
      <div className="relative">
        <WashiTape color="pink" rotate={-7} className="left-1/3 -top-2" style={{ width: "8rem" }} />
        <h1 className="font-hand text-6xl text-ink sm:text-7xl">
          <Highlight>fees, on a receipt</Highlight>
        </h1>
        <p className="mt-3 max-w-xl font-label text-lg text-ink">
          we hate hidden fees too. here's the whole thing on a piece of paper. taped to the page so it doesn't blow away.
        </p>
      </div>

      {/* Receipt */}
      <div className="mt-12 grid items-start gap-10 md:grid-cols-[1fr_1fr]">
        <div className="relative">
          <WashiTape color="yellow" rotate={-15} className="left-1/2 -top-3 -translate-x-1/2" style={{ width: "5rem" }} />
          <div className="mx-auto w-full max-w-sm rotate-doodle-1 bg-card p-6 shadow-paper" style={{ clipPath: "polygon(0 0, 100% 0, 100% 96%, 95% 100%, 88% 96%, 80% 100%, 72% 96%, 64% 100%, 56% 96%, 48% 100%, 40% 96%, 32% 100%, 24% 96%, 16% 100%, 8% 96%, 0 100%)" }}>
            <div className="text-center font-hand text-3xl text-ink">PUFFTIP RECEIPT</div>
            <div className="mt-1 text-center font-label text-xs text-ink-soft">no. 0001 · forever</div>
            <div className="my-4 border-t-2 border-dashed border-ink/40" />
            <ul className="space-y-2 font-mono text-sm">
              <li className="flex justify-between"><span>tip processed</span><span>10.00 SOL</span></li>
              <li className="flex justify-between text-ink-soft"><span>pufftip fee (1.5%)</span><span>−0.15 SOL</span></li>
              <li className="flex justify-between text-ink-soft"><span>solana network</span><span>−0.000005 SOL</span></li>
              <li className="my-2 border-t border-dashed border-ink/30" />
              <li className="flex justify-between font-hand text-2xl text-ink"><span>YOU GET</span><span>9.85 SOL</span></li>
            </ul>
            <div className="my-4 border-t-2 border-dashed border-ink/40" />
            <div className="text-center font-label text-xs text-ink-soft">no subs · no setup fee · no PMs</div>
            <div className="mt-2 text-center"><Stamp color="green" rotate={-3} className="text-lg">paid in full</Stamp></div>
          </div>
        </div>

        <div>
          <h2 className="font-hand text-5xl text-ink"><MarkerUnderline>just 1.5%</MarkerUnderline></h2>
          <p className="mt-3 font-label text-base text-ink">
            flat. for everyone. always. we don't take more from new streamers, we don't take less from huge ones. it's the same to us.
          </p>

          <div className="mt-6 space-y-3">
            {[
              { t: "no subscription", b: "you don't pay us a monthly. you only pay us when you earn." },
              { t: "no setup fees", b: "make a page, add OBS source, done. zero friction, zero charge." },
              { t: "no minimum payout", b: "your tips land in your wallet directly. no escrow, no waiting." },
              { t: "no surprise charges", b: "what's on the receipt is what's on the receipt." },
            ].map((p, i) => (
              <div key={p.t} className="paper-card rounded-xl p-4" style={{ transform: `rotate(${i % 2 === 0 ? -0.6 : 0.6}deg)` }}>
                <div className="font-hand text-2xl text-ink">✓ {p.t}</div>
                <p className="mt-1 font-label text-sm text-ink-soft">{p.b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="mt-20">
        <h2 className="font-hand text-5xl text-ink">vs other tip platforms</h2>
        <div className="mt-6 paper-card rounded-xl overflow-hidden">
          <table className="w-full font-label text-sm">
            <thead className="bg-paper-deep">
              <tr>
                <th className="p-3 text-left font-hand text-2xl text-ink">platform</th>
                <th className="p-3 text-right font-hand text-2xl text-ink">cut</th>
                <th className="p-3 text-right font-hand text-2xl text-ink">payout</th>
                <th className="p-3 text-right font-hand text-2xl text-ink">crypto?</th>
              </tr>
            </thead>
            <tbody>
              {[
                { p: "pufftip", c: "1.5%", t: "instant, on-chain", x: "yes (SOL/USDC)" , us: true },
                { p: "the big one", c: "5% + $0.30", t: "weekly", x: "no" },
                { p: "the other big one", c: "10%", t: "monthly", x: "no" },
                { p: "the older one", c: "2.9% + $0.30", t: "instant (paypal)", x: "no" },
              ].map((row) => (
                <tr key={row.p} className={`border-t-2 border-dashed border-ink/15 ${row.us ? "bg-marker-yellow/30" : ""}`}>
                  <td className="p-3 font-hand text-xl text-ink">{row.p} {row.us && <Stamp color="red" rotate={-6} className="ml-2 text-xs">us</Stamp>}</td>
                  <td className="p-3 text-right font-mono">{row.c}</td>
                  <td className="p-3 text-right font-mono">{row.t}</td>
                  <td className="p-3 text-right font-mono">{row.x}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 font-label text-xs text-ink-soft">* numbers as of last time we checked. if these are wrong, yell at us, we'll fix it.</p>
      </div>

      <div className="mt-20 rounded-2xl border-2 border-dashed border-ink/40 bg-card p-10 text-center">
        <StickyNote color="green" rotate={-2} className="mx-auto inline-block">
          <div className="font-hand text-3xl">your math, no surprises.</div>
        </StickyNote>
        <div className="mt-6">
          <button onClick={openCheckout} className="rotate-doodle-1 rounded-md border-2 border-ink bg-marker-red px-5 py-2.5 font-hand text-2xl text-paper shadow-sticker">
            i'm in — find a streamer →
          </button>
          {acceptedAt && (
            <div className="mt-3 font-label text-xs text-ink-soft">
              you agreed to the terms on {new Date(acceptedAt).toLocaleDateString()} · thanks for keeping it tidy.
            </div>
          )}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4" onClick={() => setModal(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[min(620px,calc(100vw-2rem))] rounded-xl bg-card p-6 shadow-paper"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-hand text-4xl text-ink">the napkin contract</div>
                <p className="mt-1 font-label text-sm text-ink-soft">short, plain, no lawyer voice. signed once.</p>
              </div>
              <button onClick={() => setModal(false)} className="font-hand text-2xl text-ink-soft">✕</button>
            </div>

            <div className="mt-4 max-h-[44vh] space-y-3 overflow-auto rounded-md border-2 border-dashed border-ink/30 bg-paper p-4 font-label text-sm text-ink">
              <p><strong className="font-hand text-xl">1. the fee.</strong> pufftip takes <strong>1.5%</strong> of every tip. that's it. no subscriptions, no setup, no surprise charges.</p>
              <p><strong className="font-hand text-xl">2. your money.</strong> tips land in your connected wallet directly. we never custody your funds. solana network fees apply (fractions of a cent).</p>
              <p><strong className="font-hand text-xl">3. be kind.</strong> no harassment, no doxxing, no illegal content, no sanctioned regions. we reserve the right to remove pages that break this — yelling at a referee is fine, yelling at a person is not.</p>
              <p><strong className="font-hand text-xl">4. taxes are yours.</strong> we hand you a CSV. what your country does with it is between you and your accountant.</p>
              <p><strong className="font-hand text-xl">5. demo mode.</strong> the SOL balance shown in this preview is fake. nothing here moves real money until you connect a real wallet on the live product.</p>
              <p><strong className="font-hand text-xl">6. changes.</strong> if we change the deal in your disfavor, we tell you 30 days ahead. you can leave anytime, no clawback.</p>
              <p><strong className="font-hand text-xl">7. the vibe.</strong> we're a small team. if something feels broken or unfair, email us at <em>hello@pufftip.app</em> and we'll actually reply.</p>
            </div>

            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-md border-2 border-dashed border-ink/40 bg-paper p-3">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 size-5 cursor-pointer accent-marker-red"
              />
              <span className="font-label text-sm text-ink">
                i read the napkin and i'm cool with it. (you can revisit this any time on the pricing page.)
              </span>
            </label>

            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
              <button onClick={() => setModal(false)} className="font-label text-sm text-ink-soft underline">nope, not yet</button>
              <button
                onClick={confirm}
                disabled={!agreed}
                className="rotate-doodle-1 rounded-md border-2 border-ink bg-marker-green px-4 py-2 font-hand text-2xl text-paper shadow-sticker disabled:cursor-not-allowed disabled:opacity-40"
              >
                ✎ sign the napkin
              </button>
            </div>
          </div>
        </div>
      )}
    </PaperPage>
  );
}
