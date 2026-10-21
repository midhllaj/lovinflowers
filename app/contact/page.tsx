import type { Metadata } from "next";
import { copy } from "@/content/en";
import { formatPhone, mapsEmbedUrl, mapsUrl, site, socialHandle } from "@/config/site";
import { images } from "@/config/images";
import { PageIntro } from "@/components/PageIntro";
import { RevealImage, FadeUp } from "@/components/motion/Reveal";
import { WhatsAppLink } from "@/components/WhatsApp";
import { ArrowIcon, WhatsAppIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Contact — Order Flowers in Dubai",
  description: "Order flowers in Dubai on WhatsApp. Same-day delivery across Dubai, seven days a week.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const c = copy.contact;

  // Only details that have been filled in /config/site.ts are shown.
  const rows = [
    site.whatsappNumber && { label: c.whatsapp, value: formatPhone(site.whatsappNumber), href: `https://wa.me/${site.whatsappNumber.replace(/[^\d]/g, "")}` },
    site.phone && { label: c.phone, value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    site.email && { label: c.email, value: site.email, href: `mailto:${site.email}` },
    site.address && { label: c.address, value: site.address, href: mapsUrl() || undefined },
    site.hours && { label: c.hours, value: site.hours },
    site.instagram && { label: c.instagram, value: socialHandle(site.instagram), href: site.instagram },
    site.tiktok && { label: c.tiktok, value: socialHandle(site.tiktok), href: site.tiktok },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <>
      <PageIntro label={c.label} title={c.title} intro={c.intro} />

      <section className="frame pb-section">
        <div className="grid grid-cols-12 gap-x-4 gap-y-16">
          <div className="col-span-12 lg:col-span-6">
            <FadeUp immediate>
              <WhatsAppLink
                message={copy.whatsapp.generalMessage}
                className="group flex w-full items-center justify-between gap-6 border-y border-ink py-8 text-start transition-colors duration-500 hover:text-wing"
              >
                <span className="font-serif text-display-sm font-light">{copy.nav.order}</span>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink text-linen transition-colors duration-500 group-hover:bg-wing">
                  <WhatsAppIcon className="h-6 w-6" />
                </span>
              </WhatsAppLink>
            </FadeUp>

            {rows.length > 0 ? (
              <dl className="mt-4">
                {rows.map((r, i) => (
                  <FadeUp immediate key={r.label} delay={0.05 * i} className="flex flex-col gap-1 border-b border-line py-6 sm:flex-row sm:gap-10">
                    <dt className="label w-32 shrink-0 pt-1 text-ink-soft">{r.label}</dt>
                    <dd className="text-lg">
                      {r.href ? (
                        <a href={r.href} className="link-draw" {...(r.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}>
                          {r.value}
                        </a>
                      ) : (
                        r.value
                      )}
                    </dd>
                  </FadeUp>
                ))}
              </dl>
            ) : (
              <FadeUp immediate as="p" className="mt-10 max-w-md text-ink-soft">
                {c.pending}
              </FadeUp>
            )}

            <FadeUp immediate as="p" className="label mt-12 flex items-center gap-3 text-ink-soft">
              <span className="block h-2 w-2 rounded-full bg-wing" aria-hidden="true" />
              {c.delivery}
            </FadeUp>
          </div>

          <div className="col-span-9 col-start-4 lg:col-span-4 lg:col-start-9 lg:-mt-40">
            <RevealImage src={images.gallery[0].src} alt={images.gallery[0].alt} sizes="(min-width: 1024px) 33vw, 75vw" className="aspect-[3/4]" />
          </div>
        </div>
      </section>

      {/* Studio location — only shown once mapQuery is set in config/site.ts */}
      {site.mapQuery && (
        <section className="frame pb-section" aria-labelledby="map-title">
          <div className="grid grid-cols-12 gap-x-4 gap-y-10 border-t border-line pt-16 lg:pt-24">
            <div className="col-span-12 lg:col-span-4">
              <FadeUp as="p" className="label text-wing">
                {c.mapLabel}
              </FadeUp>
              <h2 id="map-title" className="mt-6 text-display-md">
                {site.address.split(",")[0]}
                <span className="block italic text-wing">{site.address.split(",")[1]?.trim()}</span>
              </h2>
              <p className="mt-6 text-ink-soft">
                {site.name} ·{" "}
                <span lang="ar" dir="rtl">
                  {site.nameArabic}
                </span>
              </p>
              <a
                href={mapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="group label mt-10 inline-flex min-h-[44px] items-center gap-4"
              >
                <span className="link-draw pb-1">{c.directions}</span>
                <ArrowIcon className="w-7 transition-transform duration-500 ease-silk group-hover:translate-x-1.5 rtl:rotate-180" />
              </a>
            </div>
            <FadeUp className="col-span-12 lg:col-span-8">
              <div className="relative aspect-[4/5] overflow-hidden border border-line bg-shell sm:aspect-[16/10]">
                <iframe
                  src={mapsEmbedUrl()}
                  title={`${site.name} on Google Maps — ${site.address}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0 grayscale-[35%] sepia-[12%]"
                  allowFullScreen
                />
              </div>
            </FadeUp>
          </div>
        </section>
      )}
    </>
  );
}
