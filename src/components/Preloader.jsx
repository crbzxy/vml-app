import { useEffect, useRef, useState } from "react";
import VortexMark from "./icons/VortexMark";

const SESSION_KEY = "vml-preloader-seen";

/**
 * Preloader corto amarrado a fonts.ready. En visitas repetidas de la misma
 * sesión se omite. Dispara onDone para revelar el título del hero.
 */
export default function Preloader({ reducedMotion, onDone }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const finishedRef = useRef(false);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setProgress(100);
    setIsDone(true);
    document.body.classList.add("is-loaded");
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* noop */
    }
    requestAnimationFrame(() => onDone?.());
    setTimeout(() => setIsHidden(true), 700);
  };

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* noop */
    }

    if (seen || reducedMotion) {
      setProgress(100);
      const t = setTimeout(finish, seen ? 0 : 200);
      return () => clearTimeout(t);
    }

    let cancelled = false;
    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(p + 18 + Math.random() * 12, 92);
      if (!cancelled) setProgress(p);
    }, 80);

    const ready = typeof document.fonts?.ready?.then === "function" ? document.fonts.ready : Promise.resolve();

    const maxWait = setTimeout(() => {
      if (!cancelled) finish();
    }, 1200);

    ready.then(() => {
      if (cancelled || finishedRef.current) return;
      clearInterval(tick);
      setProgress(100);
      setTimeout(finish, 120);
    });

    return () => {
      cancelled = true;
      clearInterval(tick);
      clearTimeout(maxWait);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

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
