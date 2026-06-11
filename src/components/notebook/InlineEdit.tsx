import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (next: string) => void;
  editable: boolean;
  as?: "span" | "div" | "h1" | "h2" | "h3" | "p";
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
  /** Quick-pick suggestions shown as chips while editing. */
  suggestions?: string[];
  /** Show the emoji palette (default true). */
  emoji?: boolean;
  /** Optional helper line under the input. */
  hint?: string;
};

const QUICK_EMOJI = ["✨","🔥","🎮","🎸","🍜","☕","👻","🚀","💸","💖","🪄","🌙","🎤","📷","🎉","🧃","✈️","🚬"];

export function InlineEdit({ value, onChange, editable, as = "span", className, placeholder, multiline, maxLength, suggestions, emoji = true, hint }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  useEffect(() => { if (!editing) setDraft(value); }, [value, editing]);
  useEffect(() => { if (editing && ref.current) { ref.current.focus(); ref.current.select?.(); } }, [editing]);

  const commit = () => { setEditing(false); if (draft !== value) onChange(draft); };
  const cancel = () => { setEditing(false); setDraft(value); };
  const insertAtCaret = (text: string) => {
    const el = ref.current;
    if (!el) { setDraft((d) => d + text); return; }
    const start = el.selectionStart ?? draft.length;
    const end = el.selectionEnd ?? draft.length;
    const next = draft.slice(0, start) + text + draft.slice(end);
    setDraft(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + text.length;
      try { el.setSelectionRange(pos, pos); } catch { /* noop */ }
    });
  };

  if (!editable) {
    const Comp = as as keyof React.JSX.IntrinsicElements;
    return <Comp className={className}>{value || placeholder}</Comp>;
  }

  if (editing) {
    const common = {
      value: draft,
      maxLength,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      onBlur: (e: React.FocusEvent) => {
        // Don't commit when the new focus target is inside our toolbar.
        const next = e.relatedTarget as HTMLElement | null;
        if (next && next.closest("[data-inline-toolbar]")) return;
        commit();
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Escape") cancel();
        if (e.key === "Enter" && !multiline) { e.preventDefault(); commit(); }
        if (e.key === "Enter" && multiline && (e.metaKey || e.ctrlKey)) { e.preventDefault(); commit(); }
      },
      className: cn("w-full rounded-md border-2 border-dashed border-marker-blue bg-paper/80 px-2 py-1 outline-none", className),
    };
    const counter = maxLength ? `${draft.length}/${maxLength}` : `${draft.length}`;
    return (
      <span className="relative inline-block w-full align-top">
        {multiline
          ? <textarea ref={ref as React.RefObject<HTMLTextAreaElement>} rows={3} {...common as React.TextareaHTMLAttributes<HTMLTextAreaElement>} />
          : <input ref={ref as React.RefObject<HTMLInputElement>} type="text" {...common as React.InputHTMLAttributes<HTMLInputElement>} />}
        <div
          data-inline-toolbar
          tabIndex={-1}
          className="mt-1 flex flex-wrap items-center gap-1 rounded-md border-2 border-dashed border-marker-blue/40 bg-card px-1.5 py-1 text-ink-soft shadow-sticker"
          onMouseDown={(e) => e.preventDefault()}
        >
          {emoji && QUICK_EMOJI.map((em) => (
            <button key={em} type="button" onClick={() => insertAtCaret(em)} className="rounded px-1 text-base hover:bg-marker-yellow" title={`insert ${em}`}>{em}</button>
          ))}
          {suggestions && suggestions.length > 0 && (
            <>
              <span className="mx-1 hidden h-4 w-px bg-ink/20 sm:block" />
              {suggestions.map((s) => (
                <button key={s} type="button" onClick={() => setDraft(s)} className="rounded border border-dashed border-ink/30 px-1.5 py-0.5 font-label text-[11px] hover:border-marker-red hover:text-ink" title="use this">{s}</button>
              ))}
            </>
          )}
          <span className="ml-auto flex items-center gap-2 pr-1">
            {draft.length > 0 && (
              <button type="button" onClick={() => setDraft("")} className="font-label text-[11px] text-marker-red hover:underline" title="clear">clear</button>
            )}
            <span className="font-mono text-[10px] text-ink-soft">{counter}</span>
            <button type="button" onClick={() => { setEditing(false); if (draft !== value) onChange(draft); }} className="rounded border border-ink/40 px-1.5 py-0.5 font-label text-[11px] text-ink hover:bg-marker-green hover:text-paper">save</button>
          </span>
          {hint && <p className="basis-full font-label text-[10px] italic text-ink-soft">{hint}</p>}
        </div>
      </span>
    );
  }

  const Comp = as as keyof React.JSX.IntrinsicElements;
  return (
    <Comp
      className={cn("cursor-text rounded-sm outline-dashed outline-2 outline-offset-2 outline-transparent transition hover:outline-marker-blue/60", className)}
      onClick={() => setEditing(true)}
      title="click to edit"
    >
      {value || <span className="text-ink-soft italic">{placeholder ?? "click to edit"}</span>}
    </Comp>
  );
}