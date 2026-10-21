import Link from "next/link";
import { images } from "@/config/images";
import { copy } from "@/content/en";
import { RevealImage, SplitHeading, FadeUp } from "../motion/Reveal";
import { Parallax } from "../motion/Parallax";
import { ArrowIcon } from "../Icons";

export function EventsTeaser() {
  return (
    <section className="relative overflow-hidden bg-wing-deep py-section text-linen" aria-labelledby="events-title">
      <div className="frame grid grid-cols-12 gap-x-4 gap-y-14">
        <div className="col-span-12 lg:col-span-6">
          <FadeUp as="p" className="label text-blush">
            {copy.home.eventsLabel}
          </FadeUp>
          <div id="events-title">
            <SplitHeading text={copy.home.eventsTitle} className="mt-6 text-display-lg" />
          </div>
        </div>

        <div className="col-span-12 sm:col-span-7 lg:col-span-4 lg:col-start-9 lg:self-end">
          <FadeUp as="p" className="text-linen/80">
            {copy.home.eventsBody}
          </FadeUp>
          <FadeUp delay={0.15}>
            <Link href="/events" className="group label mt-10 inline-flex min-h-[44px] items-center gap-4">
              <span className="link-draw pb-1">{copy.home.eventsCta}</span>
              <ArrowIcon className="w-7 transition-transform duration-500 ease-silk group-hover:translate-x-1.5 rtl:rotate-180" />
            </Link>
          </FadeUp>
        </div>

        {/* Three images at three sizes, deliberately off the grid lines */}
        <div className="col-span-8 lg:col-span-5 lg:col-start-1">
          <RevealImage src={images.events.weddings.src} alt={images.events.weddings.alt} sizes="(min-width: 1024px) 40vw, 66vw" className="aspect-[4/5] bg-wing-deep" />
          <p className="label mt-4 text-linen/70">Weddings</p>
        </div>
        <div className="col-span-7 col-start-6 -mt-24 sm:-mt-40 lg:col-span-4 lg:col-start-7 lg:mt-40">
          <Parallax speed={-0.35}>
            <RevealImage src={images.events.corporate.src} alt={images.events.corporate.alt} sizes="(min-width: 1024px) 32vw, 58vw" className="aspect-[4/3] bg-wing-deep" delay={0.15} />
            <p className="label mt-4 text-linen/70">Corporate</p>
          </Parallax>
        </div>
        <div className="col-span-5 col-start-2 lg:col-span-2 lg:col-start-11 lg:-mt-20">
          <RevealImage src={images.events.hotels.src} alt={images.events.hotels.alt} sizes="(min-width: 1024px) 16vw, 40vw" className="aspect-[3/4] bg-wing-deep" delay={0.3} />
          <p className="label mt-4 text-linen/70">Hotels</p>
        </div>
      </div>
    </section>
  );
}
