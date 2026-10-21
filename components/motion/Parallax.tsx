"use client";

import { useEffect, useRef } from "react";
import { withGsap } from "@/lib/gsap";

/** Drifts its content vertically while scrolling. speed: -1…1 (negative = moves up faster). */
export function Parallax({
  children,
  speed = 0.15,
  className = "",
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(
    () =>
      withGsap(({ gsap }, mm) => {
        const el = ref.current;
        if (!el || !speed) return;
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.fromTo(
            el,
            { yPercent: speed * 40 },
            {
              yPercent: speed * -40,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      }),
    [speed],
  );

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
