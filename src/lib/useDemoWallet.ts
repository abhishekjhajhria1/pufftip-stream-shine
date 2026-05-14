import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SEED_TIPS, type Tip } from "./mockData";

type State = {
  balance: number;
  connected: boolean;
  tipsByStreamer: Record<string, Tip[]>;
  sentCount: number;
  topUp: () => void;
  fakeConnect: () => void;
  addTip: (handle: string, amount: number, message: string, from?: string) => void;
};

const COLORS: Tip["color"][] = ["yellow", "pink", "teal", "green"];

export const useDemoWallet = create<State>()(
  persist(
    (set, get) => ({
      balance: 5,
      connected: false,
      tipsByStreamer: SEED_TIPS,
      sentCount: 0,
      topUp: () => set({ balance: get().balance + 5 }),
      fakeConnect: () => set({ connected: true }),
      addTip: (handle, amount, message, from = "you") => {
        const current = get().tipsByStreamer[handle] ?? [];
        const tip: Tip = {
          id: `local_${Date.now()}`,
          from,
          amount,
          message: message || "no note",
          ago: "now",
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        };
        set({
          balance: Math.max(0, get().balance - amount),
          sentCount: get().sentCount + 1,
          tipsByStreamer: {
            ...get().tipsByStreamer,
            [handle]: [tip, ...current],
          },
        });
      },
    }),
    { name: "pufftip-demo-wallet" },
  ),
);
