import { mapsUrl, site } from "@/config/site";

/** Structured data for Google: a Florist business serving Dubai. Empty fields are left out. */
export const floristJsonLd = () => {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Florist",
    name: site.name,
    url: site.url,
    image: `${site.url}/og.jpg`,
    logo: `${site.url}/logo/lovin-flowers-logo.png`,
    areaServed: { "@type": "City", name: "Dubai" },
    alternateName: site.nameArabic,
    address: { "@type": "PostalAddress", streetAddress: site.address.split(",")[0], addressLocality: "Dubai", addressCountry: "AE" },
  };
  if (site.mapQuery) data.hasMap = mapsUrl();
  if (site.phone) data.telephone = site.phone;
  if (site.email) data.email = site.email;
  const sameAs = [site.instagram, site.tiktok].filter(Boolean);
  if (sameAs.length) data.sameAs = sameAs;
  return data;
};

