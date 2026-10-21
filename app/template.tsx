"use client";

import { useEffect } from "react";
import { m } from "framer-motion";

// The very first page load is shown straight away (fast first paint);
// every navigation after that gets a soft fade-and-rise.
let firstLoad = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const animate = !firstLoad;
  useEffect(() => {
    firstLoad = false;
  }, []);

  return (
    <m.div
      initial={animate ? { opacity: 0, y: 18 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
