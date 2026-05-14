# Pufftip — Hand-Drawn Notebook Universe

A complete identity reset. Pufftip stops looking like another neon crypto dashboard and becomes a **streamer's marked-up notebook**: cream paper, ink scribbles, doodled arrows, washi-tape UI, marker highlights, polaroid avatars, and a curling smoke trail mascot drawn in pen. Every screen feels handmade, like the streamer literally sketched their own tip page.

## Visual identity

- **Surface:** warm paper `oklch(0.96 0.02 85)` with subtle grain + faint blue ruled lines and red margin line on key sections
- **Ink:** near-black `oklch(0.18 0.02 260)` for body, used like a ballpoint pen
- **Marker accents:** highlighter yellow, marker red, sky-blue underline, ember orange (the lit-cig nod stays)
- **Type:** `Caveat` / `Kalam` for handwritten headlines, `Patrick Hand` for UI labels, `JetBrains Mono` only for wallet addresses + tx hashes (looks like a sticker)
- **Decoration:** SVG doodles (arrows, stars, smoke curls, hearts, dollar squiggles), washi-tape strips holding cards down, paper-clip icons, sticker badges with slight rotation, taped polaroid avatars
- **Motion:** hand-drawn stroke-in on headlines, paper rustle on hover, cards wobble on tap, smoke trail follows tip animations, sticker peel on click
- **Sound of design:** asymmetric, rotated 1–3°, nothing perfectly aligned — humanity over grid

## Pages (file-based routing under `src/routes/`)

1. **`/` — Home.** Notebook cover. Big hand-lettered "Pufftip" with smoke curl, taped polaroid of a streamer, doodled "how it works" in 3 panels, scribbled live tip ticker on a torn paper strip, footer drawn as notebook spiral.
2. **`/u/$handle` — Streamer landing page.** The streamer's own page. Polaroid header w/ washi tape, bio in marker, **Tip Wall** (sticky-note messages from fans pinned with thumbtacks), **Top Fans leaderboard** as a doodled podium, **recent tips feed** as notebook entries with timestamps, big "Send a Puff" CTA shaped like a lit match.
3. **`/u/$handle/wishlist` — Goals & Wishlist.** Streamer-curated items they want money for: new mic, rent, smoke break, a kebab. Each item is a torn-paper card with a doodled progress bar (filled with marker strokes), photo polaroid of the item, and "Chip in" button. Demo-tippable.
4. **`/explore` — Discover.** Trending streamers as a corkboard: pinned polaroids at angles, sticker badges ("ON AIR", "🔥 HOT"), live tip ticker on a paper-strip banner, leaderboards as a marker-drawn ranking sheet.
5. **`/obs` — OBS setup docs.** Drawn like a hand-illustrated zine tutorial. Numbered circles, arrows pointing at screenshot mockups taped onto the page, "tip from a friend" margin notes.
6. **`/pricing` — Fees.** Transparent breakdown drawn as a receipt taped to the page, with a doodled calculator and "no hidden BS" stamp.
7. **`/dashboard` — Cockpit preview (no auth).** The streamer's notebook flipped to the analytics page: hand-drawn bar chart with marker fills, tip log as journal entries, a doodled OBS overlay sticker, "switch to demo data" toggle as a paper tab.

## Fake-wallet demo system

A global `useDemoWallet()` hook (Zustand) gives every visitor a pretend balance of 5 SOL on first load. Every tip CTA opens a sticky-note modal where the user picks an amount + writes a message. On confirm:
- balance decrements, tip animates as a paper airplane flying into the recipient's wall
- new sticky note pops onto the streamer's tip wall in real time (local state)
- top fans leaderboard re-ranks with a wobble animation
- a small "Demo mode — connect a wallet to send for real" ribbon stays pinned bottom-right
A "Connect Wallet" button in the header is decorative for now (opens a "coming soon" sticky note); the whole site is fully explorable.

## Technical plan

- **Design tokens (`src/styles.css`):** replace neon-cockpit palette with paper/ink/marker tokens in `oklch`. Add `--paper`, `--ink`, `--marker-red`, `--marker-yellow`, `--marker-blue`, `--ember`, `--washi-*`. Add `font-hand`, `font-label`, `font-mono` families. Add utilities: `.paper-grain`, `.ruled-lines`, `.washi-tape`, `.rotate-doodle-{1,2,3}`, `.ink-stroke`, animations: `draw-in`, `paper-wobble`, `sticker-peel`, `paper-airplane`, `marker-fill`.
- **Fonts:** add Caveat, Kalam, Patrick Hand to `__root.tsx` head.
- **Shared components (`src/components/notebook/`):**
  - `PaperPage` (page wrapper w/ ruled lines + margin)
  - `WashiTape`, `Polaroid`, `StickyNote`, `TornPaper`, `DoodleArrow`, `MarkerUnderline`, `SmokeCurl`, `PaperClip`
  - `TipModal` (sticky-note styled), `DemoBalanceChip`, `TipWall`, `TopFansPodium`, `WishlistItem`, `LiveTicker`
  - `SiteHeader` (notebook spine nav with Link, marker underline on active route via `activeProps`), `SiteFooter`
- **State:** `src/lib/useDemoWallet.ts` (Zustand) — balance, tips sent, addTip(streamer, amount, msg). `src/lib/mockData.ts` — streamers, wishlists, tip history.
- **Routes:** create the 7 route files above. Each gets unique `head()` with title/description/og:title/og:description. Streamer profile uses `$handle` param; wishlist nests as `u.$handle.wishlist.tsx`.
- **Root layout (`__root.tsx`):** paper background, header w/ doodled logo + nav, demo balance chip, "Connect Wallet" sticky button, footer; wraps `<Outlet />`.
- **Index cleanup:** strip current single-page sections; redistribute relevant content (overlay preview → `/obs`, dashboard → `/dashboard`, etc.).

## Out of scope (this round)

- Real Solana wallet integration (Phantom, etc.) — header button is decorative
- Backend/Lovable Cloud — all data is local mock + Zustand
- Auth, real OBS websocket, real tx — all simulated for the demo

After approval I'll build it in one pass: tokens + fonts → shared notebook components + demo-wallet store → 7 routes → polish (animations, doodles, responsive tuning at 411px).