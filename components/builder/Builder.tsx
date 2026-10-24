"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "zustand";
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { toPng } from "html-to-image";
import { copy } from "@/content/en";
import { remapSlots, shapeSlots } from "@/lib/builder/shapes";
import { exportOptions } from "@/lib/builder/export";
import { beginGesture, cancelGesture, endGesture, useBuilder } from "@/lib/builder/store";
import { flowerCounts, totalPieces } from "@/lib/builder/message";
import { useLenis } from "../SmoothScroll";
import { SplitHeading, FadeUp } from "../motion/Reveal";
import { BouquetCanvas } from "./BouquetCanvas";
import { Panels } from "./Panels";
import { Review } from "./Review";

const t = copy.design;

function ToolButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center text-ink transition-colors duration-300 hover:bg-ink hover:text-linen disabled:pointer-events-none disabled:opacity-30"
    >
      <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
        {children}
      </svg>
    </button>
  );
}

export function Builder() {
  const design = useBuilder((s) => s.design);
  const tab = useBuilder((s) => s.tab);
  const activeFlower = useBuilder((s) => s.activeFlower);
  const selectedTopper = useBuilder((s) => s.selectedTopper);
  const { paintSlot, moveTopper, removeTopper, selectTopper } = useBuilder.getState();
  const { undo, redo, pastStates, futureStates } = useStore(useBuilder.temporal);

  const [step, setStep] = useState<"build" | "review">("build");
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [ready, setReady] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<ReactZoomPanPinchRef>(null);
  const lenis = useLenis();

  // Restore the saved design after hydration (never during SSR), then start undo history fresh.
  useEffect(() => {
    Promise.resolve(useBuilder.persist.rehydrate()).then(() => {
      const d = useBuilder.getState().design;
      if (d.slots.length !== shapeSlots(d.shape).length) {
        useBuilder.setState({ design: { ...d, slots: remapSlots(d.slots, d.shape) } });
      }
      useBuilder.temporal.getState().clear();
      setReady(true);
    });
  }, []);

  // Keyboard: Ctrl/Cmd+Z undo, Ctrl/Cmd+Shift+Z or Ctrl+Y redo, Esc leaves full screen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
      const typing = (e.target as HTMLElement)?.closest?.("input, textarea, select");
      if (typing || !(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((k === "z" && e.shiftKey) || k === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  // Full screen: freeze page scrolling and refit the bouquet.
  useEffect(() => {
    if (expanded) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = expanded ? "hidden" : "";
    const id = window.setTimeout(() => zoomRef.current?.resetTransform(0), 30);
    return () => window.clearTimeout(id);
  }, [expanded, lenis]);

  /* ---------- Painting: tap a slot, or drag across slots ---------- */
  const pointers = useRef(new Set<number>());
  const mode = useRef<"idle" | "paint" | "pinch">("idle");
  const last = useRef<{ x: number; y: number } | null>(null);
  const paintMode = tab === "flowers";

  const paintAt = useCallback(
    (x: number, y: number) => {
      // Fast swipes deliver few move events, so paint every ~8px along the path since the last one.
      const from = last.current ?? { x, y };
      const steps = Math.max(1, Math.ceil(Math.hypot(x - from.x, y - from.y) / 8));
      const flower = useBuilder.getState().activeFlower;
      for (let k = 1; k <= steps; k++) {
        const px = from.x + ((x - from.x) * k) / steps;
        const py = from.y + ((y - from.y) * k) / steps;
        const slot = document.elementFromPoint(px, py)?.closest<HTMLElement>("[data-slot]");
        if (slot && canvasRef.current?.contains(slot)) paintSlot(Number(slot.dataset.slot), flower);
      }
      last.current = { x, y };
    },
    [paintSlot],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (!paintMode) {
      if (!(e.target as HTMLElement).closest(".no-pan")) selectTopper(null);
      return;
    }
    pointers.current.add(e.pointerId);
    if (pointers.current.size > 1) {
      // A second finger means pinch-zoom, not painting: undo whatever the first finger painted.
      if (mode.current === "paint") cancelGesture();
      mode.current = "pinch";
      return;
    }
    mode.current = "paint";
    last.current = null;
    beginGesture();
    paintAt(e.clientX, e.clientY);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (mode.current === "paint" && pointers.current.has(e.pointerId)) paintAt(e.clientX, e.clientY);
  };
  const onPointerEnd = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) {
      if (mode.current === "paint") endGesture();
      mode.current = "idle";
    }
  };

  /* ---------- Toppers: drag to place ---------- */
  const onTopperPointerDown = (key: string, e: React.PointerEvent) => {
    e.stopPropagation();
    selectTopper(key);
    const canvas = canvasRef.current;
    const topper = useBuilder.getState().design.toppers.find((x) => x.key === key);
    if (!canvas || !topper) return;
    const rect = canvas.getBoundingClientRect();
    const offX = topper.x - ((e.clientX - rect.left) / rect.width) * 100;
    const offY = topper.y - ((e.clientY - rect.top) / rect.height) * 100;
    beginGesture();
    const move = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      const r = canvas.getBoundingClientRect(); // includes zoom
      moveTopper(key, ((ev.clientX - r.left) / r.width) * 100 + offX, ((ev.clientY - r.top) / r.height) * 100 + offY);
    };
    const up = (ev: PointerEvent) => {
      if (ev.pointerId !== e.pointerId) return;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      endGesture();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  /* ---------- Review ---------- */
  const goToReview = async () => {
    if (!canvasRef.current) return;
    setPreparing(true);
    selectTopper(null);
    try {
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      setSnapshot(await toPng(canvasRef.current, exportOptions(canvasRef.current)));
    } catch {
      setSnapshot(null);
    }
    setPreparing(false);
    setExpanded(false);
    setStep("review");
    lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  };

  const counts = flowerCounts(design);
  const pieces = totalPieces(design);
  const summary = counts.slice(0, 2).map((c) => `${c.count} ${c.name.toLowerCase()}`);

  if (step === "review") {
    return <Review snapshot={snapshot} canvasRef={canvasRef} onBack={() => setStep("build")} stage={<HiddenCanvas canvasRef={canvasRef} />} />;
  }

  return (
    <div className="relative">
      <header className="frame pb-8 pt-28 sm:pt-32 lg:pb-12 lg:pt-36">
        <div className="grid grid-cols-12 gap-x-4 gap-y-6">
          <div className="col-span-12 lg:col-span-7">
            <FadeUp immediate as="p" className="label flex items-center gap-4 text-wing">
              <span className="block h-px w-10 bg-wing/50" aria-hidden="true" />
              {t.label}
            </FadeUp>
            <SplitHeading as="h1" text={t.title} immediate delay={0.1} className="mt-6 text-display-md" />
          </div>
          <FadeUp immediate delay={0.3} as="p" className="col-span-12 max-w-md text-ink-soft lg:col-span-4 lg:col-start-9 lg:self-end">
            {t.intro}
          </FadeUp>
        </div>
      </header>

      {/* Phones: a flex column (a sticky grid item could only stick within its own row). Desktop: the 12-column grid. */}
      <div className="frame flex flex-col gap-8 pb-6 lg:grid lg:grid-cols-12 lg:gap-x-10">
        {/* Preview */}
        {/* Sticky on the grid item itself, so it stays pinned while the controls scroll — on phones too. */}
        <div
          className={`sticky top-[68px] col-span-12 -mx-gutter self-stretch bg-linen px-gutter pb-2 sm:top-[76px] lg:top-24 lg:col-span-7 lg:mx-0 lg:self-start lg:px-0 lg:pb-0 ${
            expanded ? "z-[90]" : "z-30"
          }`}
        >
          <div>
            <div
              data-lenis-prevent
              className={
                expanded
                  ? "fixed inset-0 z-[80] flex flex-col bg-linen"
                  : "relative border border-line bg-linen"
              }
            >
              <div className={`flex items-center justify-between border-b border-line ${expanded ? "px-4 py-2" : "px-2 py-1"}`}>
                <div className="flex">
                  <ToolButton label={t.undo} onClick={() => undo()} disabled={!pastStates.length}>
                    <path d="M7 5L3 9l4 4M3 9h9a5 5 0 010 10H9" />
                  </ToolButton>
                  <ToolButton label={t.redo} onClick={() => redo()} disabled={!futureStates.length}>
                    <path d="M13 5l4 4-4 4M17 9H8a5 5 0 000 10h3" />
                  </ToolButton>
                </div>
                <p className="label hidden text-ink-soft sm:block">{t.gestureHint}</p>
                <div className="flex">
                  <ToolButton label={t.zoomOut} onClick={() => zoomRef.current?.zoomOut(0.4)}>
                    <path d="M4 10h12" />
                  </ToolButton>
                  <ToolButton label={t.zoomIn} onClick={() => zoomRef.current?.zoomIn(0.4)}>
                    <path d="M4 10h12M10 4v12" />
                  </ToolButton>
                  <ToolButton label={t.fit} onClick={() => zoomRef.current?.resetTransform()}>
                    <path d="M3 7V3h4M13 3h4v4M17 13v4h-4M7 17H3v-4" />
                  </ToolButton>
                  <ToolButton label={expanded ? t.collapse : t.expand} onClick={() => setExpanded((v) => !v)}>
                    {expanded ? <path d="M7 3v4H3M13 3v4h4M17 13h-4v4M3 13h4v4" /> : <path d="M3 8V3h5M12 3h5v5M17 12v5h-5M8 17H3v-5" />}
                  </ToolButton>
                </div>
              </div>

              <div className={`overflow-hidden ${expanded ? "flex flex-1 items-center justify-center p-3" : ""}`}>
                <div
                  className={`mx-auto touch-none ${
                    expanded ? "w-[min(100%,calc((100svh-5rem)*5/6))]" : "w-[min(100%,calc(44svh*5/6))] lg:w-[min(100%,calc((100svh-17rem)*5/6))]"
                  }`}
                >
                  <TransformWrapper
                    ref={zoomRef}
                    minScale={0.8}
                    maxScale={4}
                    centerOnInit
                    limitToBounds
                    doubleClick={{ disabled: true }}
                    wheel={{ step: 0.12 }}
                    pinch={{ step: 6 }}
                    panning={{ disabled: paintMode, excluded: ["no-pan"], velocityDisabled: true }}
                  >
                    <TransformComponent wrapperStyle={{ width: "100%" }} contentStyle={{ width: "100%" }}>
                      <div
                        className={`w-full ${paintMode ? "cursor-crosshair" : ""}`}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerEnd}
                        onPointerCancel={onPointerEnd}
                        onPointerLeave={(e) => e.pointerType === "mouse" && onPointerEnd(e)}
                      >
                        <BouquetCanvas
                          ref={canvasRef}
                          design={design}
                          showEmpty={ready}
                          toppersActive={tab === "finishing"}
                          selectedTopper={selectedTopper}
                          onTopperPointerDown={onTopperPointerDown}
                          onTopperRemove={removeTopper}
                        />
                      </div>
                    </TransformComponent>
                  </TransformWrapper>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="col-span-12 lg:col-span-5">
          <Panels activeFlower={activeFlower} />
        </div>
      </div>

      {/* Sticky summary bar */}
      <div className="sticky bottom-0 z-40 border-t border-line bg-linen/95 backdrop-blur-[2px]">
        <div className="frame flex items-center justify-between gap-4 py-3 sm:py-4">
          <div className="min-w-0">
            <p className="label text-wing">{t.pieces(pieces)}</p>
            <p className="mt-1 truncate text-sm text-ink-soft">
              {counts.length ? (
                <>
                  {summary.join(" · ")}
                  {counts.length > 2 && ` · ${t.more(counts.length - 2)}`}
                </>
              ) : (
                t.empty
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={goToReview}
            disabled={!counts.length || preparing}
            className="label inline-flex min-h-[52px] shrink-0 items-center justify-center bg-ink px-6 text-linen transition-colors duration-500 hover:bg-wing disabled:opacity-40 sm:px-8"
          >
            {preparing ? t.preparing : t.review}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Off-screen copy of the bouquet so the review screen can still export a fresh image. */
function HiddenCanvas({ canvasRef }: { canvasRef: React.RefObject<HTMLDivElement | null> }) {
  const design = useBuilder((s) => s.design);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed -left-[9999px] top-0 w-[600px] [&_.bloom-pop]:[animation:none]">
      <BouquetCanvas ref={canvasRef} design={design} />
    </div>
  );
}
