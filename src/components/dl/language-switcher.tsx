import { LANGS, useT } from "@/lib/i18n";

/** A compact segmented toggle (EN / FR) in the nav. Small on purpose — it
 * sits next to the Live badge. When Arabic lands it becomes a third segment;
 * if that gets tight, this is the spot to switch to a dropdown.
 *
 * `tone="dark"` is for the landing hero, where it sits on a photo inside a
 * dark glass pill and the app's own muted text would disappear. */
export function LanguageSwitcher({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const { lang, setLang, t } = useT();
  const dark = tone === "dark";
  return (
    <div
      role="group"
      aria-label={t("nav.language")}
      className={`flex items-center gap-0.5 rounded-full p-0.5 ${dark ? "" : "border border-border"} ${className}`}
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
            className={`label-caps rounded-full leading-none transition-colors ${
              dark ? "min-h-9 min-w-9 px-2.5 py-2" : "px-2 py-1"
            } ${
              active
                ? dark
                  ? "bg-white/20 text-white"
                  : "bg-secondary text-foreground"
                : dark
                  ? "text-white/75 hover:text-white"
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
