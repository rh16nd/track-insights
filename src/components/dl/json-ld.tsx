import type { JsonLdGraph } from "@/lib/seo";

/** Renders a JSON-LD block.
 *
 * JSON-LD is valid in the body, so this renders where it is placed rather
 * than being hoisted into <head> — which also means it works the same in
 * SSR output and after hydration.
 *
 * `dangerouslySetInnerHTML` is the only way to put raw JSON inside a script
 * tag from JSX; React would otherwise escape it into something no parser
 * accepts. The content is not user input — it is built from this module's
 * own literals plus route names — and `<` is escaped anyway so a stray
 * "</script>" in a value cannot close the tag early.
 */
export function JsonLd({ data }: { data: JsonLdGraph | null }) {
  if (!data) return null;
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
