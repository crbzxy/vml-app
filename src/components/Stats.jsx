import { useI18n } from "../i18n/I18nContext";

const STATS = [
  { count: 120, plus: true, key: "stats.s1" },
  { count: 48, plus: true, key: "stats.s2" },
  { count: 9, plus: false, key: "stats.s3" },
  { count: 14, plus: false, key: "stats.s4" },
];

export default function Stats() {
  const { t } = useI18n();
  return (
    <section className="stats">
      <div className="container stats__grid">
        {STATS.map((s) => (
          <div className="stat reveal" key={s.key}>
            <span className="stat__num" data-count={s.count}>
              0
            </span>
            {s.plus && <span className="stat__plus">+</span>}
            <p className="stat__label">{t(s.key)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
