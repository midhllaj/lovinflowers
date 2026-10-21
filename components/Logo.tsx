import Image from "next/image";
import { site } from "@/config/site";

// Source file is 4248 × 579 — width is always derived from height so it never stretches.
const RATIO = 4248 / 579;

type Props = { height: number; className?: string; preload?: boolean };

export function Logo({ height, className, preload }: Props) {
  return (
    <Image
      src="/logo/lovin-flowers-logo.png"
      alt={site.name}
      width={Math.round(height * RATIO)}
      height={height}
      preload={preload}
      // One shared size for every placement, so the browser downloads the logo once.
      sizes="330px"
      className={className}
      style={{ width: "auto", height }}
    />
  );
}
