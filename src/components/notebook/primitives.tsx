import { type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
 * Hand-drawn primitive components.
 * Everything here is deliberately a little crooked and tactile.
 * ------------------------------------------------------------------ */

export function PaperPage({ children, className, ruled = false }: { children: ReactNode; className?: string; ruled?: boolean }) {
  return (
    <div className={cn("relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10 py-8", ruled && "ruled margin-line", className)}>
      {children}
    </div>
  );
}

export function WashiTape({
  className,
  color = "pink",
  rotate = -3,
  style,
}: {
  className?: string;
  color?: "pink" | "teal" | "yellow";
  rotate?: number;
  style?: CSSProperties;
}) {
  const bg = color === "pink" ? "bg-washi-pink" : color === "teal" ? "bg-washi-teal" : "bg-washi-yellow";
  return (
    <span
      aria-hidden
      className={cn("washi pointer-events-none", bg, className)}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    />
  );
}

export function Polaroid({
  hue = 30,
  label,
  caption,
  rotate = -2,
  size = 140,
  emoji = "📸",
  tape = true,
}: {
  hue?: number;
  label?: string;
  caption?: string;
  rotate?: number;
  size?: number;
  emoji?: string;
  tape?: boolean;
}) {
  return (
    <div
      className="relative inline-block bg-white p-2 pb-6 shadow-paper"
      style={{ width: size, transform: `rotate(${rotate}deg)` }}
    >
      {tape && <WashiTape color="teal" rotate={-8} className="-top-2 left-1/2 -translate-x-1/2" style={{ width: "3.5rem" }} />}
      <div
        className="flex aspect-square items-center justify-center text-4xl"
        style={{
          background: `linear-gradient(135deg, oklch(0.85 0.14 ${hue}) 0%, oklch(0.65 0.18 ${hue + 30}) 100%)`,
        }}
      >
        <span style={{ filter: "drop-shadow(1px 1px 0 rgba(0,0,0,0.2))" }}>{emoji}</span>
      </div>
      {label && (
        <div className="mt-2 text-center font-hand text-lg leading-none text-ink">{label}</div>
      )}
      {caption && <div className="mt-0.5 text-center font-label text-[11px] text-ink-soft">{caption}</div>}
    </div>
  );
}

export function StickyNote({
  children,
  color = "yellow",
  rotate = -2,
  className,
}: {
  children: ReactNode;
  color?: "yellow" | "pink" | "teal" | "green";
  rotate?: number;
  className?: string;
}) {
  const colorClass = color === "yellow" ? "" : color;
  return (
    <div
      className={cn("sticky-note", colorClass, className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span aria-hidden className="absolute -top-1 left-1/2 size-3 -translate-x-1/2 rounded-full bg-marker-red shadow-sm" />
      {children}
    </div>
  );
}

export function TornPaper({ children, className, rotate = 0 }: { children: ReactNode; className?: string; rotate?: number }) {
  return (
    <div
      className={cn("relative bg-card p-5 shadow-paper", className)}
      style={{
        transform: `rotate(${rotate}deg)`,
        clipPath:
          "polygon(0 4%, 6% 0, 18% 3%, 32% 0, 48% 4%, 64% 1%, 78% 4%, 92% 0, 100% 5%, 99% 96%, 88% 100%, 72% 97%, 56% 100%, 40% 97%, 24% 100%, 10% 97%, 0 100%)",
      }}
    >
      {children}
    </div>
  );
}

export function MarkerUnderline({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("marker-underline", className)}>{children}</span>;
}

export function Highlight({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("marker-highlight", className)}>{children}</span>;
}

export function DoodleArrow({ className, direction = "right" }: { className?: string; direction?: "right" | "down" | "down-right" }) {
  const path =
    direction === "right"
      ? "M2 20 Q 30 5, 60 20 T 118 20 M 110 12 L 120 20 L 110 28"
      : direction === "down"
      ? "M20 2 Q 5 30, 20 60 T 20 118 M 12 110 L 20 120 L 28 110"
      : "M2 4 Q 30 6, 60 30 T 118 90 M 105 88 L 120 95 L 113 80";
  return (
    <svg viewBox="0 0 122 122" className={cn("text-ink", className)} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} className="animate-draw" />
    </svg>
  );
}

export function SmokeCurl({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 120" className={cn("text-ink-soft", className)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M40 115 Q 35 95 45 80 Q 55 65 35 50 Q 20 35 45 20 Q 55 12 40 2" className="animate-draw" />
      <circle cx="40" cy="118" r="3" fill="currentColor" className="text-ember" />
    </svg>
  );
}

export function StarDoodle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn(className)} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 L14 9 L21 10 L16 15 L17 22 L12 18 L7 22 L8 15 L3 10 L10 9 Z" />
    </svg>
  );
}

export function Sketch({ children, className, rotate = 0 }: { children: ReactNode; className?: string; rotate?: number }) {
  return (
    <div className={cn("border-sketch bg-card p-5", className)} style={{ transform: `rotate(${rotate}deg)` }}>
      {children}
    </div>
  );
}

export function Stamp({ children, color = "red", className, rotate = -8 }: { children: ReactNode; color?: "red" | "blue" | "green"; className?: string; rotate?: number }) {
  const c = color === "red" ? "text-marker-red border-marker-red" : color === "blue" ? "text-marker-blue border-marker-blue" : "text-marker-green border-marker-green";
  return (
    <span
      className={cn("inline-block border-[3px] px-3 py-1 font-hand text-2xl uppercase tracking-wider opacity-80", c, className)}
      style={{ transform: `rotate(${rotate}deg)`, borderStyle: "double" }}
    >
      {children}
    </span>
  );
}
