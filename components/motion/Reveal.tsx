"use client";

import { useRef } from "react";
import Image, { type ImageProps } from "next/image";
import { m, useInView } from "framer-motion";

const silk = [0.22, 1, 0.36, 1] as const;

/**
 * Image that wipes in from below when it enters the screen.
 * The mask slides up while the photo counter-slides down, so it reads as a
 * clip-path wipe but animates transform only (stays on the GPU at 60fps).
 */
export function RevealImage({
  className = "",
  imgClassName = "",
  delay = 0,
  ...img
}: ImageProps & { className?: string; imgClassName?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const t = { duration: 1.25, ease: silk, delay };

  // Above-the-fold photos (preload) reveal with CSS so they paint before hydration.
  if (img.preload || img.priority) {
    const d = { "--d": `${delay}s` } as React.CSSProperties;
    return (
      <div className={`relative overflow-hidden bg-shell ${className}`}>
        <div className="css-wipe absolute inset-0 overflow-hidden" style={d}>
          <div className="css-drop absolute inset-0" style={{ ...d, animationDuration: "1.25s" }}>
            <div className="css-settle absolute inset-0" style={d}>
              <Image {...img} alt={img.alt} fill fetchPriority="high" className={`object-cover ${imgClassName}`} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative overflow-hidden bg-shell ${className}`}>
      <m.div className="absolute inset-0 overflow-hidden" initial={{ y: "100%" }} animate={inView ? { y: "0%" } : undefined} transition={t}>
        <m.div className="absolute inset-0" initial={{ y: "-100%" }} animate={inView ? { y: "0%" } : undefined} transition={t}>
          <m.div className="absolute inset-0" initial={{ scale: 1.18 }} animate={inView ? { scale: 1 } : undefined} transition={{ ...t, duration: 1.8 }}>
            <Image {...img} alt={img.alt} fill className={`object-cover ${imgClassName}`} />
          </m.div>
        </m.div>
      </m.div>
    </div>
  );
}

/**
 * Heading whose words slide up out of a mask, one after another.
 * Use "\n" for line breaks and *word* for an italic accent word.
 */
export function SplitHeading({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 0.06,
  immediate = false,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const lines = text.split("\n");
  let i = 0;

  return (
    <Tag ref={ref as never} className={className}>
      {/* Screen readers get the plain sentence; the animated word spans are hidden from them. */}
      <span className="sr-only">{text.replace(/\*/g, "").replace(/\n/g, " ")}</span>
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden="true">
          {line.split(" ").map((word, wi) => {
            const italic = /^\*.*\*[,.]?$/.test(word);
            const clean = word.replace(/\*/g, "");
            const index = i++;
            return (
              <span key={wi} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top">
                {immediate ? (
                  // Load-time headings animate in CSS so they paint before hydration.
                  <span
                    className={`css-rise inline-block ${italic ? "font-normal italic text-wing" : ""}`}
                    style={{ "--d": `${delay + index * stagger}s` } as React.CSSProperties}
                  >
                    {clean}
                  </span>
                ) : (
                  <m.span
                    className={`inline-block will-change-transform ${italic ? "font-normal italic text-wing" : ""}`}
                    initial={{ y: "110%" }}
                    animate={inView ? { y: "0%" } : undefined}
                    transition={{ duration: 1.1, ease: silk, delay: delay + index * stagger }}
                  >
                    {clean}
                  </m.span>
                )}
                {wi < line.split(" ").length - 1 && " "}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

/** Simple fade-and-rise for paragraphs, labels and buttons. */
export function FadeUp({
  children,
  className = "",
  delay = 0,
  as = "div",
  immediate = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "p" | "span" | "li";
  /** Above the fold: animate with CSS on load so it paints before hydration. */
  immediate?: boolean;
}) {
  if (immediate) {
    const Tag = as;
    return (
      <Tag className={`css-lift ${className}`} style={{ "--d": `${delay}s` } as React.CSSProperties}>
        {children}
      </Tag>
    );
  }
  const Comp = m[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1, ease: silk, delay }}
    >
      {children}
    </Comp>
  );
}
