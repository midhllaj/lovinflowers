"use client";

import { LazyMotion, MotionConfig } from "framer-motion";

// Animation features load after first paint, keeping them out of the critical JS.
const loadFeatures = () => import("./features").then((mod) => mod.default);

/** reducedMotion="user": transforms are skipped for visitors who ask for less motion. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
