import { SplitHeading, FadeUp } from "./motion/Reveal";

/** Opening block shared by inner pages: label, large split heading, short intro. */
export function PageIntro({ label, title, intro, aside }: { label: string; title: string; intro?: string; aside?: React.ReactNode }) {
  return (
    <header className="frame pb-16 pt-36 sm:pt-44 lg:pb-24 lg:pt-52">
      <div className="grid grid-cols-12 gap-x-4 gap-y-10">
        <div className="col-span-12 lg:col-span-8">
          <FadeUp immediate as="p" className="label flex items-center gap-4 text-wing">
            <span className="block h-px w-10 bg-wing/50" aria-hidden="true" />
            {label}
          </FadeUp>
          <SplitHeading as="h1" text={title} immediate delay={0.15} className="mt-8 text-display-lg" />
        </div>
        {(intro || aside) && (
          <div className="col-span-12 sm:col-span-8 lg:col-span-4 lg:self-end">
            {intro && (
              <FadeUp immediate as="p" delay={0.4} className="max-w-sm text-ink-soft">
                {intro}
              </FadeUp>
            )}
            {aside}
          </div>
        )}
      </div>
    </header>
  );
}
