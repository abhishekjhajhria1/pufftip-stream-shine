import { useState } from "react";
import { useDemoWallet } from "@/lib/useDemoWallet";
import { StickyNote } from "./primitives";
import type { Streamer } from "@/lib/mockData";
import { getConfig, useStreamerConfig } from "@/lib/useStreamerConfig";
import { PaperBurst } from "./PaperBurst";

export function TipModal({
  streamer,
  open,
  onClose,
  context,
}: {
  streamer: Streamer;
  open: boolean;
  onClose: () => void;
  context?: string;
}) {
  const cfg = useStreamerConfig((s) => getConfig(s.configs, streamer.handle));
  const quick = cfg.quickAmounts && cfg.quickAmounts.length ? cfg.quickAmounts : [0.1, 0.5, 1, 2.5];
  const minTip = cfg.minTip ?? 0.01;
  const [amount, setAmount] = useState(quick[1] ?? quick[0] ?? 0.5);
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [burst, setBurst] = useState(0);
  const { balance, addTip } = useDemoWallet();

  if (!open) return null;

  const send = () => {
    if (amount < minTip || amount > balance) return;
    addTip(streamer.handle, amount, msg);
    setSent(true);
    setBurst((n) => n + 1);
    setTimeout(() => {
      setSent(false);
      setMsg("");
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4" onClick={onClose}>
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <PaperBurst trigger={burst} />
        <StickyNote color={sent ? "green" : "yellow"} rotate={-2} className="w-[min(420px,calc(100vw-2rem))]">
          {sent ? (
            <div className="py-6 text-center">
              <div className="font-hand text-4xl text-ink">sent ✈️</div>
              <p className="mt-2 font-label text-base text-ink">{cfg.thankYouMessage || `your puff is on its way to ${streamer.name}.`}</p>
            </div>
          ) : (
            <>
              <div className="flex items-baseline justify-between">
                <div className="font-hand text-3xl text-ink">send a puff</div>
                <button onClick={onClose} className="font-hand text-xl text-ink-soft">✕</button>
              </div>
              <p className="mt-1 font-label text-sm text-ink-soft">
                {context ? context : <>tipping <strong className="text-ink">{streamer.name}</strong> · @{streamer.handle}</>}
              </p>

              <div className="mt-4">
                <label className="font-label text-sm text-ink">amount (SOL)</label>
                <div className="mt-1.5 grid grid-cols-4 gap-1.5">
                  {quick.slice(0, 8).map((q) => (
                    <button
                      key={q}
                      onClick={() => setAmount(q)}
                      className={`rounded-md border-2 border-ink px-2 py-1.5 font-hand text-lg ${
                        amount === q ? "bg-ink text-paper" : "bg-paper text-ink"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-2 w-full rounded-md border-2 border-dashed border-ink/50 bg-paper px-3 py-2 font-mono text-base text-ink outline-none focus:border-marker-blue"
                />
                <div className="mt-1 font-label text-xs text-ink-soft">demo balance: {balance.toFixed(2)} SOL · min {minTip} SOL</div>
              </div>

              <div className="mt-3">
                <label className="font-label text-sm text-ink">a little note</label>
                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="say something nice..."
                  rows={2}
                  className="mt-1.5 w-full resize-none rounded-md border-2 border-dashed border-ink/50 bg-paper px-3 py-2 font-hand text-lg text-ink outline-none focus:border-marker-blue"
                />
              </div>

              <button
                onClick={send}
                disabled={amount < minTip || amount > balance}
                className="mt-4 w-full rounded-md border-2 border-ink bg-marker-red px-4 py-2.5 font-hand text-2xl text-paper shadow-sticker disabled:opacity-50"
              >
                send {amount.toFixed(2)} SOL ✈️
              </button>
              <p className="mt-2 text-center font-label text-[11px] text-ink-soft">
                demo mode — no real funds move. connect a real wallet to send for real.
              </p>
            </>
          )}
        </StickyNote>
      </div>
    </div>
  );
}
