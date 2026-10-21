"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * The second photo that cross-fades in when a product card is hovered.
 * Only mounted on devices that can hover, so phones never download it.
 */
export function HoverImage({ src, sizes }: { src: string; sizes: string }) {
  const [canHover, setCanHover] = useState(false);
  useEffect(() => setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches), []);
  if (!canHover) return null;

  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      fill
      sizes={sizes}
      className="object-cover opacity-0 transition-[opacity,transform] duration-[1.4s] ease-silk group-hover:scale-[1.05] group-hover:opacity-100"
    />
  );
}
