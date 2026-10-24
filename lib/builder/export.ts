import { CANVAS_W } from "./shapes";

/** Options for html-to-image: ~1200px wide, linen background, editor-only marks left out. */
export const exportOptions = (node: HTMLElement) => ({
  pixelRatio: Math.min(3, (CANVAS_W * 1.2) / node.offsetWidth),
  backgroundColor: "#F7F2EC",
  filter: (n: HTMLElement) => !(n.dataset && "exportHide" in n.dataset),
});
