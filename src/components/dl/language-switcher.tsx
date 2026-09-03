import { LANGS, useT } from "@/lib/i18n";

/** A compact segmented toggle (EN / FR) in the nav. Small on purpose — it
 * sits next to the Live badge. When Arabic lands it becomes a third segment;
 * if that gets tight, this is the spot to switch to a dropdown. */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useT();
  return (
    <div
      role="group"
      aria-label={t("nav.language")}
      className={`flex items-center gap-0.5 rounded-full border border-border p-0.5 ${className}`}
    >
      {LANGS.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            aria-pressed={active}
            title={l.name}
            className={`label-caps rounded-full px-2 py-1 leading-none transition-colors ${
              active
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
