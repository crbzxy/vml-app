import { useState } from "react";
import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Studio from "./components/Studio";
import Services from "./components/Services";
import Work from "./components/Work";
import Stats from "./components/Stats";
import Clients from "./components/Clients";
import Process from "./components/Process";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { useReducedMotion, useIsTouch } from "./hooks/useMediaFlags";
import { useVmlEffects } from "./hooks/useVmlEffects";

export default function App() {
  const reducedMotion = useReducedMotion();
  const isTouch = useIsTouch();
  const [heroRevealed, setHeroRevealed] = useState(false);

  useVmlEffects({ reducedMotion, isTouch });

  return (
    <>
      <a href="#hero" className="skip-link">
        Saltar al contenido
      </a>

      <div className="atmosphere" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <Preloader reducedMotion={reducedMotion} onDone={() => setHeroRevealed(true)} />
      <Cursor />
      <Nav />

      <main>
        <Hero revealed={heroRevealed} />
        <Marquee />
        <Studio />
        <Services />
        <Work />
        <Stats />
        <Clients />
        <Process />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
