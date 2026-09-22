import { useI18n } from "../i18n/I18nContext";

const LOGOS = [
  "Alsea",
  "Axxa",
  "Baxter",
  "Buick",
  "Coca-cola",
  "El Palacio de Hierro",
  "GBT color",
  "Herdez",
  "Hilti",
  "Hyatt",
  "Mars",
  "Mont Blanc",
  "Panduit",
  "RedBull",
  "Sams",
  "Shein",
  "Soriana",
  "Walmart",
  "ZTE",
  "aeromexico",
  "vantive plum",
];

export default function Clients() {
  const { t } = useI18n();
  const doubled = [...LOGOS, ...LOGOS];

  return (
    <section className="clients">
      <div className="container">
        <p className="clients__title reveal">
          <span>{t("clients.title")}</span>
        </p>
      </div>
      <div className="clients__marquee" aria-label="Logos de clientes">
        <div className="clients__track" id="clientsTrack">
          {doubled.map((name, i) => (
            <span className="client" key={`${name}-${i}`}>
              <img
                src={`/assets/img/clients/${encodeURIComponent(name)}.png`}
                alt={name}
                loading="lazy"
                decoding="async"
                width="150"
                height="42"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
