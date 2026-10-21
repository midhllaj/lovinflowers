import type { Metadata } from "next";
import { copy } from "@/content/en";
import { images } from "@/config/images";
import { PageIntro } from "@/components/PageIntro";
import { RevealImage, SplitHeading, FadeUp } from "@/components/motion/Reveal";
import { WhatsAppLink } from "@/components/WhatsApp";
import { ArrowIcon, WhatsAppIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Event & Wedding Flowers in Dubai",
  description:
    "Wedding flowers, corporate events, hotel and restaurant arrangements and custom floral designs in Dubai. Tell us about your event on WhatsApp.",
  alternates: { canonical: "/events" },
};

// Each service alternates side and image shape so the page reads like a spread.
const layouts = [
  { img: "col-span-12 lg:col-span-6", text: "col-span-12 lg:col-span-4 lg:col-start-8 lg:self-end", aspect: "aspect-[4/5]" },
  { img: "col-span-11 col-start-2 lg:col-span-5 lg:col-start-7 lg:order-2", text: "col-span-12 lg:col-span-4 lg:col-start-2 lg:order-1 lg:self-center", aspect: "aspect-[5/4]" },
  { img: "col-span-10 lg:col-span-4 lg:col-start-2", text: "col-span-12 lg:col-span-4 lg:col-start-7 lg:self-center", aspect: "aspect-[3/4]" },
  { img: "col-span-12 lg:col-span-7 lg:col-start-6 lg:order-2", text: "col-span-12 lg:col-span-4 lg:col-start-1 lg:order-1 lg:self-end", aspect: "aspect-[16/11]" },
];

export default function EventsPage() {
  const e = copy.events;
  return (
    <>
      <PageIntro
        label={e.label}
        title={e.title}
        intro={e.intro}
        aside={
          <FadeUp delay={0.5}>
            <WhatsAppLink message={copy.whatsapp.eventMessage} className="group label mt-8 inline-flex min-h-[44px] items-center gap-4 text-wing">
              <span className="link-draw pb-1">{e.cta}</span>
              <ArrowIcon className="w-7 transition-transform duration-500 ease-silk group-hover:translate-x-1.5 rtl:rotate-180" />
            </WhatsAppLink>
          </FadeUp>
        }
      />

      <div className="frame space-y-28 pb-section sm:space-y-40">
        {e.services.map((s, i) => {
          const l = layouts[i % layouts.length];
          const img = images.events[s.key as keyof typeof images.events];
          return (
            <section key={s.key} className="grid grid-cols-12 gap-x-4 gap-y-10" aria-labelledby={`svc-${s.key}`}>
              <div className={l.img}>
                <RevealImage src={img.src} alt={img.alt} sizes="(min-width: 1024px) 50vw, 92vw" className={l.aspect} priority={i === 0} />
              </div>
              <div className={l.text}>
                <FadeUp as="p" className="label text-wing">
                  0{i + 1}
                </FadeUp>
                <div id={`svc-${s.key}`}>
                  <SplitHeading text={s.title} className="mt-5 text-display-md" />
                </div>
                <FadeUp as="p" delay={0.15} className="mt-6 max-w-sm text-ink-soft">
                  {s.body}
                </FadeUp>
              </div>
            </section>
          );
        })}
      </div>

      {/* Process */}
      <section className="bg-wing-deep py-section text-linen" aria-labelledby="process-title">
        <div className="frame">
          <FadeUp as="p" className="label text-blush">
            {e.processLabel}
          </FadeUp>
          <ol className="mt-14 grid gap-x-6 gap-y-14 border-t border-linen/20 pt-12 md:grid-cols-3">
            {e.process.map((step, i) => (
              <li key={step.title} className={i === 1 ? "md:mt-16" : i === 2 ? "md:mt-32" : ""}>
                <span className="font-serif text-6xl font-light italic text-blush">{i + 1}</span>
                <h2 id={i === 0 ? "process-title" : undefined} className="mt-6 text-display-sm">
                  {step.title}
                </h2>
                <p className="mt-4 max-w-xs text-linen/80">{step.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-24 flex justify-center">
            <WhatsAppLink
              message={copy.whatsapp.eventMessage}
              className="inline-flex min-h-[56px] items-center gap-3 bg-linen px-8 text-ink transition-colors duration-500 hover:bg-blush"
            >
              <WhatsAppIcon className="h-5 w-5" />
              <span className="label">{e.cta}</span>
            </WhatsAppLink>
          </div>
        </div>
      </section>
    </>
  );
}
