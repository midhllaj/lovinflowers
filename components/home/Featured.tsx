"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { withGsap } from "@/lib/gsap";
import { copy } from "@/content/en";
import { products } from "@/data/products";
import { ProductCard } from "../ProductCard";
import { SplitHeading, FadeUp } from "../motion/Reveal";
import { ArrowIcon } from "../Icons";

// Desktop: varied widths, heights and drops so the row reads like a magazine spread.
// Phones: every card the same 4:5 shape, so the swipe rail sits evenly.
const layout = [
// Widths are capped by screen height too, so every photo (plus offset and caption) fits in the pinned view.
  { w: "lg:w-[min(30vw,46svh)]", aspect: "lg:aspect-[4/5]", offset: "lg:mt-0" },
  { w: "lg:w-[min(24vw,40svh)]", aspect: "lg:aspect-[3/4]", offset: "lg:mt-[9svh]" },
  { w: "lg:w-[min(34vw,66svh)]", aspect: "lg:aspect-[5/4]", offset: "lg:mt-[3svh]" },
  { w: "lg:w-[min(26vw,40svh)]", aspect: "lg:aspect-[3/4]", offset: "lg:mt-[11svh]" },
  { w: "lg:w-[min(28vw,44svh)]", aspect: "lg:aspect-[4/5]", offset: "lg:mt-[1svh]" },
];

export function Featured() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [pinned, setPinned] = useState(false);
  const [active, setActive] = useState(0);
  const featured = products.filter((p) => p.featured).slice(0, layout.length);

  // Desktop: pin the section and turn vertical scroll into horizontal travel.
  // Phones / reduced motion: a native swipe rail instead.
  useEffect(
    () =>
      withGsap(({ gsap }, mm) => {
        mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
          setPinned(true);
          const el = track.current!;
          const distance = () => el.scrollWidth - window.innerWidth;
          gsap.to(el, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section.current,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              // Lenis already eases the scroll; scrub: true follows it 1:1 instead of easing twice (which feels laggy).
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          return () => setPinned(false);
        });
      }),
    [],
  );

  // Swipe progress: the line fills as you swipe (transform only), the counter follows the nearest card.
  const onRailScroll = () => {
    const el = track.current;
    if (!el || pinned) return;
    const max = el.scrollWidth - el.clientWidth;
    const progress = max > 0 ? Math.abs(el.scrollLeft) / max : 0;
    if (bar.current) bar.current.style.transform = `scaleX(${Math.max(progress, 1 / featured.length)})`;
    setActive(Math.round(progress * (featured.length - 1)));
  };

  const viewAll = (
    <Link href="/collection" className="group label inline-flex min-h-[44px] items-center gap-4">
      <span className="link-draw pb-1">{copy.home.featuredAll}</span>
      <ArrowIcon className="w-7 transition-transform duration-500 ease-silk group-hover:translate-x-1.5 rtl:rotate-180" />
    </Link>
  );

  return (
    <section
      ref={section}
      className="relative overflow-hidden bg-shell py-20 sm:py-24 lg:flex lg:h-[100svh] lg:items-center lg:py-0"
      aria-label={copy.home.featuredLabel}
    >
      {/* Phones and tablets: heading sits above the swipe rail */}
      <div className="frame mb-10 lg:hidden">
        <FadeUp as="p" className="label text-wing">
          {copy.home.featuredLabel}
        </FadeUp>
        <SplitHeading text={copy.home.featuredTitle} className="mt-5 text-display-md" />
      </div>

      <div
        ref={track}
        onScroll={onRailScroll}
        data-lenis-prevent
        className={`flex items-start gap-4 px-gutter will-change-transform sm:gap-6 lg:gap-[5vw] ${
          pinned ? "" : "rail scroll-px-gutter snap-x snap-mandatory overflow-x-auto"
        }`}
      >
        {/* Desktop intro panel travels with the cards */}
        <div className="hidden shrink-0 lg:block lg:w-[28vw] lg:self-center">
          <FadeUp as="p" className="label text-wing">
            {copy.home.featuredLabel}
          </FadeUp>
          <SplitHeading text={copy.home.featuredTitle} className="mt-6 text-display-md" />
          <FadeUp delay={0.2} className="mt-10">
            {viewAll}
          </FadeUp>
          <p className="label mt-16 flex items-center gap-3 text-ink-soft" aria-hidden="true">
            <span className="block h-px w-10 bg-ink/40" /> {copy.home.scroll}
          </p>
        </div>

        {featured.map((p, i) => (
          <div key={p.slug} className={`w-[78vw] shrink-0 snap-start sm:w-[42vw] ${layout[i].w} ${layout[i].offset}`}>
            <ProductCard product={p} aspect={`aspect-[4/5] ${layout[i].aspect}`} index={i} sizes="(min-width: 1024px) 34vw, 78vw" />
          </div>
        ))}

        <div className="w-px shrink-0 lg:w-[4vw]" aria-hidden="true" />
      </div>

      {/* Phones and tablets: swipe progress, counter and link to everything */}
      <div className="frame mt-8 flex items-center gap-6 lg:hidden">
        <span className="label tabular-nums text-ink-soft" aria-hidden="true">
          {String(active + 1).padStart(2, "0")} / {String(featured.length).padStart(2, "0")}
        </span>
        <span className="relative h-px flex-1 bg-ink/15" aria-hidden="true">
          <span
            ref={bar}
            className="absolute inset-0 origin-left bg-ink transition-transform duration-300 ease-silk rtl:origin-right"
            style={{ transform: `scaleX(${1 / featured.length})` }}
          />
        </span>
        {viewAll}
      </div>
    </section>
  );
}
