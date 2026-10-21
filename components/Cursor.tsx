"use client";

import { useEffect, useRef, useState } from "react";
import { copy } from "@/content/en";

/**
 * Desktop-only cursor: a small dot that eases after the pointer and grows
 * into a "View" disc over anything marked data-cursor="view".
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");

    const pos = { x: -100, y: -100 };
    const cur = { x: -100, y: -100 };
    let raf = 0;
    let visible = false;

    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible && dot.current) {
        visible = true;
        cur.x = pos.x;
        cur.y = pos.y;
        dot.current.style.opacity = "1";
      }
      const target = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      setLabel(target ? target.dataset.cursor === "view" ? copy.product.view : target.dataset.cursor ?? null : null);
    };
    const leave = () => {
      visible = false;
      if (dot.current) dot.current.style.opacity = "0";
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    const loop = () => {
      cur.x += (pos.x - cur.x) * 0.2;
      cur.y += (pos.y - cur.y) * 0.2;
      if (dot.current) dot.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled]);

  if (!enabled) return null;

  const scale = label ? 1 : pressed ? 0.1 : 0.14;

  return (
    <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[90] opacity-0 transition-opacity duration-300" aria-hidden="true">
      <div
        className="-ml-11 -mt-11 flex items-center justify-center rounded-full bg-wing text-linen transition-transform duration-500 ease-silk"
        style={{ transform: `scale(${scale})`, width: 88, height: 88 }}
      >
        <span className={`label transition-opacity duration-300 ${label ? "opacity-100" : "opacity-0"}`}>{label}</span>
      </div>
    </div>
  );
}
