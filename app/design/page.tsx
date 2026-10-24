import type { Metadata } from "next";
import { Builder } from "@/components/builder/Builder";

export const metadata: Metadata = {
  title: "Design Your Own Bouquet",
  description:
    "Design your own bouquet: choose the shape, paint in roses, tulips, lilies and more, pick the paper and ribbon, then send it to Lovin Flowers on WhatsApp. Made by hand in Dubai.",
  alternates: { canonical: "/design" },
};

export default function DesignPage() {
  return <Builder />;
}
