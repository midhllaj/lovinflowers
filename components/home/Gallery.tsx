import { images, type SiteImage } from "@/config/images";
import { copy } from "@/content/en";
import { RevealImage, SplitHeading, FadeUp } from "../motion/Reveal";
import { Parallax } from "../motion/Parallax";

type Tile = { img: SiteImage; aspect: string };

// Hand-placed collage: columns of different widths, each starting at a different
// height and drifting at its own speed, so nothing lines up like a template grid.
const desktopCols = [
  { cls: "w-[34%]", offset: "mt-0", speed: 0, tiles: [0, 3], aspects: ["aspect-[3/4]", "aspect-[5/4]"] },
  { cls: "w-[24%]", offset: "mt-[42vh]", speed: -0.25, tiles: [1, 4], aspects: ["aspect-[4/5]", "aspect-[3/4]"] },
  { cls: "w-[30%]", offset: "mt-0", speed: 0.12, tiles: [2, 5], aspects: ["aspect-[3/4]", "aspect-[4/5]"] },
];
const mobileCols = [
  { cls: "w-[56%]", offset: "mt-0", tiles: [0, 2, 4], aspects: ["aspect-[3/4]", "aspect-[4/5]", "aspect-[3/4]"] },
  { cls: "w-[40%]", offset: "mt-28", tiles: [1, 3, 5], aspects: ["aspect-[4/5]", "aspect-[3/4]", "aspect-square"] },
];

function Column({ tiles, cls, offset }: { tiles: Tile[]; cls: string; offset: string }) {
  return (
    <div className={`flex flex-col gap-4 lg:gap-6 ${cls} ${offset}`}>
      {tiles.map((t, i) => (
        <RevealImage key={t.img.src} src={t.img.src} alt={t.img.alt} sizes="(min-width: 1024px) 34vw, 56vw" className={t.aspect} delay={i * 0.1} />
      ))}
    </div>
  );
}

export function Gallery() {
  const pick = (idx: number[], aspects: string[]) =>
    idx.filter((i) => images.gallery[i]).map((i, k) => ({ img: images.gallery[i], aspect: aspects[k] }));

  return (
    <section className="frame pb-section pt-section" aria-labelledby="gallery-title">
      <div className="grid grid-cols-12 gap-x-4">
        <div className="col-span-12 lg:col-span-5">
          <FadeUp as="p" className="label text-wing">
            {copy.home.galleryLabel}
          </FadeUp>
          <div id="gallery-title">
            <SplitHeading text={copy.home.galleryTitle} className="mt-6 text-display-lg" />
          </div>
        </div>
      </div>

      <div className="mt-14 hidden items-start justify-between lg:-mt-24 lg:flex">
        {desktopCols.map((c, i) => (
          <Parallax key={i} speed={c.speed} className={`${c.cls} ${i === 0 ? "mt-[30vh]" : ""}`}>
            <Column tiles={pick(c.tiles, c.aspects)} cls="w-full" offset={c.offset} />
          </Parallax>
        ))}
      </div>

      <div className="mt-12 flex items-start justify-between lg:hidden">
        {mobileCols.map((c, i) => (
          <Column key={i} tiles={pick(c.tiles, c.aspects)} cls={c.cls} offset={c.offset} />
        ))}
      </div>
    </section>
  );
}
