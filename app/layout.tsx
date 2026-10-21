import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { site } from "@/config/site";
import { images } from "@/config/images";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { IntroLoader, introScript } from "@/components/IntroLoader";
import { Cursor } from "@/components/Cursor";
import { WhatsAppFloat } from "@/components/WhatsApp";
import { MotionProvider } from "@/components/motion/MotionProvider";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-serif",
  display: "swap",
});

// Italic accents load after the main fonts, so they don't compete with the first paint.
const serifItalic = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: "italic",
  variable: "--font-serif-italic",
  display: "swap",
  preload: false,
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const title = `${site.name} — Luxury Flower Delivery in Dubai`;
const description =
  "Hand-made bouquets, grand roses and flower baskets from a Dubai florist. Same-day flower delivery across Dubai. Order on WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.name} Dubai` },
  description,
  keywords: [
    "flower delivery Dubai",
    "florist Dubai",
    "luxury flowers Dubai",
    "same day flower delivery Dubai",
    "roses Dubai",
    "flower basket Dubai",
    "bouquet Dubai",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_AE",
    title,
    description,
    images: [{ url: images.og, width: 1200, height: 630, alt: `${site.name} — flowers in Dubai` }],
  },
  twitter: { card: "summary_large_image", title, description, images: [images.og] },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#F7F2EC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // lang/dir are set here so an Arabic version only needs lang="ar" dir="rtl".
    <html lang="en" dir="ltr" className={`${serif.variable} ${serifItalic.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <MotionProvider>
          <SmoothScroll>
            <IntroLoader />
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <WhatsAppFloat />
            <Cursor />
          </SmoothScroll>
        </MotionProvider>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
