import { Hero } from "@/components/home/Hero";
import { Occasions } from "@/components/home/Occasions";
import { Featured } from "@/components/home/Featured";
import { Story } from "@/components/home/Story";
import { Marquee } from "@/components/home/Marquee";
import { EventsTeaser } from "@/components/home/EventsTeaser";
import { Gallery } from "@/components/home/Gallery";
import { DriftButterfly } from "@/components/home/Butterfly";
import { Reviews } from "@/components/home/Reviews";
import { floristJsonLd } from "@/lib/jsonld";

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(floristJsonLd()) }} />
      <Hero />
      <Occasions />
      <Featured />
      <Story />
      {/* overflow-x-clip: the butterfly may fly past the screen edge without widening the page on phones */}
      <div className="relative overflow-x-clip">
        <Marquee />
        <DriftButterfly />
      </div>
      <EventsTeaser />
      <Reviews />
      <Gallery />
    </>
  );
}
