"use client";

import { forwardRef, useEffect, useRef, useState, type RefObject } from "react";
import { loadMotionPath } from "@/lib/gsap";

type State = "fly" | "rest" | "still";

/** The logo butterfly as three layers: two wings that flap around the body, and the body on top. */
export const ButterflySprite = forwardRef<HTMLDivElement, { state: State; className?: string }>(function ButterflySprite(
  { state, className = "" },
  ref,
) {
  return (
    <div ref={ref} className={`bf ${className}`} data-state={state} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/butterfly/wing-left.webp" alt="" className="bf-wing-l" draggable={false} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/butterfly/wing-right.webp" alt="" className="bf-wing-r" draggable={false} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/butterfly/body.webp" alt="" draggable={false} />
    </div>
  );
});

/** Delay before the hero butterfly takes off: after the loader (first visit) and the headline. */
const takeOff = () => (document.documentElement.dataset.intro === "seen" ? 1.7 : 2.75);

/**
 * Hero butterfly: flutters in from the lower left, loops over the photo and
 * lands on the given word. Scrolling lifts it off and away.
 */
export function HeroButterfly({ sectionRef, landingRef }: { sectionRef: RefObject<HTMLElement | null>; landingRef: RefObject<HTMLElement | null> }) {
  const drift = useRef<HTMLDivElement>(null);
  const flight = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>("fly");

  useEffect(() => {
    let cancelled = false;
    let revert = () => {};

    loadMotionPath().then(({ gsap }) => {
      const section = sectionRef.current;
      const word = landingRef.current;
      const fly = flight.current;
      if (cancelled || !section || !word || !fly) return;

      // Perch on the top of the word's last letter.
      const perch = () => {
        const s = section.getBoundingClientRect();
        const w = word.getBoundingClientRect();
        const size = fly.offsetWidth;
        return { x: w.right - s.left - size * 0.7, y: w.top - s.top - size * 0.3 };
      };

      const mm = gsap.matchMedia();
      revert = () => mm.revert();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        setState("still");
        gsap.set(fly, { ...perch(), opacity: 1 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let landed = false;
        const { width: w, height: h } = section.getBoundingClientRect();
        gsap.set(fly, { x: -w * 0.1, y: h * 0.8, rotation: -18, opacity: 0 });

        // The flight is planned at take-off, once the headline has finished rising into place.
        gsap.delayedCall(takeOff(), () => {
          const end = perch();
          const path = [
            { x: w * 0.2, y: h * 0.5 },
            { x: w * 0.44, y: h * 0.7 },
            { x: w * 0.68, y: h * 0.28 },
            { x: w * 0.84, y: h * 0.52 },
            { x: end.x + w * 0.1, y: end.y - h * 0.16 },
            end,
          ];
          gsap
            .timeline()
            .to(fly, { opacity: 1, duration: 0.5 }, 0)
            .to(fly, { duration: 3.6, ease: "power1.inOut", motionPath: { path, curviness: 1.25 } }, 0)
            .to(fly, { keyframes: { rotation: [-18, 14, -10, 20, -12, 4, 0] }, duration: 3.6, ease: "none" }, 0)
            .call(() => {
              landed = true;
              setState("rest");
            })
            // a small settle as the feet touch down
            .to(fly, { y: "+=3", duration: 0.25, yoyo: true, repeat: 1, ease: "sine.inOut" });
        });

        // Scroll lifts it off the word and away over the photo.
        gsap.to(drift.current, {
          x: () => w * 0.22,
          y: () => -h * 0.65,
          rotation: 22,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.9,
            onUpdate: (self) => setState(self.progress > 0.01 || !landed ? "fly" : "rest"),
          },
        });

        // Keep it on its word if the layout changes after landing.
        const onResize = () => landed && gsap.set(fly, perch());
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
      });
    });

    return () => {
      cancelled = true;
      revert();
    };
  }, [sectionRef, landingRef]);

  return (
    <div ref={drift} className="pointer-events-none absolute left-0 top-0 z-30">
      <div ref={flight} className="w-[44px] opacity-0 will-change-transform sm:w-[60px] lg:w-[72px]">
        <ButterflySprite state={state} />
      </div>
    </div>
  );
}

/** A second butterfly that drifts across the screen as its section scrolls past. */
export function DriftButterfly() {
  const box = useRef<HTMLDivElement>(null);
  const flight = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let revert = () => {};

    loadMotionPath().then(({ gsap }) => {
      const el = box.current;
      const fly = flight.current;
      if (cancelled || !el || !fly) return;
      const mm = gsap.matchMedia();
      revert = () => mm.revert();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const w = el.offsetWidth;
        gsap.set(fly, { x: -w * 0.12, y: 40, rotation: 12, opacity: 1 });
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 } })
          .to(
            fly,
            {
              motionPath: {
                path: [
                  { x: w * 0.18, y: -60 },
                  { x: w * 0.42, y: 30 },
                  { x: w * 0.68, y: -90 },
                  { x: w * 1.12, y: -30 },
                ],
                curviness: 1.4,
              },
              ease: "none",
              duration: 1,
            },
            0,
          )
          .to(fly, { keyframes: { rotation: [12, -14, 10, -16, 6] }, ease: "none", duration: 1 }, 0);
      });
    });

    return () => {
      cancelled = true;
      revert();
    };
  }, []);

  return (
    <div ref={box} className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-0" aria-hidden="true">
      <div ref={flight} className="w-[40px] opacity-0 will-change-transform sm:w-[54px]">
        <ButterflySprite state="fly" />
      </div>
    </div>
  );
}
