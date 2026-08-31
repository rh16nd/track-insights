import { createFileRoute, redirect } from "@tanstack/react-router";

/** Projections merged into the discipline page (2026-08-31).
 *
 * The two routes had become the same page: both rendered the head-to-head
 * matrix and the same ranked field, and v0's own design has ONE page per
 * event — its `projections.html` is a per-discipline page, not a separate
 * section. The two blocks that only lived here, the real season-form
 * trajectories and the computed storylines, moved to
 * `/discipline/$discKey` rather than being retired with the route.
 *
 * Kept as a redirect rather than deleted so existing links and bookmarks —
 * including `?disc=` ones the app itself used to write — still land
 * somewhere correct instead of 404ing. */
export const Route = createFileRoute("/projections")({
  validateSearch: (search: Record<string, unknown>): { disc?: string | undefined } => ({
    disc: typeof search["disc"] === "string" ? (search["disc"] as string) : undefined,
  }),
  beforeLoad: ({ search }) => {
    if (search.disc) {
      throw redirect({ to: "/discipline/$discKey", params: { discKey: search.disc } });
    }
    // No discipline named, so there is nothing to project — send them to the
    // picker rather than guessing an event on their behalf.
    throw redirect({ to: "/track" });
  },
});
