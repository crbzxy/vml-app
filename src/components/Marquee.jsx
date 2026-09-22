import { Fragment } from "react";
import { useI18n } from "../i18n/I18nContext";

const Sep = () => (
  <span className="sep">
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path
        d="M12 0c.9 6.4 4.7 10.2 11.1 11.1.3 0 .3.5 0 .5-6.4.9-10.2 4.7-11.1 11.1-.1.4-.5.4-.5 0C10.6 16.4 6.8 12.6.4 11.7c-.3 0-.3-.5 0-.5C6.8 10.3 10.6 6.5 11.5.1c.1-.4.5-.4.5-.1z"
        fill="currentColor"
      />
    </svg>
  </span>
);

export default function Marquee() {
  const { t } = useI18n();
  const items = t("marqueeItems");
  const list = Array.isArray(items) ? items : [];
  // Se duplica la lista para lograr el loop infinito sin costura (igual que el original).
  const doubled = [...list, ...list];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track" id="marqueeTrack">
        {doubled.map((item, i) => (
          <Fragment key={`${item}-${i}`}>
            <span>{item}</span>
            <Sep />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
