/**
 * Every non-product image on the site lives here — all of them are your own photos.
 * To use a different one: drop the file into /public/images/ and replace the
 * `src` with its path, e.g. "/images/lifestyle/our-wedding-stage.jpg".
 * Product photos are set in /data/products.ts.
 */
export type SiteImage = { src: string; alt: string };

export const images = {
  hero: {
    main: { src: "/images/lifestyle/hero-studio.jpg", alt: "Lovin Flowers vases and a hat box filled with roses, tulips, hydrangea and orchids against a deep rose wall, with red butterflies resting on the blooms" },
    inset: { src: "/images/lifestyle/hero-detail.jpg", alt: "A red butterfly on white gerberas and blue hydrangea in a Lovin Flowers vase" },
  },

  // Thumbnails for "Shop by occasion"
  occasions: {
    Love: { src: "/images/products/heart-of-roses-1.jpg", alt: "Pink and red roses shaped into a heart" },
    Birthday: { src: "/images/products/marina-garden-basket-1.jpg", alt: "A bright basket of roses and hydrangea" },
    Congratulations: { src: "/images/products/fortune-bouquet-1.jpg", alt: "Roses and lilies framed by a fan of notes" },
    "New Baby": { src: "/images/products/blush-lily-bouquet-1.jpg", alt: "Soft pink lilies and carnations" },
    "Get Well": { src: "/images/products/sapphire-sun-basket-1.jpg", alt: "Blue hydrangea and yellow roses in a basket" },
  } as Record<string, SiteImage>,

  story: {
    large: { src: "/images/products/rose-cloud-grand-bouquet-1.jpg", alt: "A grand round bouquet of pink spray roses and carnations in white wrap, in the Lovin Flowers studio" },
    small: { src: "/images/products/crimson-anthurium-bouquet-1.jpg", alt: "Red and white roses with pink anthurium, wrapped in deep red paper" },
  },

  events: {
    weddings: { src: "/images/products/rose-cloud-grand-bouquet-2.jpg", alt: "A grand round bouquet of pink roses and carnations in a white paper collar" },
    corporate: { src: "/images/products/sapphire-sun-basket-2.jpg", alt: "A statement basket of blue hydrangea, delphinium, orchids and yellow roses on a marble counter" },
    hotels: { src: "/images/lifestyle/marina-wide.jpg", alt: "A rose and hydrangea basket on the Dubai Harbour promenade, with yachts and towers behind" },
    custom: { src: "/images/products/fortune-bouquet-2.jpg", alt: "A custom bouquet of roses, lilies and chrysanthemum framed by a fan of banknotes" },
  },

  about: {
    portrait: { src: "/images/products/heart-of-roses-2.jpg", alt: "A heart of pink and red roses in iridescent wrap, in front of the Lovin Flowers studio" },
    detail: { src: "/images/lifestyle/marina-from-above.jpg", alt: "A dome of coral roses, blue hydrangea and lime blooms tied with an ivory ribbon, on the harbour wall" },
    studio: { src: "/images/products/sapphire-sun-basket-1.jpg", alt: "Blue hydrangea, orchids and yellow roses in a woven basket on the studio counter" },
  },

  gallery: [
    { src: "/images/lifestyle/marina-skyline.jpg", alt: "A rose and hydrangea basket by the water, with the Dubai Harbour skyline behind" },
    { src: "/images/products/fortune-bouquet-1.jpg", alt: "A round bouquet of roses and lilies framed by a fan of banknotes" },
    { src: "/images/lifestyle/marina-overhead.jpg", alt: "Looking down onto a dome of roses, hydrangea and spray carnations" },
    { src: "/images/products/blush-lily-bouquet-1.jpg", alt: "Pink lilies and carnations wrapped in blush paper" },
    { src: "/images/products/heart-of-roses-3.jpg", alt: "A heart of pink and red roses on the marble counter of the studio" },
    { src: "/images/lifestyle/marina-close.jpg", alt: "Close view of a flower basket on the harbour wall at sunset" },
  ] as SiteImage[],

  // Shown when a link to the site is shared (WhatsApp, Instagram, iMessage…)
  og: "/og.jpg",
} satisfies Record<string, unknown>;
