/**
 * All contact details live here. Anything left as "" is hidden on the site.
 *
 * whatsappNumber: international format, digits only — e.g. "971501234567"
 * instagram / tiktok: full profile URLs — e.g. "https://instagram.com/lovinflowers"
 * mapQuery: what Google Maps searches for — the shop name plus its plus code works best.
 */
export const site = {
  name: "Lovin Flowers",
  nameArabic: "لوفن للزهور",
  tagline: "Luxury florist in Dubai",
  // Your live domain, used for product links in WhatsApp messages, SEO and sharing.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://lovinflowers.ae",

  whatsappNumber: "971508093833",
  instagram: "https://www.instagram.com/lovin_flowers1",
  tiktok: "",
  phone: "+971 50 809 3833",
  email: "",
  address: "Al Karama, Dubai, United Arab Emirates",
  mapQuery: "Lovin Flowers, 7825+92J Al Karama, Dubai",

  // Optional: opening hours shown on the Contact page when filled in.
  hours: "",
};

export type Site = typeof site;

/** Google Maps link for directions to the shop. */
export const mapsUrl = () =>
  site.mapQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}` : "";

/** Google Maps embed (no API key needed) for the Contact page. */
export const mapsEmbedUrl = () =>
  site.mapQuery ? `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed` : "";

/** "971508093833" → "+971 50 809 3833" for display. */
export const formatPhone = (digits: string) => {
  const d = digits.replace(/[^\d]/g, "");
  return /^971\d{9}$/.test(d) ? `+971 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8)}` : `+${d}`;
};

/** "https://www.instagram.com/lovin_flowers1" → "@lovin_flowers1" */
export const socialHandle = (url: string) => {
  const handle = url.replace(/\/+$/, "").split("/").pop() ?? "";
  return handle.startsWith("@") ? handle : `@${handle}`;
};
