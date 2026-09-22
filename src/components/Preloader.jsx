import { useEffect, useRef, useState } from "react";
import VortexMark from "./icons/VortexMark";

/**
 * Barra de progreso simulada + retiro del preloader. Al terminar agrega
 * `is-revealed` al <section class="hero"> para disparar la animación de
 * las líneas del título (ver .line__inner en styles.css).
 */
export default function Preloader({ reducedMotion, onDone }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const finishedRef = useRef(false);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIsDone(true);
    document.body.classList.add("is-loaded");
    requestAnimationFrame(() => onDone?.());
    setTimeout(() => setIsHidden(true), 1100);
  };

  useEffect(() => {
    if (reducedMotion) {
      setProgress(100);
      const t = setTimeout(finish, 250);
      return () => clearTimeout(t);
    }
    let p = 0;
    const tick = setInterval(() => {
      p += Math.random() * 14 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(tick);
        setTimeout(finish, 350);
      }
      setProgress(p);
    }, 110);
    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // Failsafe: nunca dejar la pantalla cubierta si algo falla.
  useEffect(() => {
    const t = setTimeout(() => {
      if (!finishedRef.current) finish();
      setIsHidden(true);
    }, 3000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isHidden) return null;

  return (
    <div className={`preloader${isDone ? " is-done" : ""}`} id="preloader" aria-hidden="true">
      <div className="preloader__inner">
        <VortexMark className="preloader__mark" width="96" height="96" />
        <div className="preloader__bar">
          <span style={{ width: `${progress}%` }} />
        </div>
        <span className="preloader__count">{Math.floor(progress)}</span>
      </div>
    </div>
  );
}
