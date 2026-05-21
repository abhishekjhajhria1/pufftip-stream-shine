import { useState } from "react";
import {
  useStreamerConfig,
  getConfig,
  newBlock,
  PAPER_TONES,
  HEADING_FONTS,
  type Block,
  type BlockKind,
  type SectionKey,
  DEFAULT_SECTIONS,
} from "@/lib/useStreamerConfig";
import { STREAMERS } from "@/lib/mockData";
import { Link } from "@tanstack/react-router";

const TABS = ["profile", "theme", "tips", "sections", "blocks"] as const;
type Tab = (typeof TABS)[number];

const SECTION_LABELS: Record<SectionKey, string> = {
  tipWall: "tip wall",
  topFans: "top fans sidebar",
  quickTip: "quick tip buttons",
  alsoOn: "also on pufftip",
};

const EMOJI_CHOICES = ["🎸","👻","💻","🍜","🚀","📷","🎮","🎤","🎧","🧠","🔥","✨","🌈","🍕","☕","🐈","🧪","🎨","🛹","📚"];

export function StreamerCustomizer({ handle }: { handle: string }) {
  const cfg = useStreamerConfig((s) => getConfig(s.configs, handle));
  const update = useStreamerConfig((s) => s.update);
  const upsertBlock = useStreamerConfig((s) => s.upsertBlock);
  const removeBlock = useStreamerConfig((s) => s.removeBlock);
  const moveBlock = useStreamerConfig((s) => s.moveBlock);
  const reset = useStreamerConfig((s) => s.reset);
  const setOwner = useStreamerConfig((s) => s.setOwner);
  const setEditMode = useStreamerConfig((s) => s.setEditMode);

  const base = STREAMERS.find((s) => s.handle === handle);
  const [tab, setTab] = useState<Tab>("profile");

  return (
    <div className="paper-card rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-hand text-3xl text-ink">customize your page</h3>
          <p className="font-label text-sm text-ink-soft">editing as <strong>@{handle}</strong> · saved in your browser</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/u/$handle"
            params={{ handle }}
            onClick={() => { setOwner(handle); setEditMode(true); }}
            className="rounded-md border-2 border-ink bg-marker-yellow px-3 py-1.5 font-hand text-lg text-ink"
          >
            open & inline edit →
          </Link>
          <button onClick={() => { if (confirm("reset all customizations for @" + handle + "?")) reset(handle); }} className="rounded-md border-2 border-dashed border-ink/40 px-3 py-1.5 font-label text-sm text-ink-soft hover:border-marker-red hover:text-marker-red">
            reset
          </button>
        </div>
      </div>

      {/* handle picker */}
      <div className="mt-4 flex flex-wrap gap-2 border-b-2 border-dashed border-ink/15 pb-4">
        <span className="font-label text-xs uppercase text-ink-soft">edit as:</span>
        {STREAMERS.map((s) => (
          <button key={s.handle} onClick={() => setOwner(s.handle)} className={`rounded-full border-2 px-2 py-0.5 font-hand text-base ${s.handle === handle ? "border-ink bg-marker-yellow" : "border-ink/30 hover:border-ink"}`}>
            @{s.handle}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-4 flex flex-wrap gap-1">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-t-md border-2 border-b-0 px-3 py-1.5 font-hand text-lg ${tab === t ? "border-ink bg-card" : "border-ink/20 bg-paper-deep text-ink-soft hover:text-ink"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-b-md rounded-tr-md border-2 border-ink bg-card p-4">
        {tab === "profile" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="display name">
              <input className={input} value={cfg.name ?? base?.name ?? ""} onChange={(e) => update(handle, { name: e.target.value })} />
            </Field>
            <Field label="game / category">
              <input className={input} value={cfg.game ?? base?.game ?? ""} onChange={(e) => update(handle, { game: e.target.value })} />
            </Field>
            <Field label="tagline" full>
              <input className={input} value={cfg.tagline ?? base?.tagline ?? ""} onChange={(e) => update(handle, { tagline: e.target.value })} />
            </Field>
            <Field label="bio" full>
              <textarea className={input + " min-h-[80px]"} value={cfg.bio ?? base?.bio ?? ""} onChange={(e) => update(handle, { bio: e.target.value })} />
            </Field>
            <Field label="avatar emoji">
              <div className="flex flex-wrap gap-1">
                {EMOJI_CHOICES.map((e) => (
                  <button key={e} onClick={() => update(handle, { avatarEmoji: e })} className={`size-9 rounded-md border-2 text-2xl ${(cfg.avatarEmoji ?? "🎤") === e ? "border-ink bg-marker-yellow" : "border-ink/20 hover:border-ink"}`}>{e}</button>
                ))}
              </div>
            </Field>
            <Field label={`avatar hue · ${cfg.avatarHue ?? base?.avatarHue ?? 25}°`}>
              <input type="range" min={0} max={360} value={cfg.avatarHue ?? base?.avatarHue ?? 25} onChange={(e) => update(handle, { avatarHue: Number(e.target.value) })} className="w-full" />
            </Field>
          </div>
        )}

        {tab === "theme" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={`accent hue · ${cfg.accentHue ?? 25}°`} full>
              <input type="range" min={0} max={360} value={cfg.accentHue ?? 25} onChange={(e) => update(handle, { accentHue: Number(e.target.value) })} className="w-full" />
              <div className="mt-2 h-3 w-full rounded-full" style={{ background: `linear-gradient(90deg, oklch(0.62 0.22 0), oklch(0.62 0.22 60), oklch(0.62 0.22 120), oklch(0.62 0.22 180), oklch(0.62 0.22 240), oklch(0.62 0.22 300), oklch(0.62 0.22 360))` }} />
            </Field>
            <Field label="paper tone">
              <div className="flex flex-wrap gap-2">
                {Object.entries(PAPER_TONES).map(([k, v]) => (
                  <button key={k} onClick={() => update(handle, { paperTone: k as keyof typeof PAPER_TONES })} className={`flex items-center gap-2 rounded-md border-2 px-2 py-1 font-hand text-base ${cfg.paperTone === k ? "border-ink" : "border-ink/20 hover:border-ink"}`}>
                    <span className="inline-block size-5 rounded-sm border border-ink/40" style={{ background: v.oklch }} />
                    {v.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="heading font">
              <div className="flex flex-wrap gap-2">
                {Object.entries(HEADING_FONTS).map(([k, v]) => (
                  <button key={k} onClick={() => update(handle, { headingFont: k as keyof typeof HEADING_FONTS })} style={{ fontFamily: v.family }} className={`rounded-md border-2 px-2 py-1 text-xl ${cfg.headingFont === k ? "border-ink bg-marker-yellow" : "border-ink/20 hover:border-ink"}`}>
                    {v.label}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {tab === "tips" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="quick-tip amounts (SOL)" full>
              <input
                className={input}
                value={(cfg.quickAmounts ?? []).join(", ")}
                onChange={(e) => {
                  const arr = e.target.value.split(",").map((x) => Number(x.trim())).filter((n) => !isNaN(n) && n > 0);
                  update(handle, { quickAmounts: arr });
                }}
              />
              <div className="mt-1 font-label text-xs text-ink-soft">comma-separated. shown as buttons on your page.</div>
            </Field>
            <Field label="minimum tip (SOL)">
              <input type="number" step="0.01" min={0} className={input} value={cfg.minTip ?? 0.01} onChange={(e) => update(handle, { minTip: Number(e.target.value) })} />
            </Field>
            <Field label="thank-you message" full>
              <input className={input} value={cfg.thankYouMessage ?? ""} onChange={(e) => update(handle, { thankYouMessage: e.target.value })} />
            </Field>
            <Field label="goal label (optional)">
              <input className={input} placeholder="e.g. new mic" value={cfg.goalLabel ?? ""} onChange={(e) => update(handle, { goalLabel: e.target.value })} />
            </Field>
            <Field label="goal amount (SOL)">
              <input type="number" step="0.1" min={0} className={input} value={cfg.goalAmount ?? 0} onChange={(e) => update(handle, { goalAmount: Number(e.target.value) })} />
            </Field>
          </div>
        )}

        {tab === "sections" && (
          <div className="space-y-2">
            <p className="font-label text-sm text-ink-soft">toggle and reorder built-in sections.</p>
            {(cfg.sections ?? DEFAULT_SECTIONS).map((s, i, arr) => (
              <div key={s.key} className="flex items-center justify-between rounded-md border-2 border-dashed border-ink/30 bg-paper p-2">
                <span className="font-hand text-xl text-ink">{SECTION_LABELS[s.key]}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => {
                    const next = [...arr]; if (i === 0) return;
                    [next[i - 1], next[i]] = [next[i], next[i - 1]];
                    update(handle, { sections: next });
                  }} className="rounded border-2 border-ink/30 px-2 hover:border-ink">↑</button>
                  <button onClick={() => {
                    const next = [...arr]; if (i === arr.length - 1) return;
                    [next[i + 1], next[i]] = [next[i], next[i + 1]];
                    update(handle, { sections: next });
                  }} className="rounded border-2 border-ink/30 px-2 hover:border-ink">↓</button>
                  <button onClick={() => {
                    const next = arr.map((x) => x.key === s.key ? { ...x, visible: !x.visible } : x);
                    update(handle, { sections: next });
                  }} className={`rounded-md border-2 px-2 py-0.5 font-label text-xs ${s.visible ? "border-ink bg-marker-green/40" : "border-ink/30 line-through text-ink-soft"}`}>
                    {s.visible ? "shown" : "hidden"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "blocks" && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="font-label text-xs uppercase text-ink-soft self-center">add block:</span>
              {(["announcement","schedule","links","faq","video","sponsors","text","poll","gallery","merch"] as BlockKind[]).map((k) => (
                <button key={k} onClick={() => upsertBlock(handle, newBlock(k))} className="rounded-md border-2 border-ink bg-paper px-2 py-1 font-hand text-base text-ink hover:bg-marker-yellow">+ {k}</button>
              ))}
            </div>
            {(cfg.blocks ?? []).length === 0 && (
              <p className="font-label text-sm text-ink-soft">no blocks yet — add one above. they'll show up on your page in this order.</p>
            )}
            {(cfg.blocks ?? []).map((b, i, arr) => (
              <BlockEditor key={b.id} block={b} onChange={(nb) => upsertBlock(handle, nb)} onRemove={() => removeBlock(handle, b.id)} onUp={() => moveBlock(handle, b.id, -1)} onDown={() => moveBlock(handle, b.id, 1)} isFirst={i === 0} isLast={i === arr.length - 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const input = "w-full rounded-md border-2 border-dashed border-ink/40 bg-paper px-3 py-1.5 font-label text-ink outline-none focus:border-marker-blue";

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <div className="mb-1 font-label text-xs uppercase tracking-wider text-ink-soft">{label}</div>
      {children}
    </label>
  );
}

function BlockEditor({ block, onChange, onRemove, onUp, onDown, isFirst, isLast }: { block: Block; onChange: (b: Block) => void; onRemove: () => void; onUp: () => void; onDown: () => void; isFirst: boolean; isLast: boolean }) {
  return (
    <div className="rounded-md border-2 border-dashed border-ink/30 bg-paper p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="font-label text-xs uppercase text-ink-soft">{block.kind}</div>
        <div className="flex gap-1">
          <button disabled={isFirst} onClick={onUp} className="rounded border-2 border-ink/30 px-2 disabled:opacity-30 hover:border-ink">↑</button>
          <button disabled={isLast} onClick={onDown} className="rounded border-2 border-ink/30 px-2 disabled:opacity-30 hover:border-ink">↓</button>
          <button onClick={onRemove} className="rounded border-2 border-marker-red/50 px-2 font-label text-xs text-marker-red hover:bg-marker-red hover:text-paper">remove</button>
        </div>
      </div>
      <input className={input + " mt-2"} value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} placeholder="title" />

      {block.kind === "announcement" && (
        <>
          <textarea className={input + " mt-2 min-h-[70px]"} value={block.body} onChange={(e) => onChange({ ...block, body: e.target.value })} />
          <div className="mt-2 flex gap-2 font-label text-xs">
            {(["yellow","pink","teal","green"] as const).map((c) => (
              <button key={c} onClick={() => onChange({ ...block, color: c })} className={`rounded-full border-2 px-2 py-0.5 ${block.color === c ? "border-ink" : "border-ink/30"}`}>{c}</button>
            ))}
          </div>
        </>
      )}

      {block.kind === "text" && (
        <textarea className={input + " mt-2 min-h-[80px]"} value={block.body} onChange={(e) => onChange({ ...block, body: e.target.value })} />
      )}

      {block.kind === "schedule" && (
        <div className="mt-2 space-y-1">
          {block.rows.map((r, i) => (
            <div key={i} className="grid grid-cols-[3rem_4rem_1fr_auto] gap-1">
              <input className={input} value={r.day} onChange={(e) => onChange({ ...block, rows: block.rows.map((x, j) => i === j ? { ...x, day: e.target.value } : x) })} />
              <input className={input} value={r.time} onChange={(e) => onChange({ ...block, rows: block.rows.map((x, j) => i === j ? { ...x, time: e.target.value } : x) })} />
              <input className={input} value={r.what} onChange={(e) => onChange({ ...block, rows: block.rows.map((x, j) => i === j ? { ...x, what: e.target.value } : x) })} />
              <button onClick={() => onChange({ ...block, rows: block.rows.filter((_, j) => i !== j) })} className="px-2 font-label text-xs text-marker-red">×</button>
            </div>
          ))}
          <button onClick={() => onChange({ ...block, rows: [...block.rows, { day: "sun", time: "8pm", what: "vibes" }] })} className="font-label text-xs text-ink-soft underline">+ row</button>
        </div>
      )}

      {block.kind === "links" && (
        <div className="mt-2 space-y-1">
          {block.items.map((it, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-1">
              <input className={input} placeholder="label" value={it.label} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, label: e.target.value } : x) })} />
              <input className={input} placeholder="https://…" value={it.url} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, url: e.target.value } : x) })} />
              <button onClick={() => onChange({ ...block, items: block.items.filter((_, j) => i !== j) })} className="px-2 font-label text-xs text-marker-red">×</button>
            </div>
          ))}
          <button onClick={() => onChange({ ...block, items: [...block.items, { label: "site", url: "https://" }] })} className="font-label text-xs text-ink-soft underline">+ link</button>
        </div>
      )}

      {block.kind === "faq" && (
        <div className="mt-2 space-y-2">
          {block.items.map((it, i) => (
            <div key={i} className="rounded border border-dashed border-ink/30 p-2">
              <input className={input} placeholder="question" value={it.q} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, q: e.target.value } : x) })} />
              <textarea className={input + " mt-1"} placeholder="answer" value={it.a} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, a: e.target.value } : x) })} />
              <button onClick={() => onChange({ ...block, items: block.items.filter((_, j) => i !== j) })} className="font-label text-xs text-marker-red">remove</button>
            </div>
          ))}
          <button onClick={() => onChange({ ...block, items: [...block.items, { q: "new question?", a: "new answer" }] })} className="font-label text-xs text-ink-soft underline">+ item</button>
        </div>
      )}

      {block.kind === "video" && (
        <>
          <input className={input + " mt-2"} placeholder="youtube video id (e.g. dQw4w9WgXcQ)" value={block.youtubeId} onChange={(e) => onChange({ ...block, youtubeId: e.target.value })} />
          <input className={input + " mt-2"} placeholder="caption (optional)" value={block.caption ?? ""} onChange={(e) => onChange({ ...block, caption: e.target.value })} />
        </>
      )}

      {block.kind === "sponsors" && (
        <div className="mt-2 space-y-1">
          {block.items.map((it, i) => (
            <div key={i} className="grid grid-cols-[3rem_2fr_2fr_auto] gap-1">
              <input className={input} value={it.emoji} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, emoji: e.target.value } : x) })} />
              <input className={input} placeholder="name" value={it.name} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, name: e.target.value } : x) })} />
              <input className={input} placeholder="https:// (optional)" value={it.url ?? ""} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, url: e.target.value } : x) })} />
              <button onClick={() => onChange({ ...block, items: block.items.filter((_, j) => i !== j) })} className="px-2 font-label text-xs text-marker-red">×</button>
            </div>
          ))}
          <button onClick={() => onChange({ ...block, items: [...block.items, { name: "new sponsor", emoji: "✨" }] })} className="font-label text-xs text-ink-soft underline">+ sponsor</button>
        </div>
      )}

      {block.kind === "poll" && (
        <div className="mt-2 space-y-2">
          <input className={input} placeholder="question" value={block.question} onChange={(e) => onChange({ ...block, question: e.target.value })} />
          {block.options.map((o, i) => (
            <div key={i} className="grid grid-cols-[1fr_5rem_auto] gap-1">
              <input className={input} placeholder="option label" value={o.label} onChange={(e) => onChange({ ...block, options: block.options.map((x, j) => i === j ? { ...x, label: e.target.value } : x) })} />
              <input type="number" min={0} className={input} value={o.votes} onChange={(e) => onChange({ ...block, options: block.options.map((x, j) => i === j ? { ...x, votes: Number(e.target.value) || 0 } : x) })} />
              <button onClick={() => onChange({ ...block, options: block.options.filter((_, j) => i !== j) })} className="px-2 font-label text-xs text-marker-red">×</button>
            </div>
          ))}
          <button onClick={() => onChange({ ...block, options: [...block.options, { label: "new option", votes: 0 }] })} className="font-label text-xs text-ink-soft underline">+ option</button>
        </div>
      )}

      {block.kind === "gallery" && (
        <div className="mt-2 space-y-1">
          {block.items.map((it, i) => (
            <div key={i} className="grid grid-cols-[3rem_1fr_5rem_auto] gap-1">
              <input className={input} value={it.emoji} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, emoji: e.target.value } : x) })} />
              <input className={input} placeholder="caption" value={it.caption} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, caption: e.target.value } : x) })} />
              <input type="number" min={0} max={360} className={input} value={it.hue} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, hue: Number(e.target.value) || 0 } : x) })} />
              <button onClick={() => onChange({ ...block, items: block.items.filter((_, j) => i !== j) })} className="px-2 font-label text-xs text-marker-red">×</button>
            </div>
          ))}
          <button onClick={() => onChange({ ...block, items: [...block.items, { emoji: "✨", caption: "new", hue: 200 }] })} className="font-label text-xs text-ink-soft underline">+ photo</button>
        </div>
      )}

      {block.kind === "merch" && (
        <div className="mt-2 space-y-1">
          {block.items.map((it, i) => (
            <div key={i} className="grid grid-cols-[3rem_1fr_1fr_1fr_auto] gap-1">
              <input className={input} value={it.emoji} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, emoji: e.target.value } : x) })} />
              <input className={input} placeholder="name" value={it.name} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, name: e.target.value } : x) })} />
              <input className={input} placeholder="price" value={it.price} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, price: e.target.value } : x) })} />
              <input className={input} placeholder="https://" value={it.url ?? ""} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, url: e.target.value } : x) })} />
              <button onClick={() => onChange({ ...block, items: block.items.filter((_, j) => i !== j) })} className="px-2 font-label text-xs text-marker-red">×</button>
            </div>
          ))}
          <button onClick={() => onChange({ ...block, items: [...block.items, { name: "new item", emoji: "🎁", price: "0.1 SOL" }] })} className="font-label text-xs text-ink-soft underline">+ item</button>
        </div>
      )}
    </div>
  );
}