import { useI18n } from "../i18n/I18nContext";
import { useIsTouch } from "../hooks/useMediaFlags";
import { trackEvent } from "../analytics/trackEvent";

export default function Hero({ revealed }) {
  const { t } = useI18n();
  const isTouch = useIsTouch();

  return (
    <section className={`hero${revealed ? " is-revealed" : ""}`} id="hero">
      <div className="hero__media">
        {isTouch ? (
          <img
            className="hero__poster"
            src="/assets/img/hero-poster.webp"
            alt=""
            width="1920"
            height="1080"
            fetchPriority="high"
            decoding="async"
          />
        ) : (
          <video
            className="hero__video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/img/hero-poster.webp"
            ref={(el) => {
              if (el) el.playbackRate = 0.5;
            }}
          >
            <source src="/assets/video/hero.mp4" type="video/mp4" />
          </video>
        )}
        <div className="hero__scrim" />
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
          <a
            href="#work"
            className="btn btn--solid"
            data-magnetic
            data-cursor="view"
            onClick={() => trackEvent("cta_click", { location: "hero", label: "work" })}
          >
            {t("hero.ctaWork")}
          </a>
          <a
            href="#contact"
            className="btn btn--ghost"
            data-magnetic
            onClick={() => trackEvent("cta_click", { location: "hero", label: "talk" })}
          >
            {t("hero.ctaTalk")}
          </a>
        </div>
      </div>

      <span className="hero__slogan reveal">Brand New Vision</span>

      <a href="#work" className="hero__scroll" aria-label={t("hero.scroll")}>
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
