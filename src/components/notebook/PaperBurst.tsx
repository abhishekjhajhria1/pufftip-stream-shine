import { useEffect, useState } from "react";

type Piece = { id: number; x: number; y: number; rot: number; dx: number; dy: number; color: string; w: number; h: number; emoji?: string };

const COLORS = ["var(--marker-yellow)", "var(--washi-pink)", "var(--washi-teal)", "var(--marker-green)", "var(--ember)"];
const EMOJIS = ["✈️", "🚬", "✨", "★"];

/** Bursts paper scraps + a few emojis from the center when `trigger` increments. */
export function PaperBurst({ trigger, count = 28 }: { trigger: number; count?: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!trigger) return;
    const next: Piece[] = Array.from({ length: count }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const power = 60 + Math.random() * 140;
      const isEmoji = Math.random() < 0.18;
      return {
        id: Date.now() + i,
        x: 0,
        y: 0,
        rot: (Math.random() - 0.5) * 540,
        dx: Math.cos(angle) * power,
        dy: Math.sin(angle) * power - 40,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        w: 8 + Math.random() * 14,
        h: 4 + Math.random() * 8,
        emoji: isEmoji ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)] : undefined,
      };
    });
    setPieces(next);
    const t = setTimeout(() => setPieces([]), 1600);
    return () => clearTimeout(t);
  }, [trigger, count]);

  if (!pieces.length) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-[60] grid place-items-center overflow-visible">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute animate-burst"
          style={
            {
              // CSS vars consumed by keyframes
              ["--dx" as string]: `${p.dx}px`,
              ["--dy" as string]: `${p.dy}px`,
              ["--rot" as string]: `${p.rot}deg`,
              background: p.emoji ? "transparent" : p.color,
              width: p.emoji ? "auto" : p.w,
              height: p.emoji ? "auto" : p.h,
              borderRadius: 2,
              fontSize: p.emoji ? 18 : undefined,
              lineHeight: 1,
            } as React.CSSProperties
          }
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}