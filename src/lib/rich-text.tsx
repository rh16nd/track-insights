import { Fragment, type ReactNode } from "react";

/** Renders a translated string that carries inline emphasis.
 *
 * `t()` returns a plain string, so a sentence containing a `<b>` would
 * otherwise have to be broken into three separate keys around it. That is
 * miserable to translate: word order moves between languages, and the
 * fragments stop being sentences. Markers keep each sentence as one
 * translatable unit and let the emphasis land wherever that language puts it.
 *
 * Supports `**bold**` and `*italic*`. Deliberately nothing else -- this is a
 * formatter for UI copy, not a Markdown engine, and anything richer belongs
 * in JSX. */
const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;

export function Rich({ text }: { text: string }): ReactNode {
  return text.split(TOKEN).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <b key={i}>{part.slice(2, -2)}</b>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <i key={i}>{part.slice(1, -1)}</i>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
