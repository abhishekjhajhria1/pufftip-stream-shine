import { Link, useRouterState } from "@tanstack/react-router";
import { useDemoWallet } from "@/lib/useDemoWallet";
import { useState } from "react";
import { StickyNote, SmokeCurl } from "./primitives";

const NAV = [
  { to: "/", label: "home" },
  { to: "/explore", label: "explore" },
  { to: "/dashboard", label: "dashboard" },
  { to: "/obs", label: "obs setup" },
  { to: "/pricing", label: "fees" },
] as const;

export function SiteHeader() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { balance, connected, fakeConnect } = useDemoWallet();
  const [showConnect, setShowConnect] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative">
              <div className="grid size-10 place-items-center rounded-full border-2 border-ink bg-paper font-hand text-xl rotate-doodle-1">P</div>
              <SmokeCurl className="absolute -right-3 -top-6 h-8 w-5" />
            </div>
            <div className="leading-none">
              <div className="font-hand text-2xl text-ink rotate-doodle-2">pufftip</div>
              <div className="font-label text-[10px] uppercase tracking-wider text-ink-soft">a tip / a smoke</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative px-3 py-1.5 font-label text-base text-ink hover:text-marker-red ${active ? "marker-underline" : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden rotate-doodle-1 items-center gap-1.5 rounded-full border-2 border-dashed border-ink/40 bg-paper px-3 py-1 sm:flex">
              <span className="size-2 rounded-full bg-marker-green animate-ember" />
              <span className="font-label text-sm text-ink">{balance.toFixed(2)} SOL</span>
              <span className="font-label text-[10px] uppercase tracking-wider text-ink-soft">demo</span>
            </div>
            <button
              onClick={() => setShowConnect(true)}
              className="rotate-doodle-2 rounded-md border-2 border-ink bg-marker-yellow px-3 py-1.5 font-hand text-lg text-ink shadow-sticker hover:bg-ember"
            >
              {connected ? "wallet ✓" : "connect"}
            </button>
            <button onClick={() => setOpen(!open)} className="md:hidden rounded border-2 border-ink px-2 py-1 font-hand text-lg">
              ≡
            </button>
          </div>
        </div>
        {open && (
          <div className="mx-4 mb-3 grid gap-1 rounded-lg border-2 border-dashed border-ink/40 bg-card p-3 md:hidden">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="font-label text-base text-ink">
                · {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {showConnect && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-6" onClick={() => setShowConnect(false)}>
          <StickyNote color="yellow" rotate={-3} className="max-w-sm">
            <div onClick={(e) => e.stopPropagation()}>
              <div className="font-hand text-3xl text-ink">connect a wallet</div>
              <p className="mt-2 font-label text-base text-ink">
                real Solana wallets (Phantom, Backpack) are coming soon. for now everyone gets a pretend 5 SOL to play with — try sending some tips!
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => { fakeConnect(); setShowConnect(false); }}
                  className="rounded-md border-2 border-ink bg-marker-green px-3 py-1.5 font-hand text-lg text-paper"
                >
                  use demo wallet
                </button>
                <button onClick={() => setShowConnect(false)} className="font-label text-sm text-ink-soft underline">
                  nevermind
                </button>
              </div>
            </div>
          </StickyNote>
        </div>
      )}
    </>
  );
}
