import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useDemoWallet } from "@/lib/useDemoWallet";
import { MarkerUnderline, Sketch, Stamp } from "./primitives";

/* Streamer-side tools: copy overlay URL, fire test tip, grab embed snippet. */
export function OverlayTools({ handle }: { handle: string }) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://pufftip.com";
  const overlayUrl = `${origin}/overlay/${handle}`;
  const profileUrl = `${origin}/u/${handle}`;
  const embedSnippet = `<iframe src="${profileUrl}" width="420" height="640" style="border:0;border-radius:16px;overflow:hidden" title="tip @${handle} on pufftip"></iframe>`;

  const addTip = useDemoWallet((s) => s.addTip);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (label: string, text: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied((c) => (c === label ? null : c)), 1500);
    });
  };

  const TEST_MSGS = useMemo(() => [
    { from: "spookz", amount: 5.0, message: "AHHH that jumpscare omg" },
    { from: "cryptowhale", amount: 2.5, message: "huge play! smoke break for u 🚬" },
    { from: "miso", amount: 0.5, message: "play the one with the rain again pls" },
    { from: "anon", amount: 0.18, message: "saw u on stream, instant follow" },
  ], []);

  const fireTest = () => {
    const t = TEST_MSGS[Math.floor(Math.random() * TEST_MSGS.length)];
    addTip(handle, t.amount, t.message, t.from);
  };

  return (
    <Sketch rotate={-0.3} className="bg-card">
      <div className="flex items-baseline justify-between">
        <h3 className="font-hand text-3xl text-ink"><MarkerUnderline>overlay & embed</MarkerUnderline></h3>
        <Stamp color="green" rotate={4} className="text-base">live</Stamp>
      </div>
      <p className="mt-1 font-label text-sm text-ink-soft">share these. paste in OBS, on your site, or in your bio.</p>

      <div className="mt-4 space-y-4">
        <UrlRow
          label="obs browser source"
          help="add this URL as a Browser source in OBS (800×600, transparent)."
          url={overlayUrl}
          copied={copied === "overlay"}
          onCopy={() => copy("overlay", overlayUrl)}
          openLabel="open overlay ↗"
          openLink={{ to: "/overlay/$handle", params: { handle } }}
        />
        <UrlRow
          label="your public page"
          help="this is the URL you share with viewers. they tip you here."
          url={profileUrl}
          copied={copied === "profile"}
          onCopy={() => copy("profile", profileUrl)}
          openLabel="open page ↗"
          openLink={{ to: "/u/$handle", params: { handle } }}
        />

        <div>
          <div className="mb-1 font-label text-xs uppercase tracking-wider text-ink-soft">embed snippet</div>
          <pre className="overflow-x-auto rounded-md border-2 border-dashed border-ink/30 bg-paper p-2 font-mono text-xs text-ink">{embedSnippet}</pre>
          <button
            onClick={() => copy("embed", embedSnippet)}
            className="mt-2 rounded-md border-2 border-ink bg-marker-yellow px-2 py-1 font-hand text-base text-ink hover:bg-marker-red hover:text-paper"
          >
            {copied === "embed" ? "copied!" : "copy snippet"}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-md border-2 border-dashed border-ink/30 bg-paper p-3">
          <span className="font-label text-sm text-ink-soft">need to see it on stream?</span>
          <button
            onClick={fireTest}
            className="rounded-md border-2 border-ink bg-marker-red px-3 py-1 font-hand text-xl text-paper shadow-sticker hover:bg-ink"
          >
            🎯 send a test tip
          </button>
          <span className="font-label text-xs text-ink-soft">open the overlay in another tab/window first — the alert appears there in real time.</span>
        </div>
      </div>
    </Sketch>
  );
}

function UrlRow({ label, help, url, copied, onCopy, openLabel, openLink }: {
  label: string;
  help: string;
  url: string;
  copied: boolean;
  onCopy: () => void;
  openLabel: string;
  openLink: { to: "/overlay/$handle" | "/u/$handle"; params: { handle: string } };
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <div className="font-label text-xs uppercase tracking-wider text-ink-soft">{label}</div>
        <div className="font-label text-[11px] text-ink-soft">{help}</div>
      </div>
      <div className="flex flex-wrap items-stretch gap-2">
        <code className="flex-1 truncate rounded-md border-2 border-dashed border-ink/30 bg-paper px-2 py-1.5 font-mono text-xs text-ink">{url}</code>
        <button onClick={onCopy} className="rounded-md border-2 border-ink bg-marker-yellow px-3 font-hand text-lg text-ink hover:bg-marker-red hover:text-paper">{copied ? "copied!" : "copy"}</button>
        <Link
          to={openLink.to}
          params={openLink.params}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border-2 border-ink bg-paper px-3 py-1.5 font-hand text-lg text-ink hover:bg-marker-yellow"
        >
          {openLabel}
        </Link>
      </div>
    </div>
  );
}
