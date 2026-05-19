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
};

export function InlineEdit({ value, onChange, editable, as = "span", className, placeholder, multiline, maxLength }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  useEffect(() => { if (!editing) setDraft(value); }, [value, editing]);
  useEffect(() => { if (editing && ref.current) { ref.current.focus(); ref.current.select?.(); } }, [editing]);

  const commit = () => { setEditing(false); if (draft !== value) onChange(draft); };
  const cancel = () => { setEditing(false); setDraft(value); };

  if (!editable) {
    const Comp = as as keyof React.JSX.IntrinsicElements;
    return <Comp className={className}>{value || placeholder}</Comp>;
  }

  if (editing) {
    const common = {
      value: draft,
      maxLength,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Escape") cancel();
        if (e.key === "Enter" && !multiline) { e.preventDefault(); commit(); }
        if (e.key === "Enter" && multiline && (e.metaKey || e.ctrlKey)) { e.preventDefault(); commit(); }
      },
      className: cn("w-full rounded-md border-2 border-dashed border-marker-blue bg-paper/80 px-2 py-1 outline-none", className),
    };
    return multiline
      ? <textarea ref={ref as React.RefObject<HTMLTextAreaElement>} rows={3} {...common as React.TextareaHTMLAttributes<HTMLTextAreaElement>} />
      : <input ref={ref as React.RefObject<HTMLInputElement>} type="text" {...common as React.InputHTMLAttributes<HTMLInputElement>} />;
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