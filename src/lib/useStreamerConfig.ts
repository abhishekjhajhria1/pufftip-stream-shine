import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BlockKind =
  | "announcement"
  | "schedule"
  | "links"
  | "faq"
  | "video"
  | "sponsors"
  | "text"
  | "poll"
  | "gallery"
  | "merch"
  | "socials"
  | "countdown"
  | "testimonials"
  | "newsletter"
  | "embed"
  | "guestbook";

export type Block =
  | { id: string; kind: "announcement"; title: string; body: string; color: "yellow" | "pink" | "teal" | "green" }
  | { id: string; kind: "schedule"; title: string; rows: { day: string; time: string; what: string }[] }
  | { id: string; kind: "links"; title: string; items: { label: string; url: string }[] }
  | { id: string; kind: "faq"; title: string; items: { q: string; a: string }[] }
  | { id: string; kind: "video"; title: string; youtubeId: string; caption?: string }
  | { id: string; kind: "sponsors"; title: string; items: { name: string; emoji: string; url?: string }[] }
  | { id: string; kind: "text"; title: string; body: string }
  | { id: string; kind: "poll"; title: string; question: string; options: { label: string; votes: number }[] }
  | { id: string; kind: "gallery"; title: string; items: { emoji: string; caption: string; hue: number }[] }
  | { id: string; kind: "merch"; title: string; items: { name: string; emoji: string; price: string; url?: string }[] }
  | { id: string; kind: "socials"; title: string; items: { platform: "twitch" | "youtube" | "twitter" | "instagram" | "tiktok" | "discord" | "kick" | "github"; handle: string; url: string }[] }
  | { id: string; kind: "countdown"; title: string; label: string; targetISO: string }
  | { id: string; kind: "testimonials"; title: string; items: { from: string; quote: string; color?: "yellow" | "pink" | "teal" | "green" }[] }
  | { id: string; kind: "newsletter"; title: string; pitch: string; cta: string; placeholder: string }
  | { id: string; kind: "embed"; title: string; provider: "twitch" | "youtube" | "spotify" | "soundcloud" | "iframe"; src: string; caption?: string }
  | { id: string; kind: "guestbook"; title: string; prompt: string; cta: string; samples: { from: string; note: string }[] };

export type SectionKey = "tipWall" | "topFans" | "quickTip" | "alsoOn";

export type StreamerConfig = {
  // profile overrides
  name?: string;
  tagline?: string;
  bio?: string;
  avatarEmoji?: string;
  avatarHue?: number;
  game?: string;
  // theme
  accentHue?: number; // 0..360 — drives marker-red CSS var on this page
  paperTone?: "cream" | "ivory" | "mint" | "rose" | "sky";
  headingFont?: "caveat" | "kalam" | "patrick" | "shadows" | "indie";
  // tip settings
  quickAmounts?: number[];
  minTip?: number;
  thankYouMessage?: string;
  goalLabel?: string;
  goalAmount?: number; // SOL
  // sections
  sections?: { key: SectionKey; visible: boolean }[];
  // content blocks (ordered)
  blocks?: Block[];
};

type State = {
  configs: Record<string, StreamerConfig>;
  ownerHandle: string | null; // which streamer the demo user "owns"
  editMode: boolean;
  setOwner: (handle: string | null) => void;
  setEditMode: (on: boolean) => void;
  update: (handle: string, patch: Partial<StreamerConfig>) => void;
  upsertBlock: (handle: string, block: Block) => void;
  removeBlock: (handle: string, id: string) => void;
  moveBlock: (handle: string, id: string, dir: -1 | 1) => void;
  reset: (handle: string) => void;
};

export const DEFAULT_SECTIONS: { key: SectionKey; visible: boolean }[] = [
  { key: "tipWall", visible: true },
  { key: "topFans", visible: true },
  { key: "quickTip", visible: true },
  { key: "alsoOn", visible: true },
];

export const DEFAULT_CONFIG: StreamerConfig = {
  accentHue: 25,
  paperTone: "cream",
  headingFont: "caveat",
  quickAmounts: [0.1, 0.5, 1, 2.5],
  minTip: 0.01,
  thankYouMessage: "thanks for the puff ✈️",
  goalLabel: "",
  goalAmount: 0,
  sections: DEFAULT_SECTIONS,
  blocks: [],
};

/** One-click theme presets — applied to a streamer's accent + paper + font in one go. */
export const THEME_PRESETS: Array<{
  id: string;
  label: string;
  accentHue: number;
  paperTone: NonNullable<StreamerConfig["paperTone"]>;
  headingFont: NonNullable<StreamerConfig["headingFont"]>;
  swatch: string;
}> = [
  { id: "ember",    label: "ember",     accentHue: 25,  paperTone: "cream", headingFont: "caveat",  swatch: "oklch(0.62 0.22 25)" },
  { id: "neon",     label: "neon mint", accentHue: 155, paperTone: "mint",  headingFont: "kalam",   swatch: "oklch(0.62 0.22 155)" },
  { id: "rosewax",  label: "rose wax",  accentHue: 350, paperTone: "rose",  headingFont: "shadows", swatch: "oklch(0.62 0.22 350)" },
  { id: "ocean",    label: "ocean",     accentHue: 230, paperTone: "sky",   headingFont: "patrick", swatch: "oklch(0.62 0.22 230)" },
  { id: "vintage",  label: "vintage",   accentHue: 50,  paperTone: "ivory", headingFont: "indie",   swatch: "oklch(0.62 0.22 50)" },
  { id: "noir",     label: "noir",      accentHue: 280, paperTone: "ivory", headingFont: "shadows", swatch: "oklch(0.55 0.22 280)" },
];

export function getConfig(map: Record<string, StreamerConfig>, handle: string): StreamerConfig {
  return { ...DEFAULT_CONFIG, ...(map[handle] ?? {}) };
}

export const PAPER_TONES: Record<NonNullable<StreamerConfig["paperTone"]>, { label: string; oklch: string }> = {
  cream: { label: "warm cream", oklch: "oklch(0.96 0.02 85)" },
  ivory: { label: "ivory", oklch: "oklch(0.98 0.01 90)" },
  mint: { label: "mint paper", oklch: "oklch(0.95 0.04 155)" },
  rose: { label: "rose paper", oklch: "oklch(0.94 0.04 20)" },
  sky: { label: "sky paper", oklch: "oklch(0.95 0.03 230)" },
};

export const HEADING_FONTS: Record<NonNullable<StreamerConfig["headingFont"]>, { label: string; family: string }> = {
  caveat: { label: "Caveat", family: "'Caveat', cursive" },
  kalam: { label: "Kalam", family: "'Kalam', cursive" },
  patrick: { label: "Patrick Hand", family: "'Patrick Hand', cursive" },
  shadows: { label: "Shadows Into Light", family: "'Shadows Into Light', cursive" },
  indie: { label: "Indie Flower", family: "'Indie Flower', cursive" },
};

export const useStreamerConfig = create<State>()(
  persist(
    (set, get) => ({
      configs: {},
      ownerHandle: null,
      editMode: false,
      setOwner: (handle) => set({ ownerHandle: handle }),
      setEditMode: (on) => set({ editMode: on }),
      update: (handle, patch) =>
        set({
          configs: {
            ...get().configs,
            [handle]: { ...DEFAULT_CONFIG, ...(get().configs[handle] ?? {}), ...patch },
          },
        }),
      upsertBlock: (handle, block) => {
        const cur = get().configs[handle] ?? {};
        const blocks = cur.blocks ?? [];
        const idx = blocks.findIndex((b) => b.id === block.id);
        const next = idx >= 0 ? blocks.map((b) => (b.id === block.id ? block : b)) : [...blocks, block];
        get().update(handle, { blocks: next });
      },
      removeBlock: (handle, id) => {
        const cur = get().configs[handle] ?? {};
        const blocks = (cur.blocks ?? []).filter((b) => b.id !== id);
        get().update(handle, { blocks });
      },
      moveBlock: (handle, id, dir) => {
        const cur = get().configs[handle] ?? {};
        const blocks = [...(cur.blocks ?? [])];
        const i = blocks.findIndex((b) => b.id === id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= blocks.length) return;
        [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
        get().update(handle, { blocks });
      },
      reset: (handle) => {
        const { [handle]: _drop, ...rest } = get().configs;
        set({ configs: rest });
      },
    }),
    { name: "pufftip-streamer-config" },
  ),
);

export function newBlock(kind: BlockKind): Block {
  const id = `b_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  switch (kind) {
    case "announcement":
      return { id, kind, title: "heads up", body: "stream tonight at 9pm, bring snacks", color: "yellow" };
    case "schedule":
      return {
        id, kind, title: "stream schedule",
        rows: [
          { day: "mon", time: "8pm", what: "chill coding" },
          { day: "wed", time: "9pm", what: "ramen night" },
          { day: "fri", time: "10pm", what: "long stream" },
        ],
      };
    case "links":
      return {
        id, kind, title: "find me elsewhere",
        items: [
          { label: "twitch", url: "https://twitch.tv/" },
          { label: "youtube", url: "https://youtube.com/" },
          { label: "twitter", url: "https://twitter.com/" },
        ],
      };
    case "faq":
      return {
        id, kind, title: "frequently asked",
        items: [
          { q: "what gear do you use?", a: "shure sm7b, focusrite, beat-up thinkpad." },
          { q: "can i request a song?", a: "yes — drop it in your tip note." },
        ],
      };
    case "video":
      return { id, kind, title: "watch this", youtubeId: "dQw4w9WgXcQ", caption: "a recent highlight" };
    case "sponsors":
      return {
        id, kind, title: "supported by",
        items: [
          { name: "Lo-fi Beans Co.", emoji: "☕" },
          { name: "Pixel Pals", emoji: "🎮" },
        ],
      };
    case "text":
      return { id, kind, title: "a note", body: "write whatever you want here. markdown isn't supported but vibes are." };
    case "poll":
      return {
        id, kind, title: "tonight's vote",
        question: "what should i play next?",
        options: [
          { label: "factorio", votes: 4 },
          { label: "elden ring", votes: 7 },
          { label: "just chat", votes: 2 },
        ],
      };
    case "gallery":
      return {
        id, kind, title: "stream highlights",
        items: [
          { emoji: "🎮", caption: "boss fight", hue: 280 },
          { emoji: "🍜", caption: "ramen night", hue: 60 },
          { emoji: "🎸", caption: "lo-fi set", hue: 25 },
          { emoji: "📷", caption: "irl walk", hue: 320 },
        ],
      };
    case "merch":
      return {
        id, kind, title: "merch shelf",
        items: [
          { name: "tour tee", emoji: "👕", price: "0.4 SOL" },
          { name: "sticker pack", emoji: "🪧", price: "0.05 SOL" },
          { name: "signed poster", emoji: "🖼️", price: "1.2 SOL" },
        ],
      };
    case "socials":
      return {
        id, kind, title: "find me everywhere",
        items: [
          { platform: "twitch",    handle: "yourname", url: "https://twitch.tv/yourname" },
          { platform: "youtube",   handle: "@yourname", url: "https://youtube.com/@yourname" },
          { platform: "twitter",   handle: "@yourname", url: "https://twitter.com/yourname" },
          { platform: "discord",   handle: "join the server", url: "https://discord.gg/" },
        ],
      };
    case "countdown": {
      const t = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3); // ~3 days from now
      return { id, kind, title: "next stream in", label: "doors open 8pm", targetISO: t.toISOString() };
    }
    case "testimonials":
      return {
        id, kind, title: "kind words",
        items: [
          { from: "miso",   quote: "best chill streams on the internet, no notes.", color: "yellow" },
          { from: "ghostr", quote: "i came for the lo-fi, stayed for the rambling.", color: "pink" },
          { from: "anon",   quote: "tipped once, became a person.", color: "teal" },
        ],
      };
    case "newsletter":
      return {
        id, kind, title: "join the mailing list",
        pitch: "monthly-ish dispatch: stream dates, song picks, behind-the-scenes mess.",
        cta: "sign me up",
        placeholder: "you@inbox.com",
      };
    case "embed":
      return {
        id, kind, title: "live & loud",
        provider: "twitch",
        src: "yourname",
        caption: "drop in if i'm live, lurk if i'm not.",
      };
    case "guestbook":
      return {
        id, kind, title: "sign the guestbook",
        prompt: "leave a note. say hi. tell me what you're working on.",
        cta: "scribble a note",
        samples: [
          { from: "noodle", note: "first time here. love the vibe." },
          { from: "ren", note: "the friday lo-fi sets carried me through finals." },
        ],
      };
  }
}