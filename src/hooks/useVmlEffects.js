import { useEffect } from "react";

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

/**
 * Efectos globales de la landing (scroll, cursor, magnetismo, spotlight,
 * contadores, reveal-on-scroll). Porta 1:1 el comportamiento de
 * js/main.js del sitio vanilla original, pero como un único efecto React
 * que se monta una vez que el árbol ya está en el DOM.
 */
export function useVmlEffects({ reducedMotion, isTouch }) {
  // Nav: fondo al hacer scroll
  useEffect(() => {
    const nav = $("#nav");
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal on scroll (.reveal, .section-label, .contact__title)
  useEffect(() => {
    const els = $$(".reveal, .section-label, .contact__title");
    const labelEls = $$(".section-label, .contact__title");
    if (reducedMotion || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      labelEls.forEach((el) => el.classList.add("is-revealed"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            const el = e.target;
            const delay = el.classList.contains("reveal") ? Math.min(i * 60, 180) : 0;
            setTimeout(() => {
              el.classList.add("is-in");
              el.classList.add("is-revealed");
            }, delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    [...els, ...labelEls].forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [reducedMotion]);

  // Contadores animados de la sección Stats
  useEffect(() => {
    const nums = $$(".stat__num");
    if (!nums.length) return;
    const run = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      if (reducedMotion) {
        el.textContent = target;
        return;
      }
      const dur = 1400;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(eased * target);
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) {
      nums.forEach(run);
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run(e.target);
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.6 }
    );
    nums.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [reducedMotion]);

  // Parallax ligero del video del hero
  useEffect(() => {
    if (reducedMotion) return;
    const video = $(".hero__video");
    if (!video) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          video.style.transform = `translateY(${y * 0.18}px) scale(1.05)`;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  // Cursor personalizado (solo desktop con hover fino)
  useEffect(() => {
    if (isTouch || reducedMotion) return;
    const cursor = $("#cursor");
    if (!cursor) return;
    document.body.classList.add("has-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let raf;
    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    const render = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(render);
    };
    render();

    const targets = $$("[data-cursor]");
    const onEnter = () => cursor.classList.add("is-active");
    const onLeave = () => cursor.classList.remove("is-active");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    const onWindowOut = (e) => {
      if (!e.relatedTarget) cursor.style.opacity = "0";
    };
    const onWindowOver = () => {
      cursor.style.opacity = "1";
    };
    window.addEventListener("mouseout", onWindowOut);
    window.addEventListener("mouseover", onWindowOver);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onWindowOut);
      window.removeEventListener("mouseover", onWindowOver);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      document.body.classList.remove("has-cursor");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTouch, reducedMotion]);

  // Botones magnéticos (atracción hacia el cursor)
  useEffect(() => {
    if (isTouch || reducedMotion) return;
    const els = $$("[data-magnetic]");
    const cleanups = els.map((el) => {
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const mx = (e.clientX - (r.left + r.width / 2)) * 0.3;
        const my = (e.clientY - (r.top + r.height / 2)) * 0.45;
        el.style.transform = `translate(${mx}px, ${my}px)`;
      };
      const onLeave = () => {
        el.style.transform = "";
      };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    });
    return () => cleanups.forEach((fn) => fn());
  }, [isTouch, reducedMotion]);

  // Spotlight en las tarjetas de servicio (glow que sigue el cursor)
  useEffect(() => {
    if (isTouch) return;
    const cards = $$(".service");
    const onMove = (e, card) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    };
    const handlers = cards.map((card) => {
      const fn = (e) => onMove(e, card);
      card.addEventListener("mousemove", fn);
      return () => card.removeEventListener("mousemove", fn);
    });
    return () => handlers.forEach((fn) => fn());
  }, [isTouch]);
}
