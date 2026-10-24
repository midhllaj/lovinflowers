# Lovin Flowers — website

A luxury flower boutique site for Dubai. No cart, no checkout, no prices:
every product has an **Enquire on WhatsApp** button that opens a pre-filled chat.

Built with Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion,
GSAP + ScrollTrigger and Lenis.

---

## Run it on your computer

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Pages reload as you save files.

To test the real, optimised version:

```bash
npm run build
npm start
```

---

## Add your WhatsApp number, socials and contact details

Everything lives in **`config/site.ts`**:

```ts
whatsappNumber: "971501234567",                 // digits only, with country code, no + or spaces
instagram: "https://instagram.com/lovinflowers",
tiktok: "https://www.tiktok.com/@lovinflowers",
phone: "+971 50 123 4567",
email: "hello@lovinflowers.ae",
address: "Shop 4, Dubai Harbour, Dubai",
hours: "Daily 9am – 10pm",
mapQuery: "Lovin Flowers, 7825+92J Al Karama, Dubai",   // powers the map + "Get directions"
```

- Anything left as `""` is hidden automatically: footer icons, contact rows and so on.
- While `whatsappNumber` is empty, the WhatsApp buttons still show. Clicking one only writes a
  note in the browser console with the message it would have sent. Once you add the number,
  every button works, with nothing else to change.
- Set `url` (or the `NEXT_PUBLIC_SITE_URL` environment variable) to your real domain. It is used
  for Google, link previews and the product links inside WhatsApp messages.

The WhatsApp message wording is in `content/en.ts` under `whatsapp`.

---

## Add or edit products

All products are in **`data/products.ts`**. Each one looks like this:

```ts
{
  name: "Ivory Peony Box",
  slug: "ivory-peony-box",            // used in the page address: /collection/ivory-peony-box
  category: "Box",                    // Bouquet, Grand Bouquet, Basket, Box, Forever Roses, Vase
  occasion: ["Love", "Birthday"],     // Love, Birthday, Congratulations, New Baby, Get Well
  description: "Two short, warm sentences about it.",
  stems: "Peonies, garden roses, eucalyptus",
  images: [
    img("ivory-peony-box-1.jpg", "Describe the photo for screen readers and Google"),
    img("ivory-peony-box-2.jpg", "Second photo — shown when a card is hovered"),
  ],
  inStock: true,                      // false → button says "Ask about availability"
  featured: true,                     // optional: show in the home page scroll
},
```

Filter chips on the Collection page come from the products. A new category, such as "Box",
appears as soon as one product uses it.

### Photos

1. Put photos in **`public/images/products/`**, named after the product: `ivory-peony-box-1.jpg`,
   `ivory-peony-box-2.jpg`, and so on. The first photo is the cover.
2. Portrait photos (3:4 or 4:5) look best. Around 2000px on the long side is plenty. The site
   resizes and compresses them automatically for every screen.
3. iPhone **HEIC** files must be converted to JPG first. On iPhone, set
   Settings → Camera → Formats → *Most Compatible*, or export as JPG.
4. Remove location data before uploading if your camera adds it.

### Other images (hero, about, events, gallery)

Every non-product image is listed in **`config/images.ts`**. They're all your own photos for now.
The Events page uses arrangement shots, so once you have photos of real weddings, corporate set-ups
or hotel lobbies, drop them into `public/images/` and replace the matching `src`, e.g.
`"/images/lifestyle/our-wedding-stage.jpg"`.

### Logo and favicon

- Logo: `public/logo/lovin-flowers-logo.png`, extracted from your `Logo.pdf`.
- Favicon / home-screen icon: `app/icon.png` and `app/apple-icon.png`, the butterfly from the logo.
- Link-preview image for WhatsApp, Instagram and iMessage: `public/og.jpg` (1200 × 630).

---

## "Design your own bouquet" builder (/design)

Customers pick a shape (Classic, Dome, Heart), paint flowers into the bouquet, choose the
wrapping paper and colour, add a ribbon message, fillers and toppers, then send the whole order
to your WhatsApp number with a picture of their design. Their design is saved in their browser,
so a refresh doesn't lose it.

Everything the builder offers is listed in **`data/builder.ts`**. Images live in:

```
public/builder/flowers/    flower heads, seen from directly above
public/builder/wrapping/   wrapping paper laid flat
public/builder/fillers/    eucalyptus, baby's breath…
public/builder/toppers/    teddy bears, plush toys, decorations
```

The images there now are drawn placeholders, so the builder works today.

### Add or replace an item

1. Save the photo as a **transparent PNG** (background removed), roughly square, about
   600 × 600px. Name it after the item: `red-rose-1.png`, `red-rose-2.png`…
2. Put it in the matching folder above.
3. In `data/builder.ts`, point the item's `images` at the new files. For example:
   ```ts
   { id: "red-rose", name: "Red rose", category: "flower", swatch: "#B5122C",
     images: img("flowers", "red-rose-1.png", "red-rose-2.png", "red-rose-3.png") },
   ```
   Several images of the same flower are mixed at random, so the bouquet looks natural.
4. To add a brand-new flower, copy an entry and give it a new `id` (lowercase, dashes).
   `scale` makes one flower bigger or smaller than a rose (e.g. `1.2` for hydrangea).

### Wrapping paper

Wrapping images should be **white or very light grey**: the colour the customer picks is tinted
onto the paper. Photograph white paper and let the builder colour it. The preset colours are
`paperColours` in `data/builder.ts`.

### What to photograph to replace the placeholders

- **Flowers:** one head of each flower (red, pink, white and peach rose, sunflower, tulip, lily,
  hydrangea, carnation, chrysanthemum), shot straight down from above on a plain background, in
  soft daylight, with no harsh shadow. Take 2–3 different heads per flower for variety.
- **Wrapping:** your white wrapping papers (matte, tissue, pearl, kraft-textured) arranged as a
  collar, shot straight down, so the centre is empty where the flowers go.
- **Fillers:** a sprig of eucalyptus and a cluster of baby's breath, laid flat, from above.
- **Toppers:** each teddy bear or plush toy you sell, from the front, on a plain background.

Remove the backgrounds (any background-remover app works) and save as PNG.

---

## Edit text

All page copy is in **`content/en.ts`**. Product text is in `data/products.ts`.

### Arabic later

Text is already kept apart from the layout, so Arabic can be added without redesigning:

1. Copy `content/en.ts` to `content/ar.ts` and translate the values.
2. Set `lang="ar" dir="rtl"` on `<html>` in `app/layout.tsx` (or add an `/ar` route).
   Layouts use start/end spacing, so they mirror automatically.

---

## Colours and fonts

Design tokens are in **`tailwind.config.ts`**, taken from the logo:

| Token        | Hex       | Use                                    |
| ------------ | --------- | -------------------------------------- |
| `linen`      | `#F7F2EC` | page background                        |
| `shell`      | `#EFE6DC` | soft panels, image placeholders        |
| `ink`        | `#231F20` | text (the logo's charcoal)             |
| `ink-soft`   | `#5E5557` | secondary text                         |
| `wing`       | `#AE3624` | accent (the butterfly red)             |
| `wing-deep`  | `#3B1210` | dark sections (oxblood)                |
| `blush`      | `#EBCFC4` | soft accent on dark                    |

Fonts: Cormorant Garamond (headings) and Manrope (body), from Google Fonts via `next/font`.

---

## Deploy to Vercel

1. Put this folder in a GitHub repository. The `.gitignore` already skips build files.
   The original photos in the project root (`IMG_*.HEIC`, `WhatsApp Image…`, `Logo.pdf`) aren't
   used by the site. Move them elsewhere first if you don't want them in the repository.
2. Go to [vercel.com/new](https://vercel.com/new), import the repository and press **Deploy**.
   Vercel detects Next.js; no settings are needed.
3. In the Vercel project → Settings → Domains, add your domain (e.g. `lovinflowers.ae`).
4. In Settings → Environment Variables, add `NEXT_PUBLIC_SITE_URL` = `https://lovinflowers.ae`,
   then redeploy.

Every push to GitHub redeploys the site automatically.

---

## Where things are

```
app/                    pages (home, collection, product, about, events, contact), SEO files
components/             header, footer, product card, WhatsApp buttons, loader, cursor
components/home/        home page sections
components/motion/      reveal / parallax animation helpers
config/site.ts          contact details and WhatsApp number
config/images.ts        every non-product image path
data/products.ts        all products
content/en.ts           all page text
lib/whatsapp.ts         builds WhatsApp links and messages
public/images/          photos
public/logo/            logo files
public/butterfly/       the logo butterfly split into wings, for the home page animation
public/builder/         images for the bouquet builder (see data/builder.ts)
components/builder/     the bouquet builder (canvas, panels, review)
lib/builder/            builder shapes, saved state, undo/redo, WhatsApp message
```

## Motion and accessibility

- Smooth scrolling (Lenis), the intro loader (first visit only), parallax, the pinned horizontal
  scroll, the butterflies (they stay perched, still) and the custom cursor are all switched off for visitors whose device asks for reduced motion.
- The custom cursor only appears on devices with a mouse.
- All images have alt text, every control works with the keyboard, and focus outlines are visible.
