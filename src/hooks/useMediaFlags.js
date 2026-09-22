import { useEffect, useState } from "react";

function matches(query) {
  if (typeof window === "undefined") return false;
  return window.matchMedia(query).matches;
}

/** Respeta prefers-reduced-motion; se reevalúa si el usuario lo cambia en vivo. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => matches("(prefers-reduced-motion: reduce)"));
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Detecta dispositivos táctiles / sin hover preciso, para desactivar cursor y magnetismo. */
export function useIsTouch() {
  const [isTouch] = useState(() => matches("(hover: none), (pointer: coarse)"));
  return isTouch;
}
