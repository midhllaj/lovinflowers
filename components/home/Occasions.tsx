"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { images } from "@/config/images";
import { copy } from "@/content/en";
import { occasions, occasionSlug, products } from "@/data/products";
import { SplitHeading, FadeUp } from "../motion/Reveal";
import { ArrowIcon } from "../Icons";

export function Occasions() {
  const [active, setActive] = useState<string>(occasions[0]);

  return (
    <section className="frame py-section" aria-labelledby="occasions-title">
      <div className="grid grid-cols-12 gap-x-4">
        <div className="col-span-12 lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          <FadeUp as="p" className="label text-wing">
            {copy.home.occasionsLabel}
          </FadeUp>
          <div id="occasions-title">
            <SplitHeading text={copy.home.occasionsTitle} className="mt-6 text-display-md" />
          </div>

          {/* Sticky preview — desktop only */}
          <div className="relative mt-14 hidden aspect-[4/5] w-[78%] overflow-hidden bg-shell lg:block" aria-hidden="true">
            <AnimatePresence initial={false}>
              <m.div
                key={active}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image src={images.occasions[active].src} alt="" fill sizes="25vw" className="object-cover" />
              </m.div>
            </AnimatePresence>
          </div>
        </div>

        <ul className="col-span-12 mt-14 border-t border-line lg:col-span-7 lg:col-start-6 lg:mt-24">
          {occasions.map((o, i) => {
            const count = products.filter((p) => p.occasion.includes(o)).length;
            return (
              <li key={o} className="border-b border-line">
                <Link
                  href={`/collection?occasion=${occasionSlug(o)}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 py-6 sm:gap-x-8 sm:py-8"
                  onMouseEnter={() => setActive(o)}
                  onFocus={() => setActive(o)}
                >
                  <span className="relative h-16 w-12 overflow-hidden bg-shell sm:h-20 sm:w-16 lg:hidden">
                    <Image src={images.occasions[o].src} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                  <span className="label hidden w-10 text-ink-soft lg:block">0{i + 1}</span>
                  <span className="min-w-0">
                    <span className="block font-serif text-[2.4rem] font-light leading-none transition-[transform,color] duration-700 ease-silk group-hover:translate-x-3 group-hover:text-wing sm:text-[3.6rem] lg:text-[4.4rem] rtl:group-hover:-translate-x-3">
                      {o}
                    </span>
                    <span className="mt-2 block text-sm text-ink-soft">{copy.home.occasionNotes[o]}</span>
                  </span>
                  <span className="flex items-center gap-4">
                    <span className="label hidden text-ink-soft sm:inline">{count}</span>
                    <ArrowIcon className="w-7 transition-transform duration-500 ease-silk group-hover:translate-x-1.5 rtl:rotate-180" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
