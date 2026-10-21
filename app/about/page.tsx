import type { Metadata } from "next";
import Link from "next/link";
import { copy } from "@/content/en";
import { images } from "@/config/images";
import { PageIntro } from "@/components/PageIntro";
import { RevealImage, SplitHeading, FadeUp } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { ArrowIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "About Our Dubai Flower Studio",
  description:
    "Lovin Flowers is a Dubai flower studio making bouquets, roses and baskets by hand every day, with same-day delivery across Dubai.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const a = copy.about;
  return (
    <>
      <PageIntro label={a.label} title={a.title} intro={a.intro} />

      {/* Opening spread: one tall photo, one small, deliberately misaligned */}
      <section className="frame">
        <div className="grid grid-cols-12 gap-x-4">
          <div className="col-span-12 lg:col-span-7">
            <RevealImage src={images.about.studio.src} alt={images.about.studio.alt} priority sizes="(min-width: 1024px) 58vw, 100vw" className="aspect-[4/5] sm:aspect-[5/4]" />
          </div>
          <div className="col-span-7 col-start-6 -mt-20 sm:-mt-32 lg:col-span-3 lg:col-start-10 lg:mt-56">
            <Parallax speed={-0.3}>
              <RevealImage src={images.about.detail.src} alt={images.about.detail.alt} sizes="(min-width: 1024px) 25vw, 58vw" className="aspect-[3/4] border-[6px] border-linen" delay={0.2} />
            </Parallax>
          </div>
        </div>
      </section>

      {/* Three principles, each on its own line of the grid */}
      <section className="frame py-section">
        <ol className="border-t border-line">
          {a.sections.map((s, i) => (
            <li key={s.title} className="grid grid-cols-12 gap-x-4 gap-y-4 border-b border-line py-12 lg:py-16">
              <FadeUp as="span" className="label col-span-12 text-wing lg:col-span-2">
                0{i + 1}
              </FadeUp>
              <div className={`col-span-12 lg:col-span-5 ${i === 1 ? "lg:col-start-4" : i === 2 ? "lg:col-start-5" : "lg:col-start-3"}`}>
                <SplitHeading as="h2" text={s.title} className="text-display-sm" />
              </div>
              <FadeUp as="p" delay={0.15} className="col-span-12 max-w-md text-ink-soft lg:col-span-4 lg:col-start-9">
                {s.body}
              </FadeUp>
            </li>
          ))}
        </ol>
      </section>

      {/* Quote beside a tall photo */}
      <section className="frame pb-section">
        <div className="grid grid-cols-12 items-center gap-x-4 gap-y-12">
          <div className="col-span-10 lg:col-span-5 lg:col-start-2">
            <RevealImage src={images.about.portrait.src} alt={images.about.portrait.alt} sizes="(min-width: 1024px) 40vw, 85vw" className="aspect-[3/4]" />
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <blockquote>
              <SplitHeading as="p" text={`“${a.quote}”`} className="relative z-10 font-serif text-display-md font-light italic" />
            </blockquote>
            <FadeUp delay={0.2}>
              <Link href="/collection" className="group label mt-12 inline-flex min-h-[44px] items-center gap-4">
                <span className="link-draw pb-1">{a.cta}</span>
                <ArrowIcon className="w-7 transition-transform duration-500 ease-silk group-hover:translate-x-1.5 rtl:rotate-180" />
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>
    </>
  );
}
