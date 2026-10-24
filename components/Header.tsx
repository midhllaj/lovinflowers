"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { copy } from "@/content/en";
import { site } from "@/config/site";
import { Logo } from "./Logo";
import { useLenis } from "./SmoothScroll";
import { WhatsAppLink } from "./WhatsApp";

const links = [
  { href: "/collection", label: copy.nav.collection },
  { href: "/design", label: copy.nav.design },
  { href: "/events", label: copy.nav.events },
  { href: "/about", label: copy.nav.about },
  { href: "/contact", label: copy.nav.contact },
];

const silk = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <a href="#main" className="label sr-only z-[110] bg-ink px-4 py-3 text-linen focus:not-sr-only focus:fixed focus:start-4 focus:top-4">
        {copy.nav.skip}
      </a>

      <header className="fixed inset-x-0 top-0 z-[70]">
        {/* Background layer fades in on scroll — opacity only. */}
        <div
          className={`absolute inset-0 border-b border-line bg-linen/95 transition-opacity duration-500 ${scrolled && !open ? "opacity-100" : "opacity-0"}`}
          aria-hidden="true"
        />
        <div
          className={`frame relative flex items-center justify-between transition-[padding] duration-500 ease-silk ${scrolled ? "py-3 sm:py-4" : "py-5 sm:py-7"}`}
        >
          <Link href="/" aria-label={`${site.name} — ${copy.nav.home}`} className="relative z-10 block">
            <span
              className={`block origin-left transition-transform duration-500 ease-silk rtl:origin-right ${scrolled ? "scale-[0.82]" : "scale-100"}`}
            >
              <Logo height={30} preload className="h-[22px] sm:h-[30px]" />
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-7 lg:flex xl:gap-10">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`label link-draw pb-1 ${isActive(l.href) ? "bg-[length:100%_1px] text-ink" : "text-ink-soft hover:text-ink"}`}
                aria-current={isActive(l.href) ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
            <WhatsAppLink
              message={copy.whatsapp.generalMessage}
              className="label border border-ink px-5 py-3 transition-colors duration-500 hover:bg-ink hover:text-linen"
            >
              {copy.nav.order}
            </WhatsAppLink>
          </nav>

          <button
            type="button"
            className="label relative z-10 -me-2 flex min-h-[44px] items-center gap-3 px-2 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span>{open ? copy.nav.close : copy.nav.menu}</span>
            <span className="relative block h-2.5 w-6" aria-hidden="true">
              <span className={`absolute inset-x-0 top-0 h-px bg-ink transition-transform duration-500 ease-silk ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute inset-x-0 bottom-0 h-px bg-ink transition-transform duration-500 ease-silk ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            className="fixed inset-0 z-[65] flex flex-col bg-linen px-gutter pb-10 pt-28 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center">
              <ul className="border-t border-line">
                {[{ href: "/", label: copy.nav.home }, ...links].map((l, i) => (
                  <li key={l.href} className="overflow-hidden border-b border-line">
                    <m.div initial={{ y: "100%" }} animate={{ y: "0%" }} transition={{ duration: 0.8, ease: silk, delay: 0.05 + i * 0.06 }}>
                      <Link href={l.href} className="flex items-baseline justify-between py-4 font-serif text-[2.6rem] font-light leading-none">
                        <span className={isActive(l.href) && l.href !== "/" ? "italic text-wing" : ""}>{l.label}</span>
                        <span className="label text-ink-soft">0{i + 1}</span>
                      </Link>
                    </m.div>
                  </li>
                ))}
              </ul>
            </nav>
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
              <WhatsAppLink
                message={copy.whatsapp.generalMessage}
                className="label flex min-h-[52px] w-full items-center justify-center bg-ink text-linen"
              >
                {copy.nav.order}
              </WhatsAppLink>
              <p className="label mt-5 text-center text-ink-soft">{copy.footer.delivery}</p>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
