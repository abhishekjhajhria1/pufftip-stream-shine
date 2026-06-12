import { useStreamerConfig, type Block } from "@/lib/useStreamerConfig";
import { Highlight, MarkerUnderline, Polaroid, Sketch, StickyNote, WashiTape } from "./primitives";
import { useEffect, useState } from "react";

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.kind) {
    case "announcement":
      return (
        <StickyNote color={block.color} rotate={-1.5} className="max-w-2xl">
          <div className="font-hand text-3xl text-ink">{block.title}</div>
          <p className="mt-1 whitespace-pre-wrap font-label text-base text-ink">{block.body}</p>
        </StickyNote>
      );

    case "schedule":
      return (
        <Sketch rotate={-0.4} className="bg-card">
          <h3 className="font-hand text-3xl text-ink"><MarkerUnderline>{block.title}</MarkerUnderline></h3>
          <table className="mt-3 w-full font-label text-base text-ink">
            <tbody>
              {block.rows.map((r, i) => (
                <tr key={i} className="border-b border-dashed border-ink/15 last:border-0">
                  <td className="py-2 pr-3 font-hand text-2xl uppercase text-marker-red">{r.day}</td>
                  <td className="py-2 pr-3 font-mono text-sm text-ink-soft">{r.time}</td>
                  <td className="py-2 font-hand text-xl">{r.what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Sketch>
      );

    case "links":
      return (
        <div className="paper-card relative rounded-xl p-5">
          <WashiTape color="teal" rotate={-7} className="-top-2 left-6" style={{ width: "5rem" }} />
          <h3 className="font-hand text-3xl text-ink">{block.title}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {block.items.map((it, i) => (
              <a
                key={i}
                href={it.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rotate-doodle-1 rounded-full border-2 border-ink bg-paper px-3 py-1.5 font-hand text-xl text-ink hover:bg-marker-yellow"
              >
                ↗ {it.label}
              </a>
            ))}
          </div>
        </div>
      );

    case "faq":
      return (
        <Sketch rotate={0.3} className="bg-card">
          <h3 className="font-hand text-3xl text-ink"><MarkerUnderline>{block.title}</MarkerUnderline></h3>
          <ul className="mt-3 space-y-3">
            {block.items.map((it, i) => (
              <li key={i}>
                <div className="font-hand text-2xl text-ink">Q. <Highlight>{it.q}</Highlight></div>
                <div className="mt-1 pl-6 font-label text-base text-ink">A. {it.a}</div>
              </li>
            ))}
          </ul>
        </Sketch>
      );

    case "video":
      return (
        <div className="paper-card rounded-xl p-3">
          <div className="px-2 pt-1 font-hand text-2xl text-ink">{block.title}</div>
          <div className="mt-2 aspect-video overflow-hidden rounded-md border-2 border-ink">
            <iframe
              src={`https://www.youtube.com/embed/${block.youtubeId}`}
              title={block.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
          {block.caption && <div className="mt-2 px-2 font-label text-sm text-ink-soft">{block.caption}</div>}
        </div>
      );

    case "sponsors":
      return (
        <div className="paper-card rounded-xl p-5">
          <h3 className="font-hand text-3xl text-ink">{block.title}</h3>
          <div className="mt-3 flex flex-wrap gap-3">
            {block.items.map((s, i) => {
              const inner = (
                <span className="flex items-center gap-2 rounded-md border-2 border-dashed border-ink/40 bg-card px-3 py-2 font-hand text-xl text-ink hover:border-marker-red">
                  <span className="text-2xl">{s.emoji}</span>{s.name}
                </span>
              );
              return s.url ? (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="rotate-doodle-1">{inner}</a>
              ) : (
                <span key={i} className="rotate-doodle-2">{inner}</span>
              );
            })}
          </div>
        </div>
      );

    case "text":
      return (
        <div className="paper-card relative rounded-xl p-5">
          <WashiTape color="yellow" rotate={-6} className="-top-2 right-6" style={{ width: "5rem" }} />
          <h3 className="font-hand text-3xl text-ink">{block.title}</h3>
          <p className="mt-2 whitespace-pre-wrap font-label text-base text-ink">{block.body}</p>
        </div>
      );

    case "poll":
      return <PollBlock block={block} />;

    case "socials":
      return <SocialsBlock block={block} />;

    case "countdown":
      return <CountdownBlock block={block} />;

    case "testimonials":
      return (
        <div className="paper-card rounded-xl p-5">
          <WashiTape color="pink" rotate={-5} className="-top-2 left-8" style={{ width: "5rem" }} />
          <h3 className="font-hand text-3xl text-ink"><MarkerUnderline>{block.title}</MarkerUnderline></h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {block.items.map((it, i) => (
              <StickyNote key={i} color={it.color ?? "yellow"} rotate={(i % 2 === 0 ? -1.5 : 1.5) * (1 + (i % 2))} className="break-words">
                <p className="font-hand text-2xl leading-tight text-ink">“{it.quote}”</p>
                <p className="mt-2 font-label text-xs text-ink-soft">— @{it.from}</p>
              </StickyNote>
            ))}
          </div>
        </div>
      );

    case "gallery":
      return (
        <div className="paper-card rounded-xl p-5">
          <h3 className="font-hand text-3xl text-ink"><MarkerUnderline>{block.title}</MarkerUnderline></h3>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {block.items.map((it, i) => (
              <div key={i} className="flex justify-center">
                <Polaroid hue={it.hue} emoji={it.emoji} caption={it.caption} size={130} rotate={(i % 2 === 0 ? -1 : 1) * (1 + (i % 3))} />
              </div>
            ))}
          </div>
        </div>
      );

    case "merch":
      return (
        <div className="paper-card rounded-xl p-5">
          <h3 className="font-hand text-3xl text-ink"><MarkerUnderline>{block.title}</MarkerUnderline></h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {block.items.map((it, i) => {
              const inner = (
                <div className="flex h-full flex-col items-center gap-1 rounded-lg border-2 border-dashed border-ink/40 bg-paper p-4 text-center transition hover:border-marker-red">
                  <span className="text-4xl">{it.emoji}</span>
                  <div className="font-hand text-2xl text-ink">{it.name}</div>
                  <div className="font-mono text-sm text-marker-red">{it.price}</div>
                  <div className="mt-1 font-label text-xs text-ink-soft underline">buy →</div>
                </div>
              );
              return it.url ? (
                <a key={i} href={it.url} target="_blank" rel="noopener noreferrer" style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 1.2}deg)` }}>{inner}</a>
              ) : (
                <div key={i} style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 1.2}deg)` }}>{inner}</div>
              );
            })}
          </div>
        </div>
      );

    case "newsletter":
      return <NewsletterBlock block={block} />;

    case "embed":
      return <EmbedBlock block={block} />;

    case "guestbook":
      return <GuestbookBlock block={block} />;
  }
}

const SOCIAL_META: Record<string, { emoji: string; label: string }> = {
  twitch:    { emoji: "🟣", label: "twitch" },
  youtube:   { emoji: "▶️", label: "youtube" },
  twitter:   { emoji: "🐦", label: "twitter / X" },
  instagram: { emoji: "📸", label: "instagram" },
  tiktok:    { emoji: "🎵", label: "tiktok" },
  discord:   { emoji: "💬", label: "discord" },
  kick:      { emoji: "🦵", label: "kick" },
  github:    { emoji: "🐙", label: "github" },
};

function SocialsBlock({ block }: { block: Extract<Block, { kind: "socials" }> }) {
  return (
    <div className="paper-card rounded-xl p-5">
      <h3 className="font-hand text-3xl text-ink">{block.title}</h3>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {block.items.map((s, i) => {
          const meta = SOCIAL_META[s.platform] ?? { emoji: "🔗", label: s.platform };
          return (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-md border-2 border-dashed border-ink/40 bg-paper px-3 py-2 transition hover:border-marker-red hover:bg-marker-yellow"
              style={{ transform: `rotate(${(i % 2 === 0 ? -0.6 : 0.6)}deg)` }}
            >
              <span className="text-2xl">{meta.emoji}</span>
              <span className="flex min-w-0 flex-col">
                <span className="font-hand text-xl text-ink">{meta.label}</span>
                <span className="truncate font-label text-xs text-ink-soft">{s.handle}</span>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function CountdownBlock({ block }: { block: Extract<Block, { kind: "countdown" }> }) {
  // Init with the target time so SSR and first client render produce identical
  // markup (all-zero cells). Real "now" kicks in after mount.
  const target = new Date(block.targetISO).getTime();
  const [now, setNow] = useState(target);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const live = diff === 0;
  const cells: [string, number | string][] = live
    ? [["status", "LIVE"]]
    : [["days", d], ["hrs", h], ["min", m], ["sec", s]];
  return (
    <Sketch rotate={-0.4} className="bg-card">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-hand text-3xl text-ink"><MarkerUnderline>{block.title}</MarkerUnderline></h3>
        <span className="font-label text-sm text-ink-soft">{block.label}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {cells.map(([k, v]) => (
          <div key={k} className="rotate-doodle-1 min-w-[5rem] rounded-md border-2 border-ink bg-paper px-3 py-2 text-center shadow-sticker">
            <div className="font-hand text-4xl tabular-nums text-ink">{typeof v === "number" ? String(v).padStart(2, "0") : v}</div>
            <div className="font-label text-[10px] uppercase tracking-wider text-ink-soft">{k}</div>
          </div>
        ))}
      </div>
      {live && <p className="mt-3 font-hand text-2xl text-marker-red">we're on. go say hi.</p>}
    </Sketch>
  );
}

function PollBlock({ block }: { block: Extract<Block, { kind: "poll" }> }) {
  // Use the streamer-config store to persist votes locally (per browser).
  const update = useStreamerConfig((s) => s.upsertBlock);
  // We don't know the streamer handle here — pass through a click handler that
  // mutates the block object in place via local component state for now.
  // For demo simplicity we keep voting client-only and update local copy.
  // To stay reactive we track the chosen option in localStorage by block id.
  const key = `pufftip-poll-${block.id}`;
  const [chosen, setChosen] = useState<string | null>(null);
  useEffect(() => {
    try { setChosen(window.localStorage.getItem(key)); } catch { /* noop */ }
  }, [key]);
  const total = block.options.reduce((a, b) => a + b.votes, 0) || 1;

  const vote = (label: string) => {
    if (chosen) return;
    window.localStorage.setItem(key, label);
    setChosen(label);
    const next = {
      ...block,
      options: block.options.map((o) => (o.label === label ? { ...o, votes: o.votes + 1 } : o)),
    };
    // upsert into whichever streamer config owns this block — best effort: find it.
    const state = useStreamerConfig.getState();
    for (const [handle, cfg] of Object.entries(state.configs)) {
      if (cfg.blocks?.some((b) => b.id === block.id)) {
        update(handle, next);
        return;
      }
    }
    // not in any config (default seed?) — force re-render via dummy refresh
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <Sketch rotate={-0.5} className="bg-card">
      <h3 className="font-hand text-3xl text-ink"><MarkerUnderline>{block.title}</MarkerUnderline></h3>
      <p className="mt-1 font-hand text-2xl text-ink"><Highlight>{block.question}</Highlight></p>
      <div className="mt-4 space-y-2">
        {block.options.map((o) => {
          const pct = Math.round((o.votes / total) * 100);
          const isChosen = chosen === o.label;
          return (
            <button
              key={o.label}
              onClick={() => vote(o.label)}
              disabled={!!chosen}
              className={`relative block w-full overflow-hidden rounded-md border-2 border-ink bg-paper p-3 text-left transition ${chosen ? "cursor-default" : "hover:bg-marker-yellow"}`}
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0"
                style={{
                  width: chosen ? `${pct}%` : "0%",
                  background: isChosen ? "var(--marker-green)" : "var(--marker-yellow)",
                  opacity: 0.4,
                  transition: "width 600ms cubic-bezier(0.3, 0.7, 0.3, 1)",
                }}
              />
              <span className="relative flex items-center justify-between font-hand text-2xl text-ink">
                <span>{isChosen && "✓ "}{o.label}</span>
                <span className="font-mono text-sm text-ink-soft">{chosen ? `${pct}% · ${o.votes}` : "vote"}</span>
              </span>
            </button>
          );
        })}
      </div>
      {chosen && <p className="mt-2 font-label text-xs text-ink-soft">thanks for voting — results above.</p>}
    </Sketch>
  );
}
function NewsletterBlock({ block }: { block: Extract<Block, { kind: "newsletter" }> }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div className="paper-card relative rounded-xl p-5">
      <WashiTape color="teal" rotate={-6} className="-top-2 right-8" style={{ width: "5rem" }} />
      <h3 className="font-hand text-3xl text-ink"><MarkerUnderline>{block.title}</MarkerUnderline></h3>
      <p className="mt-1 font-label text-base text-ink">{block.pitch}</p>
      {done ? (
        <p className="mt-3 font-hand text-2xl text-marker-green">✓ on the list. check your inbox.</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!/^\S+@\S+\.\S+$/.test(email)) return;
            setDone(true);
          }}
          className="mt-3 flex flex-col gap-2 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={block.placeholder}
            className="flex-1 rounded-md border-2 border-ink bg-paper px-3 py-2 font-label text-base text-ink outline-none focus:border-marker-red"
          />
          <button type="submit" className="rotate-doodle-1 rounded-md border-2 border-ink bg-marker-yellow px-4 py-2 font-hand text-xl text-ink shadow-sticker hover:bg-marker-red hover:text-paper">
            {block.cta} →
          </button>
        </form>
      )}
      <p className="mt-2 font-label text-[11px] italic text-ink-soft">no spam. unsubscribe with one click.</p>
    </div>
  );
}

function EmbedBlock({ block }: { block: Extract<Block, { kind: "embed" }> }) {
  const [parentHost, setParentHost] = useState<string>("lovable.app");
  useEffect(() => { setParentHost(window.location.hostname); }, []);
  const src = (() => {
    const s = (block.src || "").trim();
    switch (block.provider) {
      case "twitch": {
        const channel = s.replace(/^https?:\/\/(www\.)?twitch\.tv\//, "").replace(/\/$/, "") || "twitch";
        return `https://player.twitch.tv/?channel=${encodeURIComponent(channel)}&parent=${parentHost}&muted=true`;
      }
      case "youtube": {
        const m = s.match(/(?:youtu\.be\/|v=|\/embed\/)([A-Za-z0-9_-]{6,})/);
        const id = m ? m[1] : s;
        return `https://www.youtube.com/embed/${id}`;
      }
      case "spotify": {
        const m = s.match(/spotify\.com\/(track|playlist|album|episode|show)\/([A-Za-z0-9]+)/);
        if (m) return `https://open.spotify.com/embed/${m[1]}/${m[2]}`;
        return `https://open.spotify.com/embed/playlist/${s}`;
      }
      case "soundcloud":
        return `https://w.soundcloud.com/player/?url=${encodeURIComponent(s)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=true`;
      default:
        return s;
    }
  })();
  return (
    <div className="paper-card rounded-xl p-3">
      <div className="flex items-baseline justify-between px-2 pt-1">
        <div className="font-hand text-2xl text-ink">{block.title}</div>
        <span className="font-label text-[11px] uppercase tracking-wider text-ink-soft">{block.provider}</span>
      </div>
      <div className={`mt-2 overflow-hidden rounded-md border-2 border-ink ${block.provider === "spotify" || block.provider === "soundcloud" ? "h-[152px]" : "aspect-video"}`}>
        <iframe
          src={src}
          title={block.title}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
      {block.caption && <p className="mt-2 px-2 font-label text-sm text-ink-soft">{block.caption}</p>}
    </div>
  );
}

function GuestbookBlock({ block }: { block: Extract<Block, { kind: "guestbook" }> }) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState<{ from: string; note: string }[]>([]);
  const key = `pufftip-guestbook-${block.id}`;
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setEntries(JSON.parse(raw));
    } catch { /* noop */ }
  }, [key]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedFrom = name.trim().slice(0, 40) || "anon";
    const trimmedNote = note.trim().slice(0, 200);
    if (!trimmedNote) return;
    const next = [{ from: trimmedFrom, note: trimmedNote }, ...entries].slice(0, 12);
    setEntries(next);
    setName("");
    setNote("");
    try { window.localStorage.setItem(key, JSON.stringify(next)); } catch { /* noop */ }
  };
  const shown = entries.length > 0 ? entries : block.samples;
  return (
    <div className="paper-card relative rounded-xl p-5">
      <WashiTape color="yellow" rotate={-5} className="-top-2 left-6" style={{ width: "6rem" }} />
      <h3 className="font-hand text-3xl text-ink"><MarkerUnderline>{block.title}</MarkerUnderline></h3>
      <p className="mt-1 font-label text-base text-ink">{block.prompt}</p>
      <form onSubmit={submit} className="mt-3 grid gap-2 sm:grid-cols-[10rem_1fr_auto]">
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="your name (or anon)" className="rounded-md border-2 border-ink bg-paper px-3 py-2 font-label text-base text-ink outline-none focus:border-marker-red" />
        <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} placeholder="a kind note…" className="rounded-md border-2 border-ink bg-paper px-3 py-2 font-label text-base text-ink outline-none focus:border-marker-red" />
        <button type="submit" className="rotate-doodle-2 rounded-md border-2 border-ink bg-marker-yellow px-4 py-2 font-hand text-xl text-ink shadow-sticker hover:bg-marker-red hover:text-paper">{block.cta}</button>
      </form>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {shown.map((it, i) => (
          <StickyNote key={i} color={(["yellow","pink","teal","green"] as const)[i % 4]} rotate={(i % 2 === 0 ? -1.2 : 1.2)} className="break-words">
            <p className="font-hand text-xl leading-tight text-ink">“{it.note}”</p>
            <p className="mt-1 font-label text-[11px] text-ink-soft">— @{it.from}</p>
          </StickyNote>
        ))}
      </div>
      {entries.length > 0 && (
        <button onClick={() => { setEntries([]); try { window.localStorage.removeItem(key); } catch { /* noop */ } }} className="mt-3 font-label text-[11px] text-marker-red underline">clear my entries</button>
      )}
    </div>
  );
}
