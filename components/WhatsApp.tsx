"use client";

import { usePathname } from "next/navigation";
import { copy } from "@/content/en";
import { site } from "@/config/site";
import { hasWhatsApp, openWhatsApp, productMessage, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./Icons";

type Base = { className?: string; children?: React.ReactNode; label?: string };

/**
 * Any WhatsApp call-to-action. With a number set it is a real link (works
 * without JS, can be long-pressed and copied). Without one it is a button
 * that only logs a console warning.
 */
export function WhatsAppLink({ message, className, children, label }: Base & { message: string | ((origin: string) => string) }) {
  // The rendered link uses the live domain (identical on server and client);
  // a tap rebuilds it with the page's own address, so previews link to themselves.
  const text = (origin = site.url) => (typeof message === "function" ? message(origin) : message);

  if (hasWhatsApp()) {
    return (
      <a
        href={whatsappLink(text())}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={label}
        onClick={(e) => (e.currentTarget.href = whatsappLink(text(window.location.origin)))}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={className} aria-label={label} onClick={() => openWhatsApp(text(window.location.origin))}>
      {children}
    </button>
  );
}

/** The product enquiry button used on cards and product pages. */
export function EnquireButton({
  name,
  slug,
  inStock,
  variant = "solid",
  className = "",
}: {
  name: string;
  slug: string;
  inStock: boolean;
  variant?: "solid" | "text";
  className?: string;
}) {
  const text = inStock ? copy.whatsapp.enquire : copy.whatsapp.ask;
  const styles =
    variant === "solid"
      ? "group inline-flex min-h-[52px] items-center justify-center gap-3 bg-ink px-7 text-linen transition-colors duration-500 hover:bg-wing"
      : "group inline-flex min-h-[44px] items-center gap-2.5 text-ink transition-colors duration-300 hover:text-wing";

  return (
    <WhatsAppLink message={(origin) => productMessage(name, slug, inStock, origin)} className={`${styles} ${className}`} label={`${text}: ${name}`}>
      <WhatsAppIcon className={variant === "solid" ? "h-[18px] w-[18px]" : "h-4 w-4"} />
      <span className={`label ${variant === "text" ? "link-draw pb-0.5" : ""}`}>{text}</span>
    </WhatsAppLink>
  );
}

/** Small round button fixed to the bottom corner of every page. */
export function WhatsAppFloat() {
  // The builder has its own sticky bar, so the floating button would only cover it.
  if (usePathname() === "/design") return null;
  return (
    <WhatsAppLink
      message={copy.whatsapp.generalMessage}
      label={copy.whatsapp.float}
      className="fixed bottom-5 end-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-linen shadow-[0_10px_30px_-10px_rgba(35,31,32,0.55)] transition-[transform,background-color] duration-500 ease-silk hover:scale-105 hover:bg-wing sm:bottom-7 sm:end-7"
    >
      <WhatsAppIcon className="h-6 w-6" />
    </WhatsAppLink>
  );
}
