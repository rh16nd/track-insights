import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { en } from "./locales/en";
import { fr } from "./locales/fr";

/** A small, dependency-free i18n layer. react-i18next is the usual pick, but
 * wiring its SSR/hydration story into TanStack Start is more machinery than a
 * flat string table needs, and this keeps full control of the one thing that
 * matters next: the `dir` flip for Arabic. Add "ar" here, an ar.ts resource,
 * and its RTL layout work, and the switcher picks it up. */
export type Lang = "en" | "fr";

export const LANGS: { code: Lang; label: string; name: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "EN", name: "English", dir: "ltr" },
  { code: "fr", label: "FR", name: "Français", dir: "ltr" },
];

const RESOURCES: Record<Lang, Record<string, string>> = { en, fr };
const STORAGE_KEY = "podiumcall:lang";

type Vars = Record<string, string | number>;

/** The translate function's shape, exported so helpers that live outside a
 * component (a headline builder, a date phrase) can take it as an argument
 * rather than each re-declaring the signature. */
export type TFunc = (key: string, vars?: Vars) => string;

function interpolate(s: string, vars?: Vars): string {
  if (!vars) return s;
  return s.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] != null ? String(vars[k]) : ""));
}

type I18nValue = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  /** Translate a key, falling back to English then to the key itself, with
   * `{{var}}` interpolation. */
  t: TFunc;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Always "en" on the server and the first client render so hydration matches;
  // the stored preference is applied in an effect just after mount (a one-frame
  // swap for a returning French visitor, never a hydration mismatch).
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
    if (stored === "en" || stored === "fr") setLangState(stored);
  }, []);

  const dir = useMemo(() => LANGS.find((l) => l.code === lang)?.dir ?? "ltr", [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* best effort */
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Vars) =>
      interpolate(RESOURCES[lang][key] ?? RESOURCES.en[key] ?? key, vars),
    [lang],
  );

  const value = useMemo(() => ({ lang, dir, setLang, t }), [lang, dir, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT must be used inside <I18nProvider>");
  return ctx;
}
