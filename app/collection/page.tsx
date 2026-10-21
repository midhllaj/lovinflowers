import type { Metadata } from "next";
import { Suspense } from "react";
import { copy } from "@/content/en";
import { PageIntro } from "@/components/PageIntro";
import { CollectionGrid } from "@/components/collection/CollectionGrid";

export const metadata: Metadata = {
  title: "Flower Collection — Bouquets, Roses & Baskets",
  description:
    "Hand-made bouquets, grand rose arrangements and flower baskets for love, birthdays, new babies and more. Same-day flower delivery across Dubai.",
  alternates: { canonical: "/collection" },
};

export default function CollectionPage() {
  return (
    <>
      <PageIntro label={copy.collection.label} title={copy.collection.title} intro={copy.collection.intro} />
      <Suspense fallback={<div className="min-h-screen" />}>
        <CollectionGrid />
      </Suspense>
    </>
  );
}
