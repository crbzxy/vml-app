import { Fragment, useEffect, useMemo, useRef } from "react";
import { useI18n } from "../i18n/I18nContext";
import { useReducedMotion } from "../hooks/useMediaFlags";

/** Convierte "Somos un *laboratorio* creativo" en tokens {word, accent}. */
function splitWords(raw) {
  return raw
    .trim()
    .split(/\s+/)
    .map((tok) => {
      const accent = tok.indexOf("*") !== -1;
      const word = tok.replace(/\*/g, "");
      return { word, accent };
    });
}

export default function Studio() {
  const { t } = useI18n();
  const reducedMotion = useReducedMotion();
  const statementRef = useRef(null);
  const words = useMemo(() => splitWords(t("intro.statement")), [t]);

  // Cada palabra se ilumina al cruzar el 85% del viewport, ligado al scroll.
  useEffect(() => {
    const container = statementRef.current;
    if (!container) return;
    const spans = Array.from(container.querySelectorAll(".reveal-word"));
    if (reducedMotion) {
      spans.forEach((w) => w.classList.add("is-lit"));
      return;
    }
    let ticking = false;
    const update = () => {
      const trigger = window.innerHeight * 0.85;
      spans.forEach((w) => {
        const top = w.getBoundingClientRect().top;
        w.classList.toggle("is-lit", top < trigger);
      });
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [reducedMotion, words]);

  return (
    <section className="intro" id="studio">
      <div className="container">
        <div className="intro__head">
          <p className="section-label reveal">
            <span>{t("intro.label")}</span>
          </p>
          <div className="intro__icons" aria-hidden="true">
            <span className="lab-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  d="M9 3h6M10 3v6.2L4.8 18a2 2 0 001.7 3h11a2 2 0 001.7-3L14 9.2V3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M7.3 14h9.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <span className="lab-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <ellipse cx="12" cy="12" rx="10" ry="4.3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <ellipse
                  cx="12"
                  cy="12"
                  rx="10"
                  ry="4.3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  transform="rotate(60 12 12)"
                />
                <ellipse
                  cx="12"
                  cy="12"
                  rx="10"
                  ry="4.3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  transform="rotate(120 12 12)"
                />
              </svg>
            </span>
            <span className="lab-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  d="M3 21c2-1 3.5-2.5 5-4l8.5-8.5 2.5 2.5L10.5 19.5C9 21 7 22 3 21z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.5 6l1.5-1.5a2 2 0 013 3L19.5 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        <h2 className="intro__statement" ref={statementRef}>
          {words.map((w, i) => (
            <Fragment key={i}>
              <span className={`reveal-word${w.accent ? " accent" : ""}`}>{w.word}</span>
              {i < words.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </h2>
      </div>
    </section>
  );
}
