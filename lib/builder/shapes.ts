import type { ShapeId } from "@/data/builder";

/**
 * Bouquet geometry. Everything is in canvas units: the preview is
 * CANVAS_W × CANVAS_H (5:6), and every position is converted to % when drawn.
 */
export const CANVAS_W = 1000;
export const CANVAS_H = 1200;
export const CENTER = { x: 500, y: 520 };

export type Slot = { x: number; y: number; size: number };
export type Spot = { x: number; y: number; size: number; rotate: number };

const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/** Small stable hash, so "random" rotation/variation is the same on every render and in the exported image. */
export const hash = (...parts: (string | number)[]) => {
  let h = 2166136261;
  for (const c of parts.join("|")) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
};

const byDistance = (slots: Slot[], cx = CENTER.x, cy = CENTER.y) =>
  [...slots].sort((a, b) => Math.hypot(a.x - cx, a.y - cy) - Math.hypot(b.x - cx, b.y - cy));

/** Dome: ~44 heads packed into a circle (sunflower-seed spiral, slightly smaller at the rim). */
function dome(): Slot[] {
  const n = 44;
  const R = 330;
  const base = ((2 * R) / Math.sqrt(n)) * 1.32;
  const slots: Slot[] = [];
  for (let i = 0; i < n; i++) {
    const t = Math.sqrt((i + 0.5) / n);
    const a = i * GOLDEN;
    slots.push({ x: CENTER.x + R * t * Math.cos(a), y: CENTER.y + R * t * Math.sin(a), size: base * (1.04 - 0.12 * t) });
  }
  return byDistance(slots);
}

/** Heart: a hex grid of heads kept inside the classic heart curve. */
function heart(): Slot[] {
  const K = 300; // px per heart unit
  const inside = (x: number, y: number) => {
    const sx = x / 0.92;
    const sy = y / 0.92;
    return (sx * sx + sy * sy - 1) ** 3 - sx * sx * sy ** 3 <= 0;
  };
  let spacing = 0.34;
  let pts: { x: number; y: number }[] = [];
  // tighten the grid until the heart holds about 40 heads
  for (let k = 0; k < 20; k++) {
    pts = [];
    for (let row = -8; row <= 8; row++) {
      for (let col = -8; col <= 8; col++) {
        const x = (col + (row % 2 ? 0.5 : 0)) * spacing;
        const y = row * spacing * 0.866 + 0.12;
        if (inside(x, y)) pts.push({ x, y });
      }
    }
    if (pts.length >= 38) break;
    spacing *= 0.97;
  }
  const cy = CENTER.y + 30;
  const slots = pts.map((p) => ({ x: CENTER.x + p.x * K, y: cy - p.y * K, size: spacing * K * 1.38 }));
  return byDistance(slots, CENTER.x, cy - 40);
}

/** Classic: a looser, hand-tied cluster — fewer heads, uneven sizes, a little taller than wide. */
function classic(): Slot[] {
  const n = 30;
  const R = 350;
  const base = ((2 * R) / Math.sqrt(n)) * 1.18;
  const slots: Slot[] = [];
  for (let i = 0; i < n; i++) {
    const t = Math.sqrt((i + 0.5) / n);
    const a = i * GOLDEN;
    const jx = (hash("cx", i) - 0.5) * 0.16 * R;
    const jy = (hash("cy", i) - 0.5) * 0.16 * R;
    slots.push({
      x: CENTER.x + R * t * Math.cos(a) * 0.96 + jx,
      y: CENTER.y - 10 + R * t * Math.sin(a) * 1.06 + jy,
      size: base * (0.86 + hash("cs", i) * 0.36),
    });
  }
  return byDistance(slots);
}

const cache = new Map<ShapeId, Slot[]>();

/** Slots for a shape, ordered from the centre outwards (index 0 = centre). */
export const shapeSlots = (shape: ShapeId): Slot[] => {
  if (!cache.has(shape)) cache.set(shape, shape === "dome" ? dome() : shape === "heart" ? heart() : classic());
  return cache.get(shape)!;
};

/**
 * Carries flower choices over when the shape changes: slots are matched by
 * their rank from the centre, so the centre stays the centre and the rim the rim.
 */
export const remapSlots = (from: (string | null)[], toShape: ShapeId) => {
  const n = shapeSlots(toShape).length;
  if (!from.length) return Array<string | null>(n).fill(null);
  return Array.from({ length: n }, (_, r) => from[Math.min(from.length - 1, Math.floor((r * from.length) / n))] ?? null);
};

const spotCache = new Map<ShapeId, { edge: Spot[]; gaps: Spot[] }>();

/**
 * Where fillers go: `edge` spots peek out around the rim (eucalyptus),
 * `gaps` sit in the gaps between heads (baby's breath).
 */
export const fillerSpots = (shape: ShapeId) => {
  if (spotCache.has(shape)) return spotCache.get(shape)!;
  const slots = shapeSlots(shape);
  const cx = slots.reduce((s, p) => s + p.x, 0) / slots.length;
  const cy = slots.reduce((s, p) => s + p.y, 0) / slots.length;
  const maxD = Math.max(...slots.map((s) => Math.hypot(s.x - cx, s.y - cy)));

  const outer = slots.filter((s) => Math.hypot(s.x - cx, s.y - cy) > maxD * 0.72);
  const edge: Spot[] = outer
    .map((s, i) => {
      const a = Math.atan2(s.y - cy, s.x - cx);
      const push = s.size * 0.55;
      return { x: s.x + Math.cos(a) * push, y: s.y + Math.sin(a) * push, size: 170, rotate: (a * 180) / Math.PI + 90, order: hash(shape, "e", i) };
    })
    .sort((a, b) => a.order - b.order);

  const gaps: Spot[] = [];
  slots.forEach((s, i) => {
    const near = slots
      .map((o, j) => ({ o, j, d: Math.hypot(o.x - s.x, o.y - s.y) }))
      .filter((n) => n.j > i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    near.forEach(({ o }) => {
      const x = (s.x + o.x) / 2;
      const y = (s.y + o.y) / 2;
      if (gaps.every((g) => Math.hypot(g.x - x, g.y - y) > 60)) {
        gaps.push({ x, y, size: 120, rotate: hash(shape, "g", x, y) * 360 });
      }
    });
  });
  gaps.sort((a, b) => hash(shape, "o", a.x, a.y) - hash(shape, "o", b.x, b.y));

  const spots = { edge, gaps };
  spotCache.set(shape, spots);
  return spots;
};
