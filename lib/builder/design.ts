import { paperColours, ribbonColours, type ShapeId } from "@/data/builder";
import { shapeSlots } from "./shapes";

export type Topper = { key: string; itemId: string; x: number; y: number };

export type Design = {
  shape: ShapeId;
  /** Flower id per slot (centre outwards), null = empty. */
  slots: (string | null)[];
  paperId: string;
  paperColor: string;
  fillers: Record<string, number>;
  ribbon: { text: string; y: number; color: string };
  toppers: Topper[];
  name: string;
};

/** A pretty starting bouquet: red roses at the heart, blush and ivory around, hydrangea at the rim. */
const defaultSlots = (shape: ShapeId) => {
  const n = shapeSlots(shape).length;
  return Array.from({ length: n }, (_, r) => {
    const t = r / n;
    if (t < 0.15) return "red-rose";
    if (t < 0.45) return r % 3 === 0 ? "white-rose" : "pink-rose";
    if (t < 0.75) return r % 2 ? "peach-rose" : "white-rose";
    return r % 4 === 0 ? "hydrangea" : "pink-rose";
  });
};

export const defaultDesign = (): Design => ({
  shape: "dome",
  slots: defaultSlots("dome"),
  paperId: "matte",
  paperColor: paperColours[1].hex,
  fillers: { eucalyptus: 6, "babys-breath": 8 },
  ribbon: { text: "With love", y: 0.62, color: ribbonColours[0].hex },
  toppers: [],
  name: "",
});

