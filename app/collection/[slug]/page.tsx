import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { copy } from "@/content/en";
import { site } from "@/config/site";
import { getProduct, occasionSlug, products, relatedProducts } from "@/data/products";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductCard } from "@/components/ProductCard";
import { EnquireButton } from "@/components/WhatsApp";
import { SplitHeading, FadeUp } from "@/components/motion/Reveal";
import { ArrowIcon } from "@/components/Icons";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  const title = `${product.name} — ${product.category} Delivery in Dubai`;
  return {
    title,
    description: `${product.description} Same-day delivery across Dubai — order on WhatsApp.`,
    alternates: { canonical: `/collection/${product.slug}` },
    openGraph: {
      title: `${product.name} | ${site.name}`,
      description: product.description,
      images: [{ url: product.images[0].src, alt: product.images[0].alt }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const related = relatedProducts(product, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => `${site.url}${i.src}`),
    category: product.category,
    brand: { "@type": "Brand", name: site.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="frame pb-section pt-24 sm:pt-32 lg:pt-36">
        <Link href="/collection" className="group label inline-flex min-h-[44px] items-center gap-3 text-ink-soft hover:text-ink">
          <ArrowIcon className="w-6 rotate-180 transition-transform duration-500 ease-silk group-hover:-translate-x-1 rtl:rotate-0" />
          {copy.product.back}
        </Link>

        <div className="mt-6 grid grid-cols-12 gap-x-4 gap-y-12 lg:mt-10 lg:gap-x-6">
          <div className="col-span-12 lg:col-span-7">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-32">
              <FadeUp immediate as="p" className="label text-wing">
                {product.category}
              </FadeUp>
              <SplitHeading as="h1" text={product.name} immediate delay={0.1} className="mt-5 text-display-md" />
              {!product.inStock && <p className="label mt-5 text-wing">{copy.product.outOfStock}</p>}

              <FadeUp immediate as="p" delay={0.3} className="mt-8 text-[1.05rem] leading-relaxed text-ink-soft">
                {product.description}
              </FadeUp>

              <FadeUp immediate delay={0.4}>
                <dl className="mt-10 border-t border-line text-sm">
                  <div className="flex gap-6 border-b border-line py-4">
                    <dt className="label w-28 shrink-0 pt-0.5 text-ink-soft">{copy.product.stems}</dt>
                    <dd>{product.stems}</dd>
                  </div>
                  <div className="flex gap-6 border-b border-line py-4">
                    <dt className="label w-28 shrink-0 pt-0.5 text-ink-soft">{copy.product.occasions}</dt>
                    <dd className="flex flex-wrap gap-x-3 gap-y-1">
                      {product.occasion.map((o) => (
                        <Link key={o} href={`/collection?occasion=${occasionSlug(o)}`} className="link-draw">
                          {o}
                        </Link>
                      ))}
                    </dd>
                  </div>
                </dl>

                <div className="mt-8 flex items-start gap-4 bg-shell p-5">
                  <span className="mt-1.5 block h-2 w-2 shrink-0 rounded-full bg-wing" aria-hidden="true" />
                  <div>
                    <p className="font-serif text-xl">{copy.product.delivery}</p>
                    <p className="mt-1 text-sm text-ink-soft">{copy.product.deliveryNote}</p>
                  </div>
                </div>

                <EnquireButton name={product.name} slug={product.slug} inStock={product.inStock} className="mt-8 w-full" />
              </FadeUp>
            </div>
          </div>
        </div>
      </article>

      <section className="border-t border-line bg-shell py-20 sm:py-28" aria-labelledby="related-title">
        <div className="frame">
          <div id="related-title">
            <SplitHeading text={copy.product.related} className="text-display-md" />
          </div>
        </div>
        <div className="rail mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-gutter pb-4 lg:mx-auto lg:grid lg:max-w-frame lg:grid-cols-4 lg:overflow-visible" data-lenis-prevent>
          {related.map((p, i) => (
            <div key={p.slug} className={`w-[70vw] shrink-0 snap-start sm:w-[42vw] lg:w-auto ${i % 2 ? "lg:mt-16" : ""}`}>
              <ProductCard product={p} aspect="aspect-[3/4]" sizes="(min-width: 1024px) 24vw, 70vw" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
