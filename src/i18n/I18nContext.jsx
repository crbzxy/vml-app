import { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";
import { dictionary } from "./dictionary";

const I18nContext = createContext(null);

function getInitialLang() {
  if (typeof window === "undefined") return "es";
  try {
    const saved = localStorage.getItem("vml-lang");
    if (saved === "es" || saved === "en") return saved;
  } catch {
    /* localStorage no disponible (modo privado, etc.) */
  }
  return "es";
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.body.dataset.lang = lang;
    try {
      localStorage.setItem("vml-lang", lang);
    } catch {
      /* noop */
    }
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "es" ? "en" : "es"));
  }, []);

  const t = useCallback(
    (key) => dictionary[lang]?.[key] ?? dictionary.es[key] ?? key,
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, toggleLang, t }), [lang, toggleLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n debe usarse dentro de <I18nProvider>");
  return ctx;
}
