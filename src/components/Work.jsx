import { useState } from "react";
import { useI18n } from "../i18n/I18nContext";

/* Para activar/ampliar un carrusel: sube las imágenes a public/assets/img/
   y añade sus nombres (con extensión) a la lista del proyecto. Lista vacía
   = el tile conserva su imagen estática (sin reel al hover). */
const REELS = {
  identidad: Array.from({ length: 12 }, (_, i) => `identidad-${String(i + 1).padStart(2, "0")}.webp`),
  aurora: Array.from({ length: 7 }, (_, i) => `aurora-${String(i + 1).padStart(2, "0")}.webp`),
  pulso: [],
  salvora: [],
  vertigo: Array.from({ length: 7 }, (_, i) => `vertigo-${String(i + 1).padStart(2, "0")}.webp`),
  cobalto: [],
};

const FILTERS = [
  { id: "all", key: "work.f.all" },
  { id: "design", key: "work.f.design" },
  { id: "av", key: "work.f.av" },
  { id: "event", key: "work.f.event" },
];

const TILES = [
  { id: "p1", cat: "av", size: "lg", img: "work-01.jpg", reel: "aurora" },
  { id: "p2", cat: "design", img: "work-02.jpg", reel: "identidad" },
  { id: "p3", cat: "event", img: "work-03.jpg", reel: "pulso" },
  { id: "p4", cat: "design", img: "work-04.jpg", reel: "salvora" },
  { id: "p5", cat: "event", size: "lg", img: "work-05.jpg", reel: "vertigo" },
  { id: "p6", cat: "av", img: "work-06.jpg", reel: "cobalto" },
];

function Tile({ tile, t, hidden }) {
  const reelImgs = REELS[tile.reel] || [];
  const hasReel = reelImgs.length > 0;
  const doubled = hasReel ? [...reelImgs, ...reelImgs] : [];

  return (
    <a
      href="#contact"
      className={`tile${tile.size === "lg" ? " tile--lg" : ""} reveal${hasReel ? " tile--reel" : ""}${
        hidden ? " is-hidden" : ""
      }`}
      data-cat={tile.cat}
      data-cursor="view"
      style={{ "--img": `url('/assets/img/${tile.img}')` }}
    >
      <div className="tile__img" />
      {hasReel && (
        <div className="tile__reel" aria-hidden="true">
          <div className="tile__reel-track">
            {doubled.map((src, i) => (
              <img key={`${src}-${i}`} src={`/assets/img/${src}`} alt="" />
            ))}
          </div>
        </div>
      )}
      <div className="tile__info">
        <span className="tile__cat">{t(`work.${tile.id}.cat`)}</span>
        <h3 className="tile__title">{t(`work.${tile.id}.title`)}</h3>
      </div>
    </a>
  );
}

export default function Work() {
  const { t } = useI18n();
  const [filter, setFilter] = useState("all");

  return (
    <section className="work" id="work">
      <div className="container">
        <div className="section-head">
          <p className="section-label reveal">
            <span>{t("work.label")}</span>
          </p>
          <h2 className="section-title reveal">{t("work.title")}</h2>
          <p className="section-sub reveal">{t("work.sub")}</p>
        </div>

        <div className="work__filters reveal">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter${filter === f.id ? " is-active" : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {t(f.key)}
            </button>
          ))}
        </div>

        <div className="work__grid" id="workGrid">
          {TILES.map((tile) => (
            <Tile key={tile.id} tile={tile} t={t} hidden={filter !== "all" && tile.cat !== filter} />
          ))}
        </div>
      </div>
    </section>
  );
}
