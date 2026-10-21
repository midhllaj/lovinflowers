/**
 * Every product on the site lives in this one list.
 *
 * To add a product:
 *   1. Put its photos in /public/images/products/ named after the product,
 *      e.g. ivory-peony-box-1.jpg, ivory-peony-box-2.jpg
 *   2. Copy one of the entries below, change the details and image paths.
 * The first image is the cover; the second appears when a card is hovered.
 */

export const categories = ["Bouquet", "Grand Bouquet", "Basket", "Box", "Forever Roses", "Vase"] as const;
export type Category = (typeof categories)[number];

export const occasions = ["Love", "Birthday", "Congratulations", "New Baby", "Get Well"] as const;
export type Occasion = (typeof occasions)[number];

export type ProductImage = { src: string; alt: string };

export type Product = {
  name: string;
  slug: string;
  category: Category;
  occasion: Occasion[];
  description: string;
  /** A few words on what's inside — shown on the product page. */
  stems: string;
  images: ProductImage[];
  inStock: boolean;
  /** Shown in the home page "Featured" scroll. */
  featured?: boolean;
};

const img = (file: string, alt: string): ProductImage => ({ src: `/images/products/${file}`, alt });

export const products: Product[] = [
  {
    name: "Marina Garden Basket",
    slug: "marina-garden-basket",
    category: "Basket",
    occasion: ["Birthday", "Congratulations", "Get Well"],
    description:
      "A full, generous dome of garden roses, blue hydrangea and ranunculus, set low in a woven basket. Made to be the brightest thing in the room.",
    stems: "Garden roses, hydrangea, ranunculus, spray carnations, solidago",
    images: [
      img("marina-garden-basket-1.jpg", "Marina Garden Basket — roses and hydrangea in a woven basket by the harbour"),
      img("marina-garden-basket-2.jpg", "Marina Garden Basket seen from above, a dome of coral, blue and lime flowers"),
      img("marina-garden-basket-3.jpg", "Marina Garden Basket on the harbour wall, tied with an ivory ribbon"),
      img("marina-garden-basket-4.jpg", "Marina Garden Basket with yachts in the background"),
    ],
    inStock: true,
    featured: true,
  },
  {
    name: "Heart of Roses",
    slug: "heart-of-roses",
    category: "Grand Bouquet",
    occasion: ["Love"],
    description:
      "Over a hundred roses in blush and deep pink, drawn into a heart with a single bent stem and wrapped in pearl paper that catches the light.",
    stems: "Pink and fuchsia roses, spray roses, iridescent wrap",
    images: [
      img("heart-of-roses-1.jpg", "Heart of Roses — pink and fuchsia roses shaped into a heart"),
      img("heart-of-roses-2.jpg", "Heart of Roses in iridescent pink wrap at the Lovin Flowers studio"),
      img("heart-of-roses-3.jpg", "Heart of Roses on the marble counter"),
    ],
    inStock: true,
    featured: true,
  },
  {
    name: "Rose Cloud",
    slug: "rose-cloud-grand-bouquet",
    category: "Grand Bouquet",
    occasion: ["Love", "Birthday"],
    description:
      "Our largest round bouquet: spray roses, garden roses and carnations in every shade of pink, packed close and finished with a crisp white collar.",
    stems: "Spray roses, garden roses, carnations, white wrap",
    images: [
      img("rose-cloud-grand-bouquet-1.jpg", "Rose Cloud — a grand round bouquet of pink roses and carnations"),
      img("rose-cloud-grand-bouquet-2.jpg", "Rose Cloud in its white paper collar, photographed in the studio"),
    ],
    inStock: true,
    featured: true,
  },
  {
    name: "Sapphire Sun Basket",
    slug: "sapphire-sun-basket",
    category: "Basket",
    occasion: ["Congratulations", "New Baby", "Get Well"],
    description:
      "Cobalt hydrangea and delphinium against sunny roses and chrysanthemum, with trailing orchids and amaranthus. Bold, cheerful and built to travel.",
    stems: "Hydrangea, delphinium, yellow roses, dendrobium orchids, amaranthus",
    images: [
      img("sapphire-sun-basket-1.jpg", "Sapphire Sun Basket — blue hydrangea and yellow roses in a seagrass basket"),
      img("sapphire-sun-basket-2.jpg", "Sapphire Sun Basket seen side-on on the marble counter"),
    ],
    inStock: true,
    featured: true,
  },
  {
    name: "Fortune Bouquet",
    slug: "fortune-bouquet",
    category: "Grand Bouquet",
    occasion: ["Congratulations", "Birthday"],
    description:
      "Roses, lilies and white chrysanthemum at the centre, framed by a full fan of notes. For graduations, new jobs and the big wins.",
    stems: "Roses, lilies, chrysanthemum, waxflower — notes arranged to your amount",
    images: [
      img("fortune-bouquet-1.jpg", "Fortune Bouquet — roses and lilies framed by a fan of banknotes"),
      img("fortune-bouquet-2.jpg", "Fortune Bouquet photographed from the front in the studio"),
    ],
    inStock: true,
    featured: true,
  },
  {
    name: "Crimson Anthurium",
    slug: "crimson-anthurium-bouquet",
    category: "Bouquet",
    occasion: ["Love", "Birthday"],
    description:
      "Deep red and ivory roses lifted by sculptural pink anthurium, wrapped in wine paper with a silk tie. Romantic, with an edge.",
    stems: "Red roses, white roses, pink anthurium",
    images: [img("crimson-anthurium-bouquet-1.jpg", "Crimson Anthurium — red and white roses with pink anthurium in wine-red wrap")],
    inStock: true,
  },
  {
    name: "Blush Lily",
    slug: "blush-lily-bouquet",
    category: "Bouquet",
    occasion: ["New Baby", "Get Well", "Birthday"],
    description:
      "Scented oriental lilies with soft pink carnations and a little solidago, in layers of blush paper. Gentle, and it fills a room.",
    stems: "Oriental lilies, carnations, solidago",
    images: [img("blush-lily-bouquet-1.jpg", "Blush Lily — pink lilies and carnations in blush wrapping paper")],
    inStock: true,
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

/** Only the categories that actually have products — used for filter chips. */
export const activeCategories = categories.filter((c) => products.some((p) => p.category === c));

export const relatedProducts = (product: Product, count = 4) => {
  const others = products.filter((p) => p.slug !== product.slug);
  const score = (p: Product) =>
    (p.category === product.category ? 2 : 0) + p.occasion.filter((o) => product.occasion.includes(o)).length;
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, count);
};

export const occasionSlug = (o: Occasion) => o.toLowerCase().replace(/\s+/g, "-");
export const categorySlug = (c: Category) => c.toLowerCase().replace(/\s+/g, "-");
