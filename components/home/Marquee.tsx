import { copy } from "@/content/en";

/** Slow ribbon of serif text. Pure CSS transform; stops for reduced motion. */
export function Marquee() {
  const items = [...copy.home.marquee, ...copy.home.marquee];
  return (
    <div className="overflow-hidden border-y border-line py-7 sm:py-9">
      <p className="sr-only">{copy.home.marquee.join(". ")}</p>
      <div className="marquee flex w-max" aria-hidden="true">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {items.map((t, i) => (
              <span key={i} className="flex items-center whitespace-nowrap font-serif text-[2rem] font-light italic sm:text-[3rem]">
                <span className="px-8 sm:px-12">{t}</span>
                <span className="block h-1.5 w-1.5 rounded-full bg-wing" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
