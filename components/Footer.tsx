import Link from "next/link";
import { copy } from "@/content/en";
import { mapsUrl, site } from "@/config/site";
import { Logo } from "./Logo";
import { InstagramIcon, TikTokIcon, ArrowIcon } from "./Icons";
import { WhatsAppLink } from "./WhatsApp";

export function Footer() {
  const socials = [
    { href: site.instagram, label: copy.contact.instagram, Icon: InstagramIcon },
    { href: site.tiktok, label: copy.contact.tiktok, Icon: TikTokIcon },
  ].filter((s) => s.href);

  const contact = [
    site.phone && { label: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    site.email && { label: site.email, href: `mailto:${site.email}` },
    site.address && { label: site.address, href: mapsUrl() || undefined },
  ].filter(Boolean) as { label: string; href?: string }[];

  return (
    <footer className="relative border-t border-line bg-linen">
      <div className="frame pb-10 pt-20 sm:pt-28">
        <WhatsAppLink
          message={copy.whatsapp.generalMessage}
          className="group flex w-full flex-col items-start gap-6 text-start sm:flex-row sm:items-end sm:justify-between"
        >
          <span className="font-serif text-display-lg font-light">
            Send flowers <span className="italic text-wing">today</span>
          </span>
          <span className="label flex items-center gap-4 pb-3">
            {copy.nav.order}
            <ArrowIcon className="w-8 transition-transform duration-500 ease-silk group-hover:translate-x-2 rtl:rotate-180" />
          </span>
        </WhatsAppLink>

        <div className="mt-20 grid gap-12 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo height={30} className="h-[26px] sm:h-[30px]" />
            <p className="mt-6 max-w-xs text-ink-soft">{copy.footer.line}</p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <p className="label mb-5 text-ink-soft">{copy.footer.explore}</p>
            <ul className="space-y-2.5">
              {[
                ["/collection", copy.nav.collection],
                ["/events", copy.nav.events],
                ["/about", copy.nav.about],
                ["/contact", copy.nav.contact],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="link-draw">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {contact.length > 0 && (
            <div className="lg:col-span-3">
              <p className="label mb-5 text-ink-soft">{copy.nav.contact}</p>
              <ul className="space-y-2.5">
                {contact.map((c) => (
                  <li key={c.label}>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="link-draw"
                        {...(c.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                      >
                        {c.label}
                      </a>
                    ) : (
                      <span className="text-ink-soft">{c.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {socials.length > 0 && (
            <div className="lg:col-span-2">
              <p className="label mb-5 text-ink-soft">{copy.footer.follow}</p>
              <ul className="flex gap-3">
                {socials.map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-linen"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="label mt-16 flex flex-col gap-3 text-ink-soft sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} {site.name}. {copy.footer.rights}
          </span>
          <span>{copy.footer.delivery}</span>
        </div>
      </div>
    </footer>
  );
}
