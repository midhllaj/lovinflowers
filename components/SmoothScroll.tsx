"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { loadGsap } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let instance: Lenis | undefined;
    let cleanup = () => {};
    let cancelled = false;

    // Lenis and GSAP load after first paint; scrolling is native until then.
    Promise.all([import("lenis"), loadGsap()]).then(([{ default: LenisCtor }, { gsap, ScrollTrigger }]) => {
      if (cancelled) return;
      instance = new LenisCtor({ lerp: 0.1, smoothWheel: true });
      instance.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => instance!.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(instance);

      // Re-measure pinned/parallax sections once fonts and images have settled, so nothing jumps mid-scroll.
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      if (document.readyState === "complete") refresh();
      else window.addEventListener("load", refresh, { once: true });

      cleanup = () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("load", refresh);
      };
    });

    return () => {
      cancelled = true;
      cleanup();
      instance?.destroy();
      setLenis(null);
    };
  }, []);

  // New page: jump to top, then let ScrollTrigger measure the new layout.
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
    const id = window.setTimeout(() => loadGsap().then(({ ScrollTrigger }) => ScrollTrigger.refresh()), 120);
    return () => window.clearTimeout(id);
  }, [pathname, lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
