"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";
import type { ProductImage } from "@/data/products";
import { copy } from "@/content/en";

const silk = [0.22, 1, 0.36, 1] as const;

/**
 * Desktop: one large photo with thumbnails to switch.
 * Phones: a swipeable rail with a counter.
 */
export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const rail = useRef<HTMLDivElement>(null);

  const onRailScroll = () => {
    const el = rail.current;
    if (!el) return;
    setActive(Math.round(Math.abs(el.scrollLeft) / el.clientWidth));
  };

  return (
    <div>
      {/* Phones / tablets */}
      <div className="relative -mx-gutter lg:hidden">
        <div ref={rail} onScroll={onRailScroll} className="rail flex snap-x snap-mandatory overflow-x-auto" data-lenis-prevent>
          {images.map((img, i) => (
            <div key={img.src} className="relative aspect-[4/5] w-full shrink-0 snap-center bg-shell">
              <Image src={img.src} alt={img.alt} fill preload={i === 0} fetchPriority={i === 0 ? "high" : "auto"} sizes="100vw" className="object-cover" />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <p className="label absolute bottom-4 start-gutter bg-linen/90 px-3 py-1.5" aria-live="polite">
            {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </p>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden gap-6 lg:flex">
        {images.length > 1 && (
          <div className="flex w-20 shrink-0 flex-col gap-3" role="tablist" aria-label={`${name} photos`}>
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-label={copy.product.photo(i + 1, images.length)}
                onClick={() => setActive(i)}
                className={`relative aspect-[3/4] overflow-hidden bg-shell transition-opacity duration-500 ${
                  active === i ? "opacity-100 outline outline-1 outline-offset-4 outline-ink" : "opacity-50 hover:opacity-100"
                }`}
              >
                <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="relative aspect-[4/5] flex-1 overflow-hidden bg-shell">
          <m.div className="absolute inset-0" initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: silk }}>
            <AnimatePresence initial={false}>
              <m.div
                key={active}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              >
                <Image
                  src={images[active].src}
                  alt={images[active].alt}
                  fill
                  loading="eager"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </m.div>
            </AnimatePresence>
          </m.div>
        </div>
      </div>
    </div>
  );
}
