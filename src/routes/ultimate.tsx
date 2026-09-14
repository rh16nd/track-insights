import { createFileRoute, redirect } from "@tanstack/react-router";

/** The championship tab was the Ultimate's; it now follows whichever
 * championship is current, at /championship. Kept as a redirect rather than
 * deleted so links and bookmarks to /ultimate still land on the championship
 * page. The Ultimate's own record, its frozen call against its results, lives
 * on /results. */
export const Route = createFileRoute("/ultimate")({
  beforeLoad: () => {
    throw redirect({ to: "/championship" });
  },
});
