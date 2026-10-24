"use client";

import { useEffect, useState } from "react";

const cache = new Map<string, string>();
const loading = new Map<string, Promise<HTMLImageElement>>();

const load = (src: string) => {
  if (!loading.has(src)) {
    loading.set(
      src,
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      }),
    );
  }
  return loading.get(src)!;
};

/**
 * Colours a light wrapping-paper image: multiplies the colour onto it and keeps
 * the original transparency. Works the same for the SVG placeholders and real PNGs,
 * and the result is a plain image, so it exports cleanly.
 */
export async function tintImage(src: string, hex: string, size = 900): Promise<string> {
  const key = `${src}|${hex}|${size}`;
  if (cache.has(key)) return cache.get(key)!;
  const img = await load(src);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = Math.round((size * (img.naturalHeight || 1)) / (img.naturalWidth || 1));
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const url = canvas.toDataURL("image/png");
  cache.set(key, url);
  return url;
}

/** React hook: the tinted image URL (falls back to the plain image while it's being made). */
export function useTintedImage(src: string, hex: string) {
  const plain = hex.toLowerCase() === "#ffffff";
  const [url, setUrl] = useState(src);

  useEffect(() => {
    if (plain) {
      setUrl(src);
      return;
    }
    let live = true;
    tintImage(src, hex).then((u) => live && setUrl(u)).catch(() => live && setUrl(src));
    return () => {
      live = false;
    };
  }, [src, hex, plain]);

  return url;
}
