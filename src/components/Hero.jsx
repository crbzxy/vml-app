import { useI18n } from "../i18n/I18nContext";

export default function Hero({ revealed }) {
  const { t } = useI18n();

  return (
    <section className={`hero${revealed ? " is-revealed" : ""}`} id="hero">
      <div className="hero__media">
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/img/hero-poster.jpg"
        >
          <source src="/assets/video/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero__scrim" />
        <div className="hero__grain" />
      </div>

      <div className="hero__content">
        <p className="hero__eyebrow reveal">
          <span className="dot" /> <span>{t("hero.eyebrow")}</span>
        </p>

        <h1 className="hero__title">
          <span className="line">
            <span className="line__inner">{t("hero.l1")}</span>
          </span>
          <span className="line">
            <span className="line__inner line__inner--accent">{t("hero.l2")}</span>
          </span>
          <span className="line">
            <span className="line__inner">{t("hero.l3")}</span>
          </span>
        </h1>

        <p className="hero__sub reveal">{t("hero.sub")}</p>

        <div className="hero__actions reveal">
          <a href="#work" className="btn btn--solid" data-magnetic data-cursor="view">
            {t("hero.ctaWork")}
          </a>
          <a href="#contact" className="btn btn--ghost" data-magnetic>
            {t("hero.ctaTalk")}
          </a>
        </div>
      </div>

      <span className="hero__slogan reveal">Brand New Vision</span>

      <a href="#work" className="hero__scroll" aria-label="Desplazar hacia abajo">
        <span>{t("hero.scroll")}</span>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            d="M12 5v14M6 13l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  );
}
