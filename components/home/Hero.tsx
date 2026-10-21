"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { withGsap } from "@/lib/gsap";
import { images } from "@/config/images";
import { copy } from "@/content/en";
import { ArrowIcon } from "../Icons";
import { WhatsAppLink } from "../WhatsApp";
import { HeroButterfly } from "./Butterfly";

/** CSS custom property for animation delay. */
const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

/*
 * Load animations are CSS (see globals.css) so the hero paints before
 * JavaScript arrives. "after-intro" waits for the first-visit loader.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const mainImg = useRef<HTMLDivElement>(null);
  const insetImg = useRef<HTMLDivElement>(null);
  const landing = useRef<HTMLSpanElement>(null);
  // Soft parallax: the main photo drifts slower than the page, the inset faster.
  useEffect(
    () =>
      withGsap(({ gsap }, mm) => {
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          const st = { trigger: section.current, start: "top top", end: "bottom top", scrub: true };
          gsap.to(mainImg.current, { yPercent: 8, ease: "none", scrollTrigger: st });
          gsap.to(insetImg.current, { yPercent: -30, ease: "none", scrollTrigger: st });
        });
      }),
    [],
  );

  const words = copy.home.heroLines;

  return (
    <section ref={section} className="relative overflow-hidden pt-24 sm:pt-28 lg:min-h-[100svh] lg:pt-0">
      <div className="frame relative grid grid-cols-12 gap-x-4 lg:min-h-[100svh] lg:items-end lg:pb-14">
        {/* Main photo */}
        <div className="relative col-span-12 mt-14 h-[62svh] sm:h-[70svh] lg:absolute lg:col-auto lg:end-gutter lg:top-24 lg:mt-0 lg:h-[calc(100svh-6rem)] lg:w-[46%]">
          <div className="absolute inset-0 overflow-hidden">
            <div ref={mainImg} className="absolute inset-x-0 -bottom-[4%] -top-[10%]">
              <div className="css-settle after-intro absolute inset-0" style={d(0)}>
                <Image
                  src={images.hero.main.src}
                  alt={images.hero.main.alt}
                  fill
                  preload
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="object-cover object-[50%_60%]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Inset photo, overlapping the seam between text and image */}
        <div
          ref={insetImg}
          className="relative z-10 col-span-5 col-start-1 -mt-24 aspect-[3/4] sm:col-span-4 sm:-mt-40 lg:absolute lg:col-auto lg:col-start-auto lg:bottom-[9%] lg:end-[38%] lg:mt-0 lg:w-[15%]"
        >
          <div className="css-lift after-intro relative h-full w-full overflow-hidden border-[6px] border-linen" style={d(0.5)}>
            <Image
              src={images.hero.inset.src}
              alt={images.hero.inset.alt}
              fill
              sizes="(min-width: 1024px) 16vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-20 order-first col-span-12 mt-4 lg:col-span-8 lg:mt-0 lg:pb-6">
          <p className="css-fade after-intro label mb-6 flex items-center gap-4 text-ink-soft lg:mb-10" style={d(0)}>
            <span className="block h-px w-10 bg-ink/40" aria-hidden="true" />
            {copy.home.eyebrow}
          </p>

          <h1
            className="font-serif text-[15.5vw] font-light leading-[0.88] tracking-[-0.02em] sm:text-display-xl"
            aria-label={words.join(" ")}
          >
            {words.map((w, i) => (
              <span
                key={w}
                aria-hidden="true"
                className={`block overflow-hidden pb-[0.06em] ${i === 1 ? "ps-[12%] italic text-wing lg:ps-[22%]" : ""} ${i === 2 ? "ps-[4%] lg:ps-[8%]" : ""}`}
              >
                <span ref={i === 1 ? landing : undefined} className="css-rise after-intro inline-block" style={d(0.12 + i * 0.12)}>
                  {w}
                </span>
              </span>
            ))}
          </h1>

          <div
            style={d(0.6)}
            className="css-lift after-intro mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:gap-14 lg:mt-12 lg:max-w-[44vw] lg:flex-col lg:items-start lg:gap-7"
          >
            <p className="max-w-[23rem] text-[1.02rem] leading-relaxed text-ink-soft">{copy.home.heroIntro}</p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href="/collection" className="group label flex min-h-[44px] items-center gap-4">
                <span className="link-draw pb-1">{copy.home.heroCta}</span>
                <ArrowIcon className="w-7 transition-transform duration-500 ease-silk group-hover:translate-x-1.5 rtl:rotate-180" />
              </Link>
              <WhatsAppLink message={copy.whatsapp.generalMessage} className="label min-h-[44px] text-wing">
                <span className="link-draw pb-1">{copy.nav.order}</span>
              </WhatsAppLink>
            </div>
          </div>
        </div>
      </div>

      <HeroButterfly sectionRef={section} landingRef={landing} />
    </section>
  );
}
