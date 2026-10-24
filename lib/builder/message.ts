import { fillerById, flowerById, paperById, paperColours, ribbonColours, shapes, topperById } from "@/data/builder";
import { site } from "@/config/site";
import type { Design } from "./design";
import type { Order } from "./store";

const colourName = (hex: string, list: { name: string; hex: string }[]) =>
  list.find((c) => c.hex.toLowerCase() === hex.toLowerCase())?.name ?? `custom ${hex.toUpperCase()}`;

/** Flower counts, most used first. */
export const flowerCounts = (design: Design) => {
  const counts = new Map<string, number>();
  design.slots.forEach((id) => id && counts.set(id, (counts.get(id) ?? 0) + 1));
  return [...counts.entries()]
    .map(([id, count]) => ({ id, name: flowerById(id)?.name ?? id, swatch: flowerById(id)?.swatch, count }))
    .sort((a, b) => b.count - a.count);
};

export const fillerList = (design: Design) =>
  Object.entries(design.fillers)
    .filter(([, n]) => n > 0)
    .map(([id, n]) => ({ id, name: fillerById(id)?.name ?? id, count: n }));

export const topperList = (design: Design) => {
  const counts = new Map<string, number>();
  design.toppers.forEach((t) => counts.set(t.itemId, (counts.get(t.itemId) ?? 0) + 1));
  return [...counts.entries()].map(([id, count]) => ({ id, name: topperById(id)?.name ?? id, count }));
};

export const totalPieces = (design: Design) =>
  design.slots.filter(Boolean).length + Object.values(design.fillers).reduce((a, b) => a + b, 0);

export const shapeName = (design: Design) => shapes.find((s) => s.id === design.shape)?.name ?? design.shape;
export const paperLabel = (design: Design) =>
  `${paperById(design.paperId).name} · ${colourName(design.paperColor, paperColours)}`;
export const ribbonLabel = (design: Design) => colourName(design.ribbon.color, ribbonColours);

/** The full order as a tidy WhatsApp message (WhatsApp *bold* formatting). */
export function orderMessage(design: Design, order: Order) {
  const lines: string[] = [];
  lines.push(`Hello ${site.name}! I designed a bouquet on your website and would like to order it.`, "");
  lines.push(`*${design.name.trim() || "My bouquet"}*`);
  lines.push(`Shape: ${shapeName(design)}`);
  lines.push(`Wrapping: ${paperLabel(design)}`);
  lines.push("", `*Flowers (${design.slots.filter(Boolean).length})*`);
  flowerCounts(design).forEach((f) => lines.push(`• ${f.count} × ${f.name}`));
  const fl = fillerList(design);
  if (fl.length) lines.push("", `*Fillers*`, ...fl.map((f) => `• ${f.count} × ${f.name}`));
  if (design.ribbon.text.trim()) lines.push("", `*Ribbon:* "${design.ribbon.text.trim()}" (${ribbonLabel(design)})`);
  const tp = topperList(design);
  if (tp.length) lines.push(`*Extras:* ${tp.map((t) => (t.count > 1 ? `${t.count} × ${t.name}` : t.name)).join(", ")}`);

  lines.push("", `*Name:* ${order.name.trim()}`);
  if (order.date) {
    const d = new Date(`${order.date}T12:00:00`);
    lines.push(`*Date needed:* ${d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}`);
  }
  lines.push(
    order.method === "pickup"
      ? `*Collection:* Pick up from the studio${site.address ? ` (${site.address.split(",")[0]})` : ""}`
      : `*Delivery to:* ${order.area.trim() || "Dubai"}`,
  );
  if (order.note.trim()) lines.push(`*Note:* ${order.note.trim()}`);
  lines.push("", "Could you confirm the price and availability? I can send the bouquet picture here too.");
  return lines.join("\n");
}
