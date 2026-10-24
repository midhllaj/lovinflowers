"use client";

import { forwardRef, useId } from "react";
import { fillerById, flowerById, paperById, ribbonColours, topperById } from "@/data/builder";
import { CANVAS_H, CANVAS_W, fillerSpots, hash, shapeSlots } from "@/lib/builder/shapes";
import { useTintedImage } from "@/lib/builder/tint";
import type { Design } from "@/lib/builder/design";

// Rounded so server and browser write identical style strings (no hydration mismatch).
const round = (v: number, d = 3) => Math.round(v * 10 ** d) / 10 ** d;
const pctX = (v: number) => `${round((v / CANVAS_W) * 100)}%`;
const pctY = (v: number) => `${round((v / CANVAS_H) * 100)}%`;

type Props = {
  design: Design;
  /** Show dashed outlines on empty slots (hidden in exported images). */
  showEmpty?: boolean;
  /** Toppers can be grabbed (Finishing tab). */
  toppersActive?: boolean;
  selectedTopper?: string | null;
  onTopperPointerDown?: (key: string, e: React.PointerEvent) => void;
  onTopperRemove?: (key: string) => void;
  /** Stagger the "pop" of each flower (home page teaser). */
  stagger?: boolean;
  className?: string;
};

/**
 * The bouquet, drawn back to front:
 * 1 wrapping paper · 2 eucalyptus behind · 3 flower heads · 4 baby's breath in the gaps · 5 ribbon · 6 toppers.
 * Pure presentation: it only reads the design, so it works for the live editor, the home teaser and the export.
 */
export const BouquetCanvas = forwardRef<HTMLDivElement, Props>(function BouquetCanvas(
  { design, showEmpty, toppersActive, selectedTopper, onTopperPointerDown, onTopperRemove, stagger, className = "" },
  ref,
) {
  const slots = shapeSlots(design.shape);
  const paper = paperById(design.paperId);
  const paperSrc = useTintedImage(paper.images[0], design.paperColor);
  const spots = fillerSpots(design.shape);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  const fillerLayer = (id: string, list: typeof spots.edge) => {
    const item = fillerById(id);
    const qty = design.fillers[id] ?? 0;
    if (!item || !qty) return null;
    return list.slice(0, qty).map((s, i) => (
      <img
        key={`${id}-${i}`}
        src={item.images[Math.floor(hash(id, i) * item.images.length)]}
        alt=""
        draggable={false}
        className="bloom-pop pointer-events-none absolute select-none"
        style={{
          left: pctX(s.x - s.size / 2),
          top: pctY(s.y - s.size / 2),
          width: pctX(s.size),
          transform: `rotate(${round(s.rotate, 1)}deg)`,
        }}
      />
    ));
  };

  // Ribbon: a satin band on a gentle curve, with the text set along the same curve.
  const ry = 640 + design.ribbon.y * 420;
  const ribbonPath = `M 250 ${ry} C 420 ${ry + 46}, 580 ${ry + 46}, 750 ${ry}`;
  const ribbon = ribbonColours.find((c) => c.hex === design.ribbon.color) ?? ribbonColours[0];
  const text = design.ribbon.text.trim();
  const fontSize = text.length > 18 ? 30 : text.length > 12 ? 36 : 42;

  return (
    <div
      ref={ref}
      className={`relative w-full select-none overflow-hidden bg-linen ${className}`}
      style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
    >
      {/* 1 · Wrapping paper */}
      <img
        src={paperSrc}
        alt=""
        draggable={false}
        className="pointer-events-none absolute select-none"
        style={{ left: pctX(40), top: pctY(80), width: pctX(920) }}
      />

      {/* 2 · Eucalyptus peeking out from behind */}
      {fillerLayer("eucalyptus", spots.edge)}

      {/* 3 · Flower heads — rim first so centre heads overlap them */}
      {slots
        .map((s, i) => ({ s, i }))
        .reverse()
        .map(({ s, i }) => {
          const id = design.slots[i];
          const flower = id ? flowerById(id) : undefined;
          const scale = flower?.scale ?? 1;
          return (
            <div
              key={i}
              data-slot={i}
              className="absolute aspect-square"
              style={{ left: pctX(s.x - s.size / 2), top: pctY(s.y - s.size / 2), width: pctX(s.size) }}
            >
              {flower ? (
                <span
                  key={id}
                  className="bloom-pop pointer-events-none absolute inset-0 block"
                  style={stagger ? { animationDelay: `${round(0.15 + i * 0.035, 2)}s` } : undefined}
                >
                  {/* soft contact shadow — a gradient, not a filter, so it stays cheap on phones */}
                  <span
                    className="absolute inset-[4%] rounded-full"
                    style={{
                      transform: `translate(4%, 7%) scale(${scale})`,
                      background: "radial-gradient(circle, rgba(40,20,18,.34) 30%, rgba(40,20,18,0) 70%)",
                    }}
                  />
                  <img
                    src={flower.images[Math.floor(hash(i, id!) * flower.images.length)]}
                    alt=""
                    draggable={false}
                    className="absolute inset-0 h-full w-full select-none"
                    style={{ transform: `rotate(${round((hash("r", i, id!) - 0.5) * 70, 1)}deg) scale(${round(scale * (0.94 + hash("s", i) * 0.12))})` }}
                  />
                </span>
              ) : (
                showEmpty && (
                  <span data-export-hide className="pointer-events-none absolute inset-[18%] rounded-full border border-dashed border-ink/25" />
                )
              )}
            </div>
          );
        })}

      {/* 4 · Baby's breath in the gaps */}
      {fillerLayer("babys-breath", spots.gaps)}

      {/* 5 · Ribbon */}
      {text && (
        <svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <path id={`rp${uid}`} d={ribbonPath} />
          </defs>
          <path d={`M 262 ${ry + 6} l -46 70 l 40 -16 l 6 40 z`} fill={ribbon.hex} stroke="rgba(0,0,0,.18)" strokeWidth="2" />
          <path d={`M 738 ${ry + 6} l 46 70 l -40 -16 l -6 40 z`} fill={ribbon.hex} stroke="rgba(0,0,0,.18)" strokeWidth="2" />
          <path d={ribbonPath} fill="none" stroke="rgba(0,0,0,.22)" strokeWidth="70" strokeLinecap="butt" />
          <path d={ribbonPath} fill="none" stroke={ribbon.hex} strokeWidth="64" strokeLinecap="butt" />
          <path d={ribbonPath} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="10" transform="translate(0 -18)" />
          <text
            fill={ribbon.text}
            fontSize={fontSize}
            dominantBaseline="central"
            textAnchor="middle"
            style={{ fontFamily: "var(--font-serif-italic), var(--font-serif), Georgia, serif", fontStyle: "italic", letterSpacing: "0.02em" }}
          >
            <textPath href={`#rp${uid}`} startOffset="50%">
              {text}
            </textPath>
          </text>
        </svg>
      )}

      {/* 6 · Toppers */}
      {design.toppers.map((t) => {
        const item = topperById(t.itemId);
        if (!item) return null;
        const selected = selectedTopper === t.key;
        const width = t.itemId === "butterfly" ? 15 : 22;
        return (
          <div
            key={t.key}
            className={`no-pan absolute -translate-x-1/2 -translate-y-1/2 ${toppersActive ? "cursor-grab touch-none active:cursor-grabbing" : "pointer-events-none"}`}
            style={{ left: `${t.x}%`, top: `${t.y}%`, width: `${width}%` }}
            onPointerDown={toppersActive ? (e) => onTopperPointerDown?.(t.key, e) : undefined}
          >
            <img src={item.images[0]} alt={item.name} draggable={false} className="bloom-pop pointer-events-none block w-full select-none" />
            {toppersActive && selected && (
              <>
                <span data-export-hide className="pointer-events-none absolute -inset-2 rounded-full border border-dashed border-wing" />
                <button
                  type="button"
                  data-export-hide
                  aria-label={`Remove ${item.name}`}
                  className="no-pan absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-linen"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => onTopperRemove?.(t.key)}
                >
                  <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
                    <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
});
