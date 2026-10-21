import Link from "next/link";
import { images } from "@/config/images";
import { copy } from "@/content/en";
import { RevealImage, SplitHeading, FadeUp } from "../motion/Reveal";
import { Parallax } from "../motion/Parallax";
import { ArrowIcon } from "../Icons";

export function Story() {
  return (
    <section className="frame overflow-x-clip py-section" aria-labelledby="story-title">
      <div className="grid grid-cols-12 gap-x-4">
        <div className="relative col-span-11 lg:col-span-6">
          <RevealImage
            src={images.story.large.src}
            alt={images.story.large.alt}
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="aspect-[4/5]"
          />
          <Parallax speed={-0.5} className="absolute -bottom-16 -end-[18%] z-10 w-[46%] sm:-end-[22%] lg:-bottom-24 lg:-end-[34%] lg:w-[42%]">
            <RevealImage
              src={images.story.small.src}
              alt={images.story.small.alt}
              sizes="(min-width: 1024px) 20vw, 40vw"
              className="aspect-[3/4] border-[6px] border-linen"
              delay={0.25}
            />
          </Parallax>
        </div>

        <div className="col-span-12 mt-32 lg:col-span-4 lg:col-start-9 lg:mt-0 lg:pt-[18%]">
          <FadeUp as="p" className="label text-wing">
            {copy.home.storyLabel}
          </FadeUp>
          <div id="story-title" className="lg:-ms-[38%]">
            <SplitHeading text={copy.home.storyTitle} className="relative z-20 mt-6 text-display-md" />
          </div>
          {copy.home.storyBody.map((p, i) => (
            <FadeUp key={i} as="p" delay={0.1 + i * 0.1} className="mt-8 max-w-md text-ink-soft first:mt-10">
              {p}
            </FadeUp>
          ))}
          <FadeUp delay={0.3}>
            <Link href="/about" className="group label mt-10 inline-flex min-h-[44px] items-center gap-4">
              <span className="link-draw pb-1">{copy.home.storyCta}</span>
              <ArrowIcon className="w-7 transition-transform duration-500 ease-silk group-hover:translate-x-1.5 rtl:rotate-180" />
            </Link>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
