"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, m } from "framer-motion";
import { copy } from "@/content/en";
import { activeCategories, categorySlug, occasionSlug, occasions, products } from "@/data/products";
import { ProductCard } from "../ProductCard";
import { loadGsap } from "@/lib/gsap";

// A repeating, hand-tuned rhythm for desktop: alternating widths, start columns and drops.
const rhythm = [
  { cls: "lg:col-span-5 lg:col-start-1", aspect: "aspect-[4/5]" },
  { cls: "lg:col-span-4 lg:col-start-8 lg:mt-48", aspect: "aspect-[3/4]" },
  { cls: "lg:col-span-4 lg:col-start-2 lg:-mt-10", aspect: "aspect-[3/4]" },
  { cls: "lg:col-span-5 lg:col-start-7 lg:mt-28", aspect: "aspect-[4/5]" },
  { cls: "lg:col-span-6 lg:col-start-4", aspect: "aspect-[5/4]" },
];

const silk = [0.22, 1, 0.36, 1] as const;

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`label relative min-h-[40px] whitespace-nowrap rounded-full border px-4 transition-colors duration-500 ${
        active ? "border-ink bg-ink text-linen" : "border-line text-ink-soft hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function CollectionGrid() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const typeParam = params.get("type");
  const occasionParam = params.get("occasion");
  const type = activeCategories.find((c) => categorySlug(c) === typeParam) ?? null;
  const occasion = occasions.find((o) => occasionSlug(o) === occasionParam) ?? null;

  const setFilter = (key: "type" | "occasion", value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // Layout height changes — let pinned/parallax sections re-measure.
    window.setTimeout(() => loadGsap().then(({ ScrollTrigger }) => ScrollTrigger.refresh()), 900);
  };

  const list = useMemo(
    () => products.filter((p) => (!type || p.category === type) && (!occasion || p.occasion.includes(occasion))),
    [type, occasion],
  );

  return (
    <section className="frame pb-section" aria-label={copy.collection.label}>
      {/* Filters */}
      <div className="sticky top-[68px] z-30 -mx-gutter border-y border-line bg-linen/95 px-gutter py-4 sm:top-[76px]">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between xl:gap-10">
          <div className="flex items-center gap-4">
            <span className="label w-20 shrink-0 text-ink-soft">{copy.collection.type}</span>
            <div className="rail -me-gutter flex gap-2 overflow-x-auto pe-gutter" data-lenis-prevent>
              <Chip active={!type} onClick={() => setFilter("type", null)}>
                {copy.collection.all}
              </Chip>
              {activeCategories.map((c) => (
                <Chip key={c} active={type === c} onClick={() => setFilter("type", categorySlug(c))}>
                  {c}
                </Chip>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="label w-20 shrink-0 text-ink-soft">{copy.collection.occasion}</span>
            <div className="rail -me-gutter flex gap-2 overflow-x-auto pe-gutter" data-lenis-prevent>
              <Chip active={!occasion} onClick={() => setFilter("occasion", null)}>
                {copy.collection.all}
              </Chip>
              {occasions.map((o) => (
                <Chip key={o} active={occasion === o} onClick={() => setFilter("occasion", occasionSlug(o))}>
                  {o}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </div>

      <h2 className="label mt-8 text-ink-soft" aria-live="polite">
        {copy.collection.count(list.length)}
      </h2>

      <LayoutGroup>
        <m.ul layout className="mt-10 grid grid-cols-12 gap-x-4 gap-y-20 lg:gap-x-6 lg:gap-y-28">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p, i) => {
              const r = rhythm[i % rhythm.length];
              return (
                <m.li
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.8, ease: silk, delay: Math.min(i, 6) * 0.05 }}
                  className={`col-span-12 w-[88%] sm:w-[70%] lg:w-auto ${i % 2 ? "justify-self-end lg:justify-self-auto" : ""} ${r.cls}`}
                >
                  <ProductCard product={p} aspect={r.aspect} sizes="(min-width: 1024px) 40vw, 88vw" priority={i === 0} />
                </m.li>
              );
            })}
          </AnimatePresence>
        </m.ul>
      </LayoutGroup>

      {list.length === 0 && (
        <div className="py-24 text-center">
          <p className="mx-auto max-w-md font-serif text-display-sm font-light">{copy.collection.empty}</p>
          <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="label link-draw mt-8 pb-1">
            {copy.collection.clear}
          </button>
        </div>
      )}
    </section>
  );
}
