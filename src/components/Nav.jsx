import { useEffect, useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import { trackEvent } from "../analytics/trackEvent";

const LINKS = [
  { href: "#work", key: "nav.work", section: "work" },
  { href: "#services", key: "nav.services", section: "services" },
  { href: "#studio", key: "nav.studio", section: "studio" },
  { href: "#contact", key: "nav.contact", section: "contact" },
];

export default function Nav() {
  const { lang, toggleLang, t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("is-locked", menuOpen);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const onLangToggle = () => {
    const nextLang = lang === "es" ? "en" : "es";
    trackEvent("lang_toggle", { lang: nextLang });
    toggleLang();
  };

  return (
    <>
      <header className="nav" id="nav">
        <a href="#hero" className="nav__brand" aria-label="Vortex Media Lab — inicio">
          <img
            className="nav__logo-full"
            src="/assets/img/logo-tagline.svg"
            alt="Vortex Media Lab"
            width="124"
            height="40"
          />
        </a>

        <nav className="nav__links" aria-label="Navegación principal">
          {LINKS.map((l) => (
            <a
              key={l.key}
              href={l.href}
              className="nav__link"
              onClick={() => trackEvent("nav_click", { section: l.section, location: "nav" })}
            >
              {t(l.key)}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <button
            className="lang-toggle"
            id="langToggle"
            type="button"
            aria-label={t("a11y.lang")}
            onClick={onLangToggle}
          >
            <span className={`lang-toggle__opt${lang === "es" ? " is-active" : ""}`}>ES</span>
            <span className="lang-toggle__sep">/</span>
            <span className={`lang-toggle__opt${lang === "en" ? " is-active" : ""}`}>EN</span>
          </button>
          <a
            href="#contact"
            className="btn btn--pill nav__cta"
            data-magnetic
            onClick={() => trackEvent("cta_click", { location: "nav", label: "start_project" })}
          >
            {t("nav.cta")}
          </a>
          <button
            className={`nav__burger${menuOpen ? " is-open" : ""}`}
            id="burger"
            type="button"
            aria-label={menuOpen ? t("a11y.menuClose") : t("a11y.menuOpen")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`mobile-menu${menuOpen ? " is-open" : ""}`} id="mobileMenu" aria-hidden={!menuOpen}>
        {LINKS.map((l) => (
          <a
            key={l.key}
            href={l.href}
            className="mobile-menu__link"
            onClick={() => {
              trackEvent("nav_click", { section: l.section, location: "mobile" });
              closeMenu();
            }}
          >
            {t(l.key)}
          </a>
        ))}
        <a
          href="#contact"
          className="btn btn--pill mobile-menu__cta"
          onClick={() => {
            trackEvent("cta_click", { location: "mobile", label: "start_project" });
            closeMenu();
          }}
        >
          {t("nav.cta")}
        </a>
      </div>
    </>
  );
}
