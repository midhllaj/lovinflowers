import { site } from "@/config/site";
import { copy } from "@/content/en";

/** Digits only — wa.me rejects "+", spaces and dashes. */
const cleanNumber = (n: string) => n.replace(/[^\d]/g, "");

export const hasWhatsApp = () => cleanNumber(site.whatsappNumber).length > 0;

export const whatsappLink = (message: string) =>
  `https://wa.me/${cleanNumber(site.whatsappNumber)}?text=${encodeURIComponent(message)}`;

/** Absolute URL for a product page on the given origin (defaults to the live domain). */
export const productUrl = (slug: string, origin = site.url) => `${origin}/collection/${slug}`;

export const productMessage = (name: string, slug: string, inStock: boolean, origin = site.url) =>
  (inStock ? copy.whatsapp.productMessage : copy.whatsapp.availabilityMessage)
    .replace("{name}", name)
    .replace("{url}", productUrl(slug, origin));

/**
 * Opens WhatsApp with a pre-filled message.
 * While no number is set in /config/site.ts this only logs a warning.
 */
export const openWhatsApp = (message: string) => {
  if (!hasWhatsApp()) {
    console.warn(
      "[Lovin Flowers] WhatsApp number is not set yet. Add it to /config/site.ts (whatsappNumber) and every button will start working.\nMessage that would have been sent:\n" +
        message,
    );
    return;
  }
  window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
};
