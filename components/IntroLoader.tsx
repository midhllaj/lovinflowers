"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Logo } from "./Logo";

export const INTRO_KEY = "lovin-intro-seen";

/** Runs before first paint: marks returning visitors so the loader never flashes for them. */
export const introScript = `try{if(localStorage.getItem("${INTRO_KEY}"))document.documentElement.dataset.intro="seen"}catch(e){}`;

const silk = [0.22, 1, 0.36, 1] as const;

export function IntroLoader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (document.documentElement.dataset.intro === "seen") {
      setShow(false);
      return;
    }
    try {
      localStorage.setItem(INTRO_KEY, "1");
    } catch {}
    const hide = window.setTimeout(() => setShow(false), 1050);
    // Once the hero has finished its entrance, later visits to it skip the loader delay.
    const mark = window.setTimeout(() => (document.documentElement.dataset.intro = "seen"), 4000);
    return () => {
      window.clearTimeout(hide);
      window.clearTimeout(mark);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <m.div
          key="intro"
          className="intro fixed inset-0 z-[100] flex items-center justify-center bg-linen"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="overflow-hidden px-2 pb-2">
              <m.div initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 0.8, ease: silk }}>
                <Logo height={44} className="h-8 sm:h-11" />
              </m.div>
            </div>
            <m.span
              className="block h-px w-40 origin-left bg-ink/40"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: silk, delay: 0.1 }}
            />
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
