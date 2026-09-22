import { useI18n } from "../i18n/I18nContext";

const STEPS = ["p1", "p2", "p3", "p4"];

export default function Process() {
  const { t } = useI18n();
  return (
    <section className="process">
      <div className="container">
        <div className="section-head">
          <p className="section-label reveal">
            <span>{t("process.label")}</span>
          </p>
          <h2 className="section-title reveal">{t("process.title")}</h2>
          <p className="section-sub reveal">{t("process.sub")}</p>
        </div>
        <div className="process__steps">
          {STEPS.map((id, i) => (
            <div className="step reveal" key={id}>
              <span className="step__num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="step__title">{t(`process.${id}.t`)}</h3>
              <p className="step__desc">{t(`process.${id}.d`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
