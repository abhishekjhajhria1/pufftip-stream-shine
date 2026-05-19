import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BlockKind =
  | "announcement"
  | "schedule"
  | "links"
  | "faq"
  | "video"
  | "sponsors"
  | "text";

export type Block =
  | { id: string; kind: "announcement"; title: string; body: string; color: "yellow" | "pink" | "teal" | "green" }
  | { id: string; kind: "schedule"; title: string; rows: { day: string; time: string; what: string }[] }
  | { id: string; kind: "links"; title: string; items: { label: string; url: string }[] }
  | { id: string; kind: "faq"; title: string; items: { q: string; a: string }[] }
  | { id: string; kind: "video"; title: string; youtubeId: string; caption?: string }
  | { id: string; kind: "sponsors"; title: string; items: { name: string; emoji: string; url?: string }[] }
  | { id: string; kind: "text"; title: string; body: string };

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
  }
}