import { copy } from "@/content/en";
import { googleRating, reviews } from "@/data/reviews";
import { SplitHeading, FadeUp } from "../motion/Reveal";
import { ArrowIcon, StarIcon } from "../Icons";

/** A row of five stars; the gold overlay is clipped to the score, so 4.9 shows a sliver of the last star empty. */
function Stars({ score, className = "h-4 w-4" }: { score: number; className?: string }) {
  const row = (
    <span className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} className={className} />
      ))}
    </span>
  );
  return (
    <span className="relative inline-flex" role="img" aria-label={copy.home.stars(score)}>
      <span className="text-ink/15">{row}</span>
      <span className="absolute inset-y-0 start-0 overflow-hidden text-wing" style={{ width: `${(score / 5) * 100}%` }}>
        {row}
      </span>
    </span>
  );
}

function GoogleLink() {
  return (
    <a href={googleRating.url} target="_blank" rel="noopener noreferrer" className="group label inline-flex min-h-[44px] items-center gap-4">
      <span className="link-draw pb-1">{copy.home.reviewsCta}</span>
      <ArrowIcon className="w-7 transition-transform duration-500 ease-silk group-hover:translate-x-1.5 rtl:rotate-180" />
    </a>
  );
}

export function Reviews() {
  const [whole, decimal] = googleRating.score.toFixed(1).split(".");

  const badge = (
    <div>
      <p className="font-serif text-[clamp(6rem,16vw,12rem)] font-light leading-[0.8] tracking-[-0.03em]">
        {whole}
        <span className="italic text-wing">.{decimal}</span>
      </p>
      <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Stars score={googleRating.score} className="h-5 w-5" />
        <span className="label text-ink-soft">{copy.home.reviewsRated}</span>
      </div>
    </div>
  );

  return (
    <section className="frame py-section" aria-labelledby="reviews-title">
      <div className="grid grid-cols-12 gap-x-4 gap-y-16">
        <div className={`col-span-12 ${reviews.length ? "lg:sticky lg:top-28 lg:col-span-5 lg:self-start" : "lg:col-span-6"}`}>
          <FadeUp as="p" className="label text-wing">
            {copy.home.reviewsLabel}
          </FadeUp>
          <div id="reviews-title">
            <SplitHeading text={copy.home.reviewsTitle} className="mt-6 text-display-md" />
          </div>
          <FadeUp delay={0.15} className="mt-14">
            {badge}
          </FadeUp>
          {reviews.length > 0 && (
            <FadeUp delay={0.25} className="mt-10">
              <GoogleLink />
            </FadeUp>
          )}
        </div>

        {reviews.length > 0 ? (
          <ul className="col-span-12 border-t border-line lg:col-span-6 lg:col-start-7">
            {reviews.map((r, i) => (
              <FadeUp as="li" key={r.name + i} delay={0.05} className={`border-b border-line py-10 sm:py-12 ${i % 2 ? "lg:ps-[14%]" : ""}`}>
                <figure>
                  <Stars score={r.rating} />
                  <blockquote className="mt-6 font-serif text-[1.55rem] font-light italic leading-snug sm:text-[1.9rem]">
                    &ldquo;{r.text}&rdquo;
                  </blockquote>
                  <figcaption className="label mt-6 flex flex-wrap gap-x-3 gap-y-1 text-ink-soft">
                    <span className="text-ink">{r.name}</span>
                    <span aria-hidden="true">·</span>
                    <span>{copy.home.reviewsSource}</span>
                    {r.when && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{r.when}</span>
                      </>
                    )}
                  </figcaption>
                </figure>
              </FadeUp>
            ))}
          </ul>
        ) : (
          <FadeUp delay={0.2} className="col-span-12 lg:col-span-5 lg:col-start-8 lg:self-end">
            <p className="max-w-sm text-ink-soft">{copy.home.reviewsIntro}</p>
            <div className="mt-8">
              <GoogleLink />
            </div>
          </FadeUp>
        )}
      </div>
    </section>
  );
}
