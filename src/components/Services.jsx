import { useI18n } from "../i18n/I18nContext";

const ICONS = {
  s1: (
    <path
      d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  ),
  s2: (
    <>
      <rect x="2.5" y="5" width="14" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16.5 10l5-3v10l-5-3z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </>
  ),
  s3: (
    <>
      <path
        d="M3 8a2 2 0 012-2h2l1.5-2h7L17 6h2a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12.5" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  s4: (
    <>
      <path d="M3 20V9l9-5 9 5v11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3 20h18M9 20v-6h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </>
  ),
};

const SERVICES = [
  { id: "s1", num: "01", terms: ["t1", "t2", "t3"] },
  { id: "s2", num: "02", terms: ["t1", "t2", "t3", "t4"] },
  { id: "s3", num: "03", terms: ["t1", "t2", "t3", "t4", "t5"] },
  { id: "s4", num: "04", terms: ["t1", "t2", "t3", "t4", "t5"] },
];

export default function Services() {
  const { t } = useI18n();

  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-head">
          <p className="section-label reveal">
            <span>{t("services.label")}</span>
          </p>
          <h2 className="section-title reveal">{t("services.title")}</h2>
        </div>

        <div className="services__grid">
          {SERVICES.map((s) => (
            <article className="service reveal" data-cursor="more" key={s.id}>
              <span className="service__num">{s.num}</span>
              <div className="service__icon">
                <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                  {ICONS[s.id]}
                </svg>
              </div>
              <h3 className="service__title">{t(`services.${s.id}.title`)}</h3>
              <p className="service__desc">{t(`services.${s.id}.desc`)}</p>
              <ul className="service__list">
                {s.terms.map((term) => (
                  <li key={term}>{t(`services.${s.id}.${term}`)}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
