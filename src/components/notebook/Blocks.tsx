import { type Block } from "@/lib/useStreamerConfig";
import { Highlight, MarkerUnderline, Sketch, StickyNote, WashiTape } from "./primitives";

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
  }
}