import type { gsap as GSAP } from "gsap";
import type { ScrollTrigger as ST } from "gsap/ScrollTrigger";

type Loaded = { gsap: typeof GSAP; ScrollTrigger: typeof ST };
let loading: Promise<Loaded> | null = null;

/**
 * GSAP is only needed once the page is interactive, so it is loaded on demand
 * instead of sitting in the critical JavaScript (faster first paint).
 */
export const loadGsap = () =>
  (loading ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, s]) => {
    g.gsap.registerPlugin(s.ScrollTrigger);
    return { gsap: g.gsap, ScrollTrigger: s.ScrollTrigger };
  }));

/** Runs a gsap.matchMedia() setup once GSAP has loaded; returns a cleanup for useEffect. */
export const withGsap = (setup: (lib: Loaded, mm: gsap.MatchMedia) => void) => {
  let mm: gsap.MatchMedia | undefined;
  let cancelled = false;
  loadGsap().then((lib) => {
    if (cancelled) return;
    mm = lib.gsap.matchMedia();
    setup(lib, mm);
  });
  return () => {
    cancelled = true;
    mm?.revert();
  };
};

/** MotionPathPlugin, loaded only where a curved flight path is needed (the butterflies). */
export const loadMotionPath = () =>
  Promise.all([loadGsap(), import("gsap/MotionPathPlugin")]).then(([lib, { MotionPathPlugin }]) => {
    lib.gsap.registerPlugin(MotionPathPlugin);
    return lib;
  });
