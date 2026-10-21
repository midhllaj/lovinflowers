import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { copy } from "@/content/en";
import { EnquireButton } from "./WhatsApp";
import { HoverImage } from "./HoverImage";

type Props = {
  product: Product;
  /** Tailwind aspect class for the photo, so grids can vary card heights. */
  aspect?: string;
  sizes?: string;
  index?: number;
  priority?: boolean;
};

export function ProductCard({ product, aspect = "aspect-[4/5]", sizes = "(min-width: 1024px) 33vw, 90vw", index, priority }: Props) {
  const [first, second] = product.images;

  return (
    <article className="group">
      <Link href={`/collection/${product.slug}`} data-cursor="view" className="block" aria-label={product.name}>
        <div className={`relative overflow-hidden bg-shell ${aspect}`}>
          <Image
            src={first.src}
            alt={first.alt}
            fill
            sizes={sizes}
            preload={priority}
            fetchPriority={priority ? "high" : "auto"}
            className="object-cover transition-transform duration-[1.4s] ease-silk group-hover:scale-[1.05]"
          />
          {second && <HoverImage src={second.src} sizes={sizes} />}
          {!product.inStock && (
            <span className="label absolute start-3 top-3 bg-linen px-3 py-1.5 text-ink">{copy.product.outOfStock}</span>
          )}
        </div>
      </Link>

      <div className="mt-5 flex items-start justify-between gap-4 border-t border-line pt-4">
        <div>
          <p className="label text-ink-soft">
            {index !== undefined && <span className="me-3 text-wing">{String(index + 1).padStart(2, "0")}</span>}
            {product.category}
          </p>
          <h3 className="mt-2 font-serif text-[1.85rem] font-light leading-[1.05] sm:text-[2.1rem]">
            <Link href={`/collection/${product.slug}`} className="link-draw">
              {product.name}
            </Link>
          </h3>
        </div>
      </div>
      <EnquireButton name={product.name} slug={product.slug} inStock={product.inStock} variant="text" className="mt-2" />
    </article>
  );
}
