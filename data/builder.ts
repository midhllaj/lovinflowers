/**
 * Everything the "Design your bouquet" builder offers lives here.
 *
 * To add or replace an item:
 *   1. Drop the image(s) into the matching folder in /public/builder/
 *      (flowers/, wrapping/, fillers/, toppers/). Transparent PNG or SVG,
 *      photographed from directly above. Several images of the same item
 *      (e.g. red-rose-1.png, red-rose-2.png) are picked at random per slot
 *      so the bouquet never looks copy-pasted.
 *   2. Add or edit an entry below. `id` must be unique and never change once
 *      customers have saved designs with it.
 */

export type BuilderCategory = "flower" | "paper" | "filler" | "topper";

export type BuilderItem = {
  id: string;
  name: string;
  category: BuilderCategory;
  images: string[];
  /** Small colour dot shown next to the name in the picker. */
  swatch?: string;
  /** Relative size in the bouquet (1 = a standard rose head). */
  scale?: number;
};

const img = (folder: string, ...files: string[]) => files.map((f) => `/builder/${folder}/${f}`);

export const flowers: BuilderItem[] = [
  { id: "red-rose", name: "Red rose", category: "flower", swatch: "#B5122C", images: img("flowers", "red-rose-1.svg", "red-rose-2.svg") },
  { id: "pink-rose", name: "Pink rose", category: "flower", swatch: "#EE86A4", images: img("flowers", "pink-rose-1.svg", "pink-rose-2.svg") },
  { id: "white-rose", name: "White rose", category: "flower", swatch: "#F3EDE3", images: img("flowers", "white-rose-1.svg", "white-rose-2.svg") },
  { id: "peach-rose", name: "Peach rose", category: "flower", swatch: "#F4AE88", images: img("flowers", "peach-rose-1.svg", "peach-rose-2.svg") },
  { id: "sunflower", name: "Sunflower", category: "flower", swatch: "#F4B71B", scale: 1.12, images: img("flowers", "sunflower-1.svg", "sunflower-2.svg") },
  { id: "tulip", name: "Tulip", category: "flower", swatch: "#E8789A", scale: 0.95, images: img("flowers", "tulip-1.svg", "tulip-2.svg") },
  { id: "lily", name: "Lily", category: "flower", swatch: "#F6D4DE", scale: 1.15, images: img("flowers", "lily-1.svg", "lily-2.svg") },
  { id: "hydrangea", name: "Hydrangea", category: "flower", swatch: "#86A6DA", scale: 1.2, images: img("flowers", "hydrangea-1.svg", "hydrangea-2.svg") },
  { id: "carnation", name: "Carnation", category: "flower", swatch: "#DB5C85", scale: 0.92, images: img("flowers", "carnation-1.svg", "carnation-2.svg") },
  { id: "chrysanthemum", name: "Chrysanthemum", category: "flower", swatch: "#F1ECE0", images: img("flowers", "chrysanthemum-1.svg", "chrysanthemum-2.svg") },
];

/** Wrapping papers are drawn in light grey so any colour can be tinted onto them. */
export const papers: BuilderItem[] = [
  { id: "matte", name: "Matte", category: "paper", images: img("wrapping", "matte.svg") },
  { id: "tissue", name: "Tissue", category: "paper", images: img("wrapping", "tissue.svg") },
  { id: "pearl", name: "Pearl", category: "paper", images: img("wrapping", "pearl.svg") },
  { id: "kraft", name: "Kraft", category: "paper", images: img("wrapping", "kraft.svg") },
];

export const fillers: BuilderItem[] = [
  { id: "eucalyptus", name: "Eucalyptus", category: "filler", swatch: "#9DB0A0", images: img("fillers", "eucalyptus-1.svg", "eucalyptus-2.svg") },
  { id: "babys-breath", name: "Baby's breath", category: "filler", swatch: "#FFFFFF", images: img("fillers", "babys-breath-1.svg", "babys-breath-2.svg") },
];

export const toppers: BuilderItem[] = [
  { id: "teddy-bear", name: "Teddy bear", category: "topper", images: img("toppers", "teddy-bear.svg") },
  { id: "bunny", name: "Plush bunny", category: "topper", images: img("toppers", "bunny.svg") },
  { id: "butterfly", name: "Butterfly", category: "topper", images: img("toppers", "butterfly.png") },
];

export const paperColours = [
  { name: "Ivory", hex: "#FFFFFF" },
  { name: "Blush", hex: "#F3CBC5" },
  { name: "Wine", hex: "#7E2632" },
  { name: "Black", hex: "#2E2A2B" },
  { name: "Kraft", hex: "#C9A27E" },
  { name: "Sage", hex: "#B7C3AC" },
  { name: "Sky", hex: "#BCD0E6" },
];

export const ribbonColours = [
  { name: "Ivory", hex: "#F7F2EC", text: "#7E2632" },
  { name: "Wine", hex: "#7E2632", text: "#F7F2EC" },
  { name: "Black", hex: "#231F20", text: "#E9D3A6" },
  { name: "Blush", hex: "#EBB8B6", text: "#5A1A22" },
];

export const shapes = [
  { id: "classic", name: "Classic" },
  { id: "dome", name: "Dome" },
  { id: "heart", name: "Heart" },
] as const;

export type ShapeId = (typeof shapes)[number]["id"];

export const MAX_FILLER = 12;
export const MAX_RIBBON = 24;

export const flowerById = (id: string) => flowers.find((f) => f.id === id);
export const paperById = (id: string) => papers.find((p) => p.id === id) ?? papers[0];
export const fillerById = (id: string) => fillers.find((f) => f.id === id);
export const topperById = (id: string) => toppers.find((t) => t.id === id);
