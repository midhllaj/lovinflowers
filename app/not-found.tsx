import Link from "next/link";
import { copy } from "@/content/en";

export default function NotFound() {
  return (
    <section className="frame flex min-h-[80svh] flex-col justify-center pb-24 pt-40">
      <p className="label text-wing">404</p>
      <h1 className="mt-6 max-w-3xl text-display-lg">{copy.notFound.title}</h1>
      <p className="mt-8 max-w-md text-ink-soft">{copy.notFound.body}</p>
      <Link href="/collection" className="label link-draw mt-10 self-start pb-1">
        {copy.notFound.cta}
      </Link>
    </section>
  );
}
