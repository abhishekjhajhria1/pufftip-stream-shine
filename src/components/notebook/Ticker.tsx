import { TICKER_FEED } from "@/lib/mockData";

export function Ticker() {
  const items = [...TICKER_FEED, ...TICKER_FEED];
  return (
    <div className="relative overflow-hidden border-y-2 border-dashed border-ink/30 bg-marker-yellow/40 py-1.5">
      <div className="flex animate-ticker gap-8 whitespace-nowrap font-label text-sm text-ink">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-marker-red" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
