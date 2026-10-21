import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/collection", "/events", "/about", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  const items = products.map((p) => ({
    url: `${site.url}/collection/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  return [...pages, ...items];
}
