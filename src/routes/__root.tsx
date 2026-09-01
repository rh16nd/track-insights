import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { JsonLd } from "@/components/dl/json-ld";
import { websiteSchema } from "@/lib/seo";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    /* <main>, not a bare <div>: every other page on the site exposes a main
       landmark through Shell, and this one renders outside it, so a screen
       reader lost the "skip to the content" anchor exactly where a lost
       visitor needs it most. Same gap the landing had before it was given
       one -- both are pages that do not go through Shell. */
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        {/* The tab still said "PodiumCall - 2026 Diamond League Predictions"
            on a page that is not that. A wrong title is worse than a plain
            one in history, in bookmarks, and read aloud. */}
        <title>Page not found · PodiumCall</title>
        <meta name="robots" content="noindex" />
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

/** Google Search Console verification. Env-gated so the token is set as a
 * build var (VITE_GOOGLE_SITE_VERIFICATION) at deploy time rather than
 * committed -- the meta tag renders only when it is present, and Search
 * Console just needs it somewhere in <head>. Same env-gated pattern as
 * VITE_SITE_URL / VITE_API_BASE_URL. */
const GOOGLE_SITE_VERIFICATION = import.meta.env["VITE_GOOGLE_SITE_VERIFICATION"];

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      // Rendered only when the env var is set (see GOOGLE_SITE_VERIFICATION).
      ...(GOOGLE_SITE_VERIFICATION
        ? [{ name: "google-site-verification", content: GOOGLE_SITE_VERIFICATION }]
        : []),
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PodiumCall — 2026 Diamond League Predictions" },
      {
        name: "description",
        content:
          "Real-data predictions for the 2026 Wanda Diamond League Final, trained on results scraped directly from World Athletics.",
      },
      { property: "og:title", content: "PodiumCall — 2026 Diamond League Predictions" },
      {
        property: "og:description",
        content:
          "Real-data predictions for the 2026 Wanda Diamond League Final, trained on results scraped directly from World Athletics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      // twitter:card promised a large image and none was ever set, so every
      // share rendered blank. Drawn from the app's own palette and lane
      // motif (scripts/make-og.py) rather than a stock graphic.
      { property: "og:image", content: "/og.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "PodiumCall — We make the call before the gun." },
      { name: "twitter:image", content: "/og.png" },
      { property: "og:site_name", content: "PodiumCall" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Barlow:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        {/* Emitted once for the whole site; per-page BreadcrumbList
            lives in Shell. */}
        <JsonLd data={websiteSchema()} />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
