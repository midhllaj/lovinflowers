"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { copy } from "@/content/en";
import { defaultDesign, type Design } from "@/lib/builder/design";
import { remapSlots } from "@/lib/builder/shapes";
import { BouquetCanvas } from "../builder/BouquetCanvas";
import { SplitHeading, FadeUp } from "../motion/Reveal";
import { ArrowIcon } from "../Icons";

/** A finished example made with the builder: heart shape, blush paper, a butterfly on the rim. */
const showcase = (): Design => {
  const d = defaultDesign();
  return {
    ...d,
    shape: "heart",
    slots: remapSlots(d.slots, "heart"),
    ribbon: { ...d.ribbon, text: copy.home.designRibbon },
    toppers: [{ key: "showcase-butterfly", itemId: "butterfly", x: 72, y: 16 }],
  };
};

export function DesignYourOwn() {
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Mount the bouquet only when it scrolls into view, so its flowers pop in one by one.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setVisible(true), io.disconnect()), { rootMargin: "0px 0px -15% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-shell py-section" aria-labelledby="design-title">
      <div className="frame grid grid-cols-12 items-center gap-x-4 gap-y-14">
        <div className="col-span-12 sm:col-span-10 sm:col-start-2 lg:col-span-6 lg:col-start-1">
          <Link href="/design" data-cursor="Design" aria-label={copy.home.designCta} className="group relative block">
            <div ref={box} className="border border-line bg-linen p-3 transition-transform duration-700 ease-silk group-hover:-translate-y-1 sm:p-5">
              {visible ? <BouquetCanvas design={showcase()} stagger /> : <div className="aspect-[5/6] w-full" />}
            </div>
            <span className="label absolute -bottom-4 end-6 bg-ink px-4 py-2.5 text-linen">{copy.nav.design}</span>
          </Link>
        </div>

        <div className="col-span-12 lg:col-span-5 lg:col-start-8">
          <FadeUp as="p" className="label text-wing">
            {copy.home.designLabel}
          </FadeUp>
          <div id="design-title">
            <SplitHeading text={copy.home.designTitle} className="mt-6 text-display-lg" />
          </div>
          <FadeUp as="p" delay={0.15} className="mt-8 max-w-md text-ink-soft">
            {copy.home.designBody}
          </FadeUp>
          <ol className="mt-10 border-t border-line">
            {copy.home.designSteps.map((s, i) => (
              <FadeUp as="li" key={s} delay={0.2 + i * 0.08} className="flex items-baseline gap-6 border-b border-line py-4">
                <span className="label text-wing">0{i + 1}</span>
                <span className="font-serif text-2xl font-light">{s}</span>
              </FadeUp>
            ))}
          </ol>
          <FadeUp delay={0.4} className="mt-10">
            <Link
              href="/design"
              className="group label inline-flex min-h-[52px] items-center gap-4 bg-ink px-7 text-linen transition-colors duration-500 hover:bg-wing"
            >
              {copy.home.designCta}
              <ArrowIcon className="w-7 transition-transform duration-500 ease-silk group-hover:translate-x-1.5 rtl:rotate-180" />
            </Link>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
