import type { ReactNode } from "react";

/** A section's heading, notes and content with no panel around them, for the
 * pages that sit straight on their ground: the Asian Games page's full field,
 * the Track and Field top-20 tables and the event pages (the user, 2026-09-21:
 * "don't put them in a box"). The heading is the landing's serif; `action`
 * sits beside it on a wide screen and under it on a phone. */
export function BareFrame({
  title,
  subtitle,
  action,
  children,
  level = 3,
  className = "",
  id,
}: {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  /** 2 where the section is one of the page's own, 3 inside one. */
  level?: 2 | 3;
  className?: string;
  id?: string;
}) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <section className={className} id={id}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <Heading className="hero-serif text-balance text-[clamp(26px,3vw,36px)] leading-tight text-foreground">
            {title}
          </Heading>
          {subtitle && (
            <p className="mt-2 max-w-[70ch] text-[13.5px] leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
