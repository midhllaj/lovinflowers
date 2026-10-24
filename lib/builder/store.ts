"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { temporal } from "zundo";
import { flowers, MAX_FILLER, MAX_RIBBON, type ShapeId } from "@/data/builder";
import { remapSlots } from "./shapes";
import { defaultDesign, type Design } from "./design";

export { defaultDesign, type Design, type Topper } from "./design";

export type Order = {
  name: string;
  date: string;
  method: "delivery" | "pickup";
  area: string;
  note: string;
};

export type Tab = "flowers" | "wrapping" | "finishing";

const defaultOrder = (): Order => ({ name: "", date: "", method: "delivery", area: "", note: "" });

type State = {
  design: Design;
  order: Order;
  tab: Tab;
  activeFlower: string | null; // null = eraser
  selectedTopper: string | null;

  setShape: (shape: ShapeId) => void;
  paintSlot: (index: number, flowerId: string | null) => void;
  fillAll: (flowerId: string | null) => void;
  clearFlowers: () => void;
  setPaper: (id: string) => void;
  setPaperColor: (hex: string) => void;
  setFiller: (id: string, qty: number) => void;
  setRibbon: (patch: Partial<Design["ribbon"]>) => void;
  addTopper: (itemId: string) => void;
  moveTopper: (key: string, x: number, y: number) => void;
  removeTopper: (key: string) => void;
  setName: (name: string) => void;
  resetDesign: () => void;

  setOrder: (patch: Partial<Order>) => void;
  setTab: (tab: Tab) => void;
  setActiveFlower: (id: string | null) => void;
  selectTopper: (key: string | null) => void;
};

const TOY_SPOTS = [{ x: 80, y: 62 }, { x: 20, y: 62 }, { x: 74, y: 30 }, { x: 26, y: 30 }];
const BUTTERFLY_SPOTS = [{ x: 70, y: 17 }, { x: 28, y: 22 }, { x: 82, y: 42 }, { x: 16, y: 44 }];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export const useBuilder = create<State>()(
  temporal(
    persist(
      (set, get) => {
        const patch = (fn: (d: Design) => Partial<Design>) => set({ design: { ...get().design, ...fn(get().design) } });
        return {
          design: defaultDesign(),
          order: defaultOrder(),
          tab: "flowers",
          activeFlower: flowers[0].id,
          selectedTopper: null,

          setShape: (shape) => patch((d) => (d.shape === shape ? {} : { shape, slots: remapSlots(d.slots, shape) })),
          paintSlot: (index, flowerId) =>
            patch((d) => {
              if (d.slots[index] === flowerId) return {};
              const slots = [...d.slots];
              slots[index] = flowerId;
              return { slots };
            }),
          fillAll: (flowerId) => patch((d) => ({ slots: d.slots.map(() => flowerId) })),
          clearFlowers: () => patch((d) => ({ slots: d.slots.map(() => null) })),
          setPaper: (paperId) => patch(() => ({ paperId })),
          setPaperColor: (paperColor) => patch(() => ({ paperColor })),
          setFiller: (id, qty) => patch((d) => ({ fillers: { ...d.fillers, [id]: clamp(qty, 0, MAX_FILLER) } })),
          setRibbon: (p) =>
            patch((d) => ({ ribbon: { ...d.ribbon, ...p, text: (p.text ?? d.ribbon.text).slice(0, MAX_RIBBON) } })),
          addTopper: (itemId) => {
            const key = `${itemId}-${Date.now().toString(36)}`;
            // Plush toys sit beside the bouquet, decorations perch on the rim — clear of the ribbon.
            const spots = itemId === "butterfly" ? BUTTERFLY_SPOTS : TOY_SPOTS;
            const n = get().design.toppers.filter((t) => (t.itemId === "butterfly") === (itemId === "butterfly")).length;
            const spot = spots[n % spots.length];
            patch((d) => ({ toppers: [...d.toppers, { key, itemId, ...spot }] }));
            set({ selectedTopper: key });
          },
          moveTopper: (key, x, y) =>
            patch((d) => ({ toppers: d.toppers.map((t) => (t.key === key ? { ...t, x: clamp(x, 4, 96), y: clamp(y, 4, 96) } : t)) })),
          removeTopper: (key) => {
            patch((d) => ({ toppers: d.toppers.filter((t) => t.key !== key) }));
            set({ selectedTopper: null });
          },
          setName: (name) => patch(() => ({ name: name.slice(0, 40) })),
          resetDesign: () => set({ design: defaultDesign() }),

          setOrder: (p) => set({ order: { ...get().order, ...p } }),
          setTab: (tab) => set({ tab, selectedTopper: null }),
          setActiveFlower: (activeFlower) => set({ activeFlower }),
          selectTopper: (selectedTopper) => set({ selectedTopper }),
        };
      },
      {
        name: "lovin-bouquet",
        version: 1,
        // Saved so a refresh doesn't lose the design or the half-filled form.
        partialize: (s) => ({ design: s.design, order: s.order }),
        skipHydration: true,
      },
    ),
    {
      // Only the design is part of undo/redo — not tabs, selection or the order form.
      partialize: (s) => ({ design: s.design }),
      equality: (a, b) => a.design === b.design,
      limit: 100,
    },
  ),
);

/* ---------- Gestures: a whole paint stroke or drag is one undo step ---------- */

let before: Design | null = null;

export const beginGesture = () => {
  before = useBuilder.getState().design;
  useBuilder.temporal.getState().pause();
};

export const endGesture = () => {
  const start = before;
  before = null;
  const now = useBuilder.getState().design;
  if (start && start !== now) {
    // Put the start state back silently, then re-apply the end state while recording.
    useBuilder.setState({ design: start });
    useBuilder.temporal.getState().resume();
    useBuilder.setState({ design: now });
  } else {
    useBuilder.temporal.getState().resume();
  }
};

/** Throw away an unfinished gesture (e.g. a second finger arrived — it's a pinch, not a stroke). */
export const cancelGesture = () => {
  if (before) useBuilder.setState({ design: before });
  before = null;
  useBuilder.temporal.getState().resume();
};
