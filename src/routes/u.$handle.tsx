import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { PaperPage, Polaroid, WashiTape, StickyNote, Highlight, MarkerUnderline, SmokeCurl, Stamp } from "@/components/notebook/primitives";
import { TipModal } from "@/components/notebook/TipModal";
import { getStreamer, STREAMERS } from "@/lib/mockData";
import { useDemoWallet } from "@/lib/useDemoWallet";
import { DEFAULT_SECTIONS, useConfig, HEADING_FONTS, newBlock, PAPER_TONES, useStreamerConfig, type Block, type BlockKind, type SectionKey } from "@/lib/useStreamerConfig";
import { InlineEdit } from "@/components/notebook/InlineEdit";
import { BlockRenderer } from "@/components/notebook/Blocks";
import { SEED_BLOCKS } from "@/lib/seedBlocks";

export const Route = createFileRoute("/u/$handle")({
  head: ({ params }) => {
    const s = getStreamer(params.handle);
    const name = s?.name ?? params.handle;
    return {
      meta: [
        { title: `${name} — tip on pufftip` },
        { name: "description", content: s?.tagline ?? "Tip this streamer in SOL with a note. Drawn by hand on pufftip." },
        { property: "og:title", content: `${name} on pufftip` },
        { property: "og:description", content: s?.bio ?? "Send SOL with a note. Their page on pufftip." },
      ],
    };
  },
  loader: ({ params }) => {
    const s = getStreamer(params.handle);
    if (!s) throw notFound();
    return { streamer: s };
  },
  notFoundComponent: () => (
    <PaperPage className="py-20 text-center">
      <h1 className="font-hand text-6xl">streamer not found</h1>
      <p className="mt-3 font-label text-ink-soft">that handle isn't on pufftip yet.</p>
      <Link to="/explore" className="mt-6 inline-block rounded-md border-2 border-ink bg-marker-yellow px-4 py-2 font-hand text-xl">browse streamers</Link>
    </PaperPage>
  ),
  errorComponent: ({ error }) => (
    <PaperPage className="py-20 text-center">
      <h1 className="font-hand text-4xl">page didn't load</h1>
      <p className="mt-2 font-label text-ink-soft">{error.message}</p>
    </PaperPage>
  ),
  component: StreamerPage,
});

const EMOJIS: Record<string, string> = {
  smokeyjazz: "🎸", ghostroast: "👻", lateshift: "💻", misokitchen: "🍜", zerogpete: "🚀", polaroid_kid: "📷",
};

function StreamerPage() {
  const { handle } = Route.useParams();
  const base = getStreamer(handle)!;
  const cfg = useConfig(base.handle);
  const update = useStreamerConfig((s) => s.update);
  const upsertBlock = useStreamerConfig((s) => s.upsertBlock);
  const removeBlock = useStreamerConfig((s) => s.removeBlock);
  const moveBlock = useStreamerConfig((s) => s.moveBlock);
  const ownerHandle = useStreamerConfig((s) => s.ownerHandle);
  const editMode = useStreamerConfig((s) => s.editMode);
  const setOwner = useStreamerConfig((s) => s.setOwner);
  const setEditMode = useStreamerConfig((s) => s.setEditMode);
  const owner = ownerHandle === base.handle && editMode;

  // merged streamer
  const streamer = {
    ...base,
    name: cfg.name ?? base.name,
    tagline: cfg.tagline ?? base.tagline,
    bio: cfg.bio ?? base.bio,
    avatarHue: cfg.avatarHue ?? base.avatarHue,
    game: cfg.game ?? base.game,
  };
  const avatarEmoji = cfg.avatarEmoji ?? EMOJIS[base.handle] ?? "🎤";

  const tips = useDemoWallet((s) => s.tipsByStreamer[streamer.handle] ?? []);
  const [open, setOpen] = useState(false);

  // top fans = aggregate by sender
  const fanMap = new Map<string, number>();
  for (const t of tips) fanMap.set(t.from, (fanMap.get(t.from) ?? 0) + t.amount);
  const topFans = [...fanMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  // theme overrides as inline CSS vars scoped to this page
  const accent = cfg.accentHue ?? 25;
  const paper = PAPER_TONES[cfg.paperTone ?? "cream"].oklch;
  const headingFamily = HEADING_FONTS[cfg.headingFont ?? "caveat"].family;
  const pageStyle = {
    ["--paper" as string]: paper,
    ["--marker-red" as string]: `oklch(0.62 0.22 ${accent})`,
    ["--ember" as string]: `oklch(0.72 0.2 ${(accent + 25) % 360})`,
    ["--font-hand" as string]: headingFamily,
  } as React.CSSProperties;

  const sections = cfg.sections ?? DEFAULT_SECTIONS;
  const visible = (k: SectionKey) => sections.find((s) => s.key === k)?.visible ?? true;

  // If the owner hasn't added custom blocks yet, fall back to the
  // streamer's seed content so the example profiles look fully alive.
  const blocksToShow: Block[] = (cfg.blocks ?? []).length > 0
    ? (cfg.blocks ?? [])
    : (SEED_BLOCKS[base.handle] ?? []);
  const showingSeed = (cfg.blocks ?? []).length === 0 && blocksToShow.length > 0;

  // goal progress
  const goalRaised = tips.reduce((a, b) => a + b.amount, 0);

  return (
    <PaperPage className="pb-12 pt-8" >
      <div style={pageStyle}>
      {/* Owner / edit bar */}
      <OwnerBar
        handle={base.handle}
        owner={owner}
        isOwnerHandle={ownerHandle === base.handle}
        onClaim={() => { setOwner(base.handle); setEditMode(true); }}
        onToggle={() => setEditMode(!editMode)}
      />

      {/* Header */}
      <div className="relative">
        <WashiTape color="pink" rotate={-8} className="left-1/4 -top-2" style={{ width: "10rem" }} />
        <WashiTape color="teal" rotate={5} className="right-12 -top-2" style={{ width: "7rem" }} />
        <div className="paper-card relative rounded-2xl p-6 sm:p-8">
          {streamer.live && <Stamp color="red" rotate={-10} className="absolute -right-3 -top-4">on air</Stamp>}
          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            <Polaroid hue={streamer.avatarHue} emoji={avatarEmoji} label={streamer.name} caption={`@${streamer.handle}`} size={180} rotate={-3} />
            <div className="flex-1">
              <div className="font-label text-sm text-ink-soft">
                streamer · <InlineEdit
                  value={streamer.game}
                  editable={owner}
                  onChange={(v) => update(base.handle, { game: v })}
                  maxLength={40}
                  suggestions={["just chatting","variety gaming","lo-fi & code","art & illustration","cooking IRL","music production"]}
                  hint="what you mostly stream — a vibe, not a title"
                />
              </div>
              <h1 className="mt-1 font-hand text-6xl text-ink sm:text-7xl">
                <Highlight>
                  <InlineEdit value={streamer.name} editable={owner} onChange={(v) => update(base.handle, { name: v })} maxLength={32} hint="your display name — keep it short and punchy" />
                </Highlight>
              </h1>
              <p className="mt-1 font-hand text-2xl text-ink-soft">
                <InlineEdit
                  value={streamer.tagline}
                  editable={owner}
                  onChange={(v) => update(base.handle, { tagline: v })}
                  maxLength={80}
                  suggestions={["lo-fi nights, loud opinions","cozy gamer, big feelings","midnight ramen + midnight code","building things, vibing loud"]}
                  hint="one line. what you're about."
                />
              </p>
              <p className="mt-3 max-w-xl font-label text-lg text-ink">
                <InlineEdit
                  value={streamer.bio}
                  editable={owner}
                  onChange={(v) => update(base.handle, { bio: v })}
                  multiline
                  maxLength={280}
                  suggestions={["streamer + maker. tips fund snacks, song requests, and the occasional new mic.","welcome in. grab a seat, leave a note, tip if it hits."]}
                  hint="2–3 sentences. cmd/ctrl+enter to save."
                />
              </p>
              <div className="mt-4 flex flex-wrap gap-4 font-label text-sm text-ink-soft">
                <span><strong className="font-mono text-ink">{streamer.totalReceived.toFixed(1)}</strong> SOL received</span>
                <span><strong className="font-mono text-ink">{streamer.followers}</strong> fans</span>
                <span><strong className="font-mono text-ink">{tips.length}</strong> tips on the wall</span>
                {base.pronouns && <span>· {base.pronouns}</span>}
                {base.city && <span>· {base.city}</span>}
                {base.joinedAgo && <span>· {base.joinedAgo}</span>}
              </div>
              {base.achievements && base.achievements.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {base.achievements.map((a: { emoji: string; label: string }, i: number) => (
                    <span
                      key={a.label}
                      className="rounded-full border-2 border-dashed border-ink/40 bg-paper px-2.5 py-0.5 font-label text-xs text-ink"
                      style={{ transform: `rotate(${(i % 2 === 0 ? -0.8 : 0.8)}deg)` }}
                    >
                      <span className="mr-1">{a.emoji}</span>{a.label}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={() => setOpen(true)} className="rotate-doodle-1 rounded-md border-2 border-ink bg-marker-red px-5 py-2.5 font-hand text-2xl text-paper shadow-sticker">
                  send a puff ✈️
                </button>
                <Link to="/u/$handle/wishlist" params={{ handle: streamer.handle }} className="rotate-doodle-2 rounded-md border-2 border-ink bg-marker-yellow px-5 py-2.5 font-hand text-2xl text-ink shadow-sticker">
                  see wishlist →
                </Link>
              </div>
            </div>
            <SmokeCurl className="absolute right-6 top-6 hidden h-20 w-12 md:block" />
          </div>
        </div>
      </div>

      {/* Goal bar */}
      {cfg.goalLabel && (cfg.goalAmount ?? 0) > 0 && (
        <div className="mt-8 paper-card rounded-xl p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-hand text-3xl text-ink">
              goal: <Highlight><InlineEdit value={cfg.goalLabel} editable={owner} onChange={(v) => update(base.handle, { goalLabel: v })} /></Highlight>
            </h3>
            <div className="font-mono text-sm text-ink">{goalRaised.toFixed(2)} / {(cfg.goalAmount ?? 0).toFixed(2)} SOL</div>
          </div>
          <div className="mt-3 h-6 w-full overflow-hidden rounded-full border-2 border-ink bg-paper">
            <div className="h-full" style={{ width: `${Math.min(100, (goalRaised / (cfg.goalAmount || 1)) * 100)}%`, background: "repeating-linear-gradient(45deg, var(--marker-red) 0 10px, oklch(0.55 0.22 25) 10px 20px)" }} />
          </div>
        </div>
      )}

      {/* Custom blocks (above main grid) */}
      {blocksToShow.length > 0 && (
        <div className="mt-10 space-y-5">
          {showingSeed && owner && (
            <p className="rounded-md border-2 border-dashed border-marker-blue/40 bg-card px-3 py-2 font-label text-xs text-ink-soft">
              showing example blocks for this streamer — add or edit a block below to make this page truly yours.
            </p>
          )}
          {blocksToShow.map((b, i, arr) => (
            <div key={b.id} className="relative">
              <BlockRenderer block={b} />
              {owner && !showingSeed && (
                <BlockOwnerControls
                  block={b}
                  onChange={(nb) => upsertBlock(base.handle, nb)}
                  onRemove={() => removeBlock(base.handle, b.id)}
                  onUp={() => moveBlock(base.handle, b.id, -1)}
                  onDown={() => moveBlock(base.handle, b.id, 1)}
                  isFirst={i === 0}
                  isLast={i === arr.length - 1}
                />
              )}
            </div>
          ))}
          {showingSeed && owner && (
            <button
              onClick={() => {
                for (const b of blocksToShow) upsertBlock(base.handle, b);
              }}
              className="rotate-doodle-1 rounded-md border-2 border-ink bg-marker-green px-3 py-1.5 font-hand text-xl text-paper shadow-sticker"
            >
              ↓ copy these examples into my page
            </button>
          )}
        </div>
      )}
      {owner && (
        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-md border-2 border-dashed border-marker-blue/50 bg-card p-3">
          <span className="font-label text-xs uppercase text-ink-soft">+ add block:</span>
          {(["announcement","schedule","links","faq","video","sponsors","text","poll","gallery","merch","socials","countdown","testimonials","newsletter","embed","guestbook"] as BlockKind[]).map((k) => (
            <button key={k} onClick={() => upsertBlock(base.handle, newBlock(k))} className="rounded-md border-2 border-ink bg-paper px-2 py-1 font-hand text-base text-ink hover:bg-marker-yellow">{k}</button>
          ))}
        </div>
      )}

      <div className="mt-12 grid gap-10 lg:grid-cols-[2fr_1fr]">
        {/* Tip Wall */}
        {visible("tipWall") && <div>
          <div className="flex items-end justify-between">
            <h2 className="font-hand text-4xl text-ink"><MarkerUnderline>the tip wall</MarkerUnderline></h2>
            <span className="font-label text-sm text-ink-soft">pinned by viewers, in real time</span>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {tips.length === 0 && (
              <StickyNote color="yellow" rotate={-2}>
                <div className="font-hand text-2xl text-ink">no tips yet</div>
                <p className="mt-1 font-label text-base text-ink">be the first to leave a note.</p>
              </StickyNote>
            )}
            {tips.map((t, i) => (
              <StickyNote
                key={t.id}
                color={t.color ?? "yellow"}
                rotate={(i % 2 === 0 ? -1 : 1) * (1 + (i % 3))}
                className="break-words"
              >
                <div className="flex items-baseline justify-between font-label text-xs text-ink-soft">
                  <span>@{t.from}</span>
                  <span className="font-mono text-sm text-ink">{t.amount.toFixed(2)} SOL</span>
                </div>
                <div className="mt-1.5 font-hand text-2xl leading-tight text-ink">{t.message}</div>
                <div className="mt-2 font-label text-[11px] text-ink-soft">{t.ago}</div>
              </StickyNote>
            ))}
          </div>
        </div>}

        {/* Sidebar — top fans + quick tip */}
        <div className="space-y-8">
          {visible("topFans") && <div className="paper-card rounded-xl p-5">
            <h3 className="font-hand text-3xl text-ink">top fans 🏆</h3>
            {topFans.length === 0 ? (
              <p className="mt-2 font-label text-sm text-ink-soft">no fans yet — be the first.</p>
            ) : (
              <ol className="mt-3 space-y-2">
                {topFans.map(([name, amt], i) => (
                  <li key={name} className="flex items-center gap-3 border-b border-dashed border-ink/15 pb-2 last:border-0 last:pb-0">
                    <span className={`grid size-8 place-items-center rounded-full border-2 border-ink font-hand text-lg ${i === 0 ? "bg-marker-yellow" : i === 1 ? "bg-paper-deep" : i === 2 ? "bg-ember/40" : "bg-paper"}`}>{i + 1}</span>
                    <span className="flex-1 font-hand text-xl text-ink">@{name}</span>
                    <span className="font-mono text-sm text-ink">{amt.toFixed(2)}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>}

          {visible("quickTip") && <div className="paper-card rounded-xl p-5">
            <h3 className="font-hand text-3xl text-ink">quick tip</h3>
            <p className="mt-1 font-label text-sm text-ink-soft">pre-set amounts. no fuss.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(cfg.quickAmounts && cfg.quickAmounts.length ? cfg.quickAmounts : [0.1, 0.5, 1, 2.5]).slice(0, 6).map((a) => (
                <button key={a} onClick={() => setOpen(true)} className="rounded-md border-2 border-ink bg-paper py-3 font-hand text-2xl text-ink hover:bg-marker-yellow">
                  {a} SOL
                </button>
              ))}
            </div>
          </div>}

          {/* other streamers */}
          {visible("alsoOn") && <div>
            <h3 className="font-hand text-2xl text-ink">also on pufftip</h3>
            <div className="mt-3 space-y-2">
              {STREAMERS.filter((s) => s.handle !== streamer.handle).slice(0, 3).map((s) => (
                <Link key={s.handle} to="/u/$handle" params={{ handle: s.handle }} className="flex items-center gap-3 rounded-md border-2 border-dashed border-ink/30 bg-card p-2 hover:border-marker-red">
                  <Polaroid hue={s.avatarHue} emoji={EMOJIS[s.handle] ?? "🎤"} size={44} rotate={-2} tape={false} />
                  <div>
                    <div className="font-hand text-lg text-ink">{s.name}</div>
                    <div className="font-label text-xs text-ink-soft">@{s.handle}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>}
        </div>
      </div>

      <TipModal streamer={streamer} open={open} onClose={() => setOpen(false)} />
      </div>
    </PaperPage>
  );
}

function OwnerBar({ handle, owner, isOwnerHandle, onClaim, onToggle }: { handle: string; owner: boolean; isOwnerHandle: boolean; onClaim: () => void; onToggle: () => void }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-md border-2 border-dashed border-ink/30 bg-card px-3 py-2">
      <div className="font-label text-sm text-ink-soft">
        {owner ? <>you're editing <strong>@{handle}</strong> — click any text to change it.</> : <>viewing as a fan. tweak this page in the dashboard or claim it now.</>}
      </div>
      <div className="flex flex-wrap gap-2">
        {!isOwnerHandle && (
          <button onClick={onClaim} className="rounded-md border-2 border-ink bg-marker-yellow px-2 py-1 font-hand text-base text-ink">✎ edit this page</button>
        )}
        {isOwnerHandle && (
          <button onClick={onToggle} className={`rounded-md border-2 border-ink px-2 py-1 font-hand text-base ${owner ? "bg-marker-green text-paper" : "bg-paper text-ink"}`}>
            {owner ? "editing · click to finish" : "✎ resume editing"}
          </button>
        )}
        <Link to="/dashboard" className="rounded-md border-2 border-dashed border-ink/40 px-2 py-1 font-label text-sm text-ink hover:border-ink">dashboard →</Link>
      </div>
    </div>
  );
}

function BlockOwnerControls({ block, onChange, onRemove, onUp, onDown, isFirst, isLast }: { block: Block; onChange: (b: Block) => void; onRemove: () => void; onUp: () => void; onDown: () => void; isFirst: boolean; isLast: boolean }) {
  return (
    <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-md border-2 border-ink bg-paper p-1 shadow-sticker">
      <span className="px-1 font-label text-[10px] uppercase text-ink-soft">{block.kind}</span>
      <button disabled={isFirst} onClick={onUp} className="rounded border border-ink/30 px-1.5 text-sm disabled:opacity-30 hover:border-ink">↑</button>
      <button disabled={isLast} onClick={onDown} className="rounded border border-ink/30 px-1.5 text-sm disabled:opacity-30 hover:border-ink">↓</button>
      <EditInline block={block} onChange={onChange} />
      <button onClick={onRemove} className="rounded border border-marker-red/50 px-1.5 text-xs text-marker-red hover:bg-marker-red hover:text-paper">✕</button>
    </div>
  );
}

function EditInline({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded border border-ink/40 px-1.5 text-xs hover:border-ink">edit</button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4" onClick={() => setOpen(false)}>
          <div className="w-[min(560px,calc(100vw-2rem))] rounded-xl bg-card p-4 shadow-paper" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between">
              <div className="font-hand text-2xl text-ink">edit {block.kind}</div>
              <button onClick={() => setOpen(false)} className="font-hand text-xl text-ink-soft">✕</button>
            </div>
            <BlockQuickForm block={block} onChange={onChange} />
          </div>
        </div>
      )}
    </>
  );
}

function BlockQuickForm({ block, onChange }: { block: Block; onChange: (b: Block) => void }) {
  const cls = "w-full rounded-md border-2 border-dashed border-ink/40 bg-paper px-2 py-1 font-label text-ink outline-none focus:border-marker-blue";
  const wrap = (children: ReactNode) => <div className="space-y-2">{children}</div>;
  switch (block.kind) {
    case "announcement":
      return wrap(<>
        <input className={cls} value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} />
        <textarea className={cls + " min-h-[100px]"} value={block.body} onChange={(e) => onChange({ ...block, body: e.target.value })} />
        <div className="flex gap-2">
          {(["yellow","pink","teal","green"] as const).map((c) => (
            <button key={c} onClick={() => onChange({ ...block, color: c })} className={`rounded-full border-2 px-2 py-0.5 font-label text-xs ${block.color === c ? "border-ink" : "border-ink/30"}`}>{c}</button>
          ))}
        </div>
      </>);
    case "text":
      return wrap(<>
        <input className={cls} value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} />
        <textarea className={cls + " min-h-[120px]"} value={block.body} onChange={(e) => onChange({ ...block, body: e.target.value })} />
      </>);
    case "video":
      return wrap(<>
        <input className={cls} value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} />
        <input className={cls} placeholder="youtube id" value={block.youtubeId} onChange={(e) => onChange({ ...block, youtubeId: e.target.value })} />
        <input className={cls} placeholder="caption" value={block.caption ?? ""} onChange={(e) => onChange({ ...block, caption: e.target.value })} />
      </>);
    case "links":
      return wrap(<>
        <input className={cls} value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} />
        {block.items.map((it, i) => (
          <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-1">
            <input className={cls} value={it.label} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, label: e.target.value } : x) })} />
            <input className={cls} value={it.url} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, url: e.target.value } : x) })} />
            <button onClick={() => onChange({ ...block, items: block.items.filter((_, j) => i !== j) })} className="px-2 text-marker-red">×</button>
          </div>
        ))}
        <button onClick={() => onChange({ ...block, items: [...block.items, { label: "site", url: "https://" }] })} className="font-label text-xs text-ink-soft underline">+ link</button>
      </>);
    case "schedule":
      return wrap(<>
        <input className={cls} value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} />
        {block.rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[3rem_4rem_1fr_auto] gap-1">
            <input className={cls} value={r.day} onChange={(e) => onChange({ ...block, rows: block.rows.map((x, j) => i === j ? { ...x, day: e.target.value } : x) })} />
            <input className={cls} value={r.time} onChange={(e) => onChange({ ...block, rows: block.rows.map((x, j) => i === j ? { ...x, time: e.target.value } : x) })} />
            <input className={cls} value={r.what} onChange={(e) => onChange({ ...block, rows: block.rows.map((x, j) => i === j ? { ...x, what: e.target.value } : x) })} />
            <button onClick={() => onChange({ ...block, rows: block.rows.filter((_, j) => i !== j) })} className="px-2 text-marker-red">×</button>
          </div>
        ))}
        <button onClick={() => onChange({ ...block, rows: [...block.rows, { day: "sun", time: "8pm", what: "vibes" }] })} className="font-label text-xs text-ink-soft underline">+ row</button>
      </>);
    case "faq":
      return wrap(<>
        <input className={cls} value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} />
        {block.items.map((it, i) => (
          <div key={i} className="rounded border border-dashed border-ink/30 p-2">
            <input className={cls} placeholder="Q" value={it.q} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, q: e.target.value } : x) })} />
            <textarea className={cls + " mt-1"} placeholder="A" value={it.a} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, a: e.target.value } : x) })} />
            <button onClick={() => onChange({ ...block, items: block.items.filter((_, j) => i !== j) })} className="text-xs text-marker-red">remove</button>
          </div>
        ))}
        <button onClick={() => onChange({ ...block, items: [...block.items, { q: "new?", a: "yes" }] })} className="font-label text-xs text-ink-soft underline">+ q&a</button>
      </>);
    case "sponsors":
      return wrap(<>
        <input className={cls} value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} />
        {block.items.map((it, i) => (
          <div key={i} className="grid grid-cols-[3rem_2fr_2fr_auto] gap-1">
            <input className={cls} value={it.emoji} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, emoji: e.target.value } : x) })} />
            <input className={cls} value={it.name} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, name: e.target.value } : x) })} />
            <input className={cls} value={it.url ?? ""} onChange={(e) => onChange({ ...block, items: block.items.map((x, j) => i === j ? { ...x, url: e.target.value } : x) })} />
            <button onClick={() => onChange({ ...block, items: block.items.filter((_, j) => i !== j) })} className="px-2 text-marker-red">×</button>
          </div>
        ))}
        <button onClick={() => onChange({ ...block, items: [...block.items, { name: "new", emoji: "✨" }] })} className="font-label text-xs text-ink-soft underline">+ sponsor</button>
      </>);
  }
}
