import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PodiumCallMark } from "@/components/dl/logo";
import { WaSourceLink } from "@/components/dl/wa-link";
import { FeedbackLink } from "@/components/dl/feedback-modal";
import { useChampionshipSummary } from "@/hooks/useChampionship";
import { useT } from "@/lib/i18n";

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        className="inline-block py-1.5 text-[14px] text-muted-foreground transition-colors hover:text-foreground"
      >
        {children}
      </Link>
    </li>
  );
}

/** The site's one footer, the landing's three columns on every page (the Terra
 * re-theme, 2026-09-21). It keeps everything the app's old one-line footer
 * said: the source, that the site is not affiliated with anyone, How it works,
 * the feedback link and the disclaimer. */
export function SiteFooter({ className = "" }: { className?: string }) {
  const { t } = useT();
  const summary = useChampionshipSummary();
  const championshipName = t(
    (summary.status === "ok" ? summary.data.navKey : null) ?? "nav.championship",
  );
  return (
    <footer className={`border-t border-white/10 px-5 pb-8 pt-14 sm:px-10 ${className}`}>
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-2">
            <PodiumCallMark className="size-5" />
            <span
              className="text-[15px] font-bold uppercase tracking-[0.08em] text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              PodiumCall
            </span>
          </Link>
          <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-muted-foreground">
            {t("landing.tagline")}.
          </p>
        </div>
        <nav aria-label={t("landing.footer.explore")}>
          <h2 className="label-caps text-foreground">{t("landing.footer.explore")}</h2>
          <ul className="mt-3">
            <FooterLink to="/dashboard">{t("nav.dashboard")}</FooterLink>
            <FooterLink to="/track">{t("nav.track")}</FooterLink>
            <FooterLink to="/field">{t("nav.field")}</FooterLink>
            <FooterLink to="/championship">{championshipName}</FooterLink>
            <FooterLink to="/results">{t("nav.results")}</FooterLink>
            <FooterLink to="/schedule">{t("nav.schedule")}</FooterLink>
          </ul>
        </nav>
        <nav aria-label={t("landing.footer.about")}>
          <h2 className="label-caps text-foreground">{t("landing.footer.about")}</h2>
          <ul className="mt-3">
            <FooterLink to="/how-it-works">{t("nav.howItWorks")}</FooterLink>
            <FooterLink to="/stats">{t("nav.stats")}</FooterLink>
            <li>
              <FeedbackLink className="inline-block py-1.5 text-[14px] text-muted-foreground transition-colors hover:text-foreground" />
            </li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-1.5 border-t border-white/10 pt-6 text-[12.5px] text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          {t("footer.scrapedFrom")} <WaSourceLink tone="canvas" />. {t("footer.notAffiliated")}
        </p>
        <p>{t("footer.disclaimer")}</p>
      </div>
    </footer>
  );
}
