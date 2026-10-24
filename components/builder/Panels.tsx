"use client";

import { useEffect, useRef, useState } from "react";
import { copy } from "@/content/en";
import {
  fillers,
  flowers,
  MAX_FILLER,
  MAX_RIBBON,
  paperColours,
  papers,
  ribbonColours,
  shapes,
  toppers,
} from "@/data/builder";
import { beginGesture, endGesture, useBuilder, type Tab } from "@/lib/builder/store";

const t = copy.design;

const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) =>
  htmlFor ? (
    <label htmlFor={htmlFor} className="label mb-4 block text-ink-soft">
      {children}
    </label>
  ) : (
    <p className="label mb-4 text-ink-soft">{children}</p>
  );

const Group = ({ children }: { children: React.ReactNode }) => <div className="border-t border-line py-7 first:border-t-0 first:pt-2">{children}</div>;

/** Big friendly choice tile used for flowers, papers and toppers. */
function Tile({ active, onClick, img, label, swatch, className = "" }: { active?: boolean; onClick: () => void; img?: string; label: string; swatch?: string; className?: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`group relative flex flex-col items-center gap-2 border p-2 pb-3 text-center transition-colors duration-300 ${
        active ? "border-ink bg-shell" : "border-line hover:border-ink/50"
      } ${className}`}
    >
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} alt="" draggable={false} className="aspect-square w-full object-contain transition-transform duration-500 ease-silk group-hover:scale-105" />
      ) : (
        <span className="flex aspect-square w-full items-center justify-center">
          <svg viewBox="0 0 40 40" className="h-1/2 w-1/2 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
            <path d="M10 28l14-14 6 6-14 14H10v-6zM20 18l6 6" />
          </svg>
        </span>
      )}
      <span className="flex items-center gap-1.5 text-[0.8rem] leading-tight">
        {swatch && <span className="h-2 w-2 shrink-0 rounded-full border border-ink/20" style={{ background: swatch }} aria-hidden="true" />}
        {label}
      </span>
      {active && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-wing" aria-hidden="true" />}
    </button>
  );
}

function Stepper({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const btn = "flex h-11 w-11 items-center justify-center border border-line transition-colors duration-300 hover:border-ink disabled:opacity-30";
  return (
    <div className="flex items-center gap-3" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 0} aria-label={`Less ${label}`}>
        −
      </button>
      <span className="w-6 text-center tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= MAX_FILLER} aria-label={`More ${label}`}>
        +
      </button>
    </div>
  );
}

/** Colour picker that previews live but records one undo step per pick. */
function ColourInput({ value, onCommit }: { value: string; onCommit: (hex: string) => void }) {
  const [local, setLocal] = useState(value);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => setLocal(value), [value]);
  return (
    <label className="relative flex h-11 w-11 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-line" title={t.yourColour}>
      <span className="absolute inset-0" style={{ background: "conic-gradient(#e7a3a0,#e9d4a7,#b9c8ad,#a8c0dd,#d9b8cf,#e7a3a0)" }} />
      <span className="relative h-5 w-5 rounded-full border-2 border-linen" style={{ background: local }} />
      <input
        type="color"
        value={local}
        aria-label={t.yourColour}
        className="absolute inset-0 cursor-pointer opacity-0"
        onChange={(e) => {
          const hex = e.target.value;
          setLocal(hex);
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => onCommit(hex), 250);
        }}
      />
    </label>
  );
}

export function Panels({ activeFlower }: { activeFlower: string | null }) {
  const design = useBuilder((s) => s.design);
  const tab = useBuilder((s) => s.tab);
  const selectedTopper = useBuilder((s) => s.selectedTopper);
  const a = useBuilder.getState();

  const tabs: { id: Tab; label: string }[] = [
    { id: "flowers", label: t.tabs.flowers },
    { id: "wrapping", label: t.tabs.wrapping },
    { id: "finishing", label: t.tabs.finishing },
  ];

  return (
    <div>
      <div role="tablist" aria-label="Builder" className="flex border-b border-line">
        {tabs.map((x) => (
          <button
            key={x.id}
            role="tab"
            type="button"
            aria-selected={tab === x.id}
            onClick={() => a.setTab(x.id)}
            className={`label relative min-h-[52px] flex-1 transition-colors duration-300 ${tab === x.id ? "text-ink" : "text-ink-soft hover:text-ink"}`}
          >
            {x.label}
            <span className={`absolute inset-x-0 -bottom-px h-px bg-ink transition-transform duration-500 ease-silk ${tab === x.id ? "scale-x-100" : "scale-x-0"}`} />
          </button>
        ))}
      </div>

      <div className="pt-6" role="tabpanel">
        {tab === "flowers" && (
          <>
            <Group>
              <Label>{t.shape}</Label>
              <div className="grid grid-cols-3 gap-2">
                {shapes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={design.shape === s.id}
                    onClick={() => a.setShape(s.id)}
                    className={`label flex min-h-[48px] items-center justify-center gap-2 border transition-colors duration-300 ${
                      design.shape === s.id ? "border-ink bg-ink text-linen" : "border-line hover:border-ink"
                    }`}
                  >
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
                      {s.id === "dome" && <circle cx="10" cy="10" r="7" />}
                      {s.id === "heart" && <path d="M10 16s-6-3.6-6-8a3.2 3.2 0 016-1.6A3.2 3.2 0 0116 8c0 4.4-6 8-6 8z" />}
                      {s.id === "classic" && <path d="M4 9c1-4 11-5 12 0 1 5-4 8-6 8S3 13 4 9z" />}
                    </svg>
                    {s.name}
                  </button>
                ))}
              </div>
            </Group>
            <Group>
              <div className="mb-4 flex items-end justify-between gap-4">
                <p className="label text-ink-soft">{t.flowers}</p>
                <div className="flex gap-4">
                  <button type="button" className="label link-draw pb-1" onClick={() => a.fillAll(activeFlower)}>
                    {t.fillAll}
                  </button>
                  <button type="button" className="label link-draw pb-1" onClick={() => a.clearFlowers()}>
                    {t.clear}
                  </button>
                </div>
              </div>
              <p className="mb-5 text-sm text-ink-soft">{t.paintHint}</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {flowers.map((f) => (
                  <Tile key={f.id} active={activeFlower === f.id} onClick={() => a.setActiveFlower(f.id)} img={f.images[0]} label={f.name} swatch={f.swatch} />
                ))}
                <Tile active={activeFlower === null} onClick={() => a.setActiveFlower(null)} label={t.eraser} />
              </div>
            </Group>
          </>
        )}

        {tab === "wrapping" && (
          <>
            <Group>
              <Label>{t.paper}</Label>
              <div className="grid grid-cols-4 gap-2">
                {papers.map((p) => (
                  <Tile key={p.id} active={design.paperId === p.id} onClick={() => a.setPaper(p.id)} img={p.images[0]} label={p.name} className="bg-shell/40" />
                ))}
              </div>
            </Group>
            <Group>
              <Label>{t.colour}</Label>
              <div className="flex flex-wrap items-center gap-3">
                {paperColours.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    title={c.name}
                    aria-label={c.name}
                    aria-pressed={design.paperColor.toLowerCase() === c.hex.toLowerCase()}
                    onClick={() => a.setPaperColor(c.hex)}
                    className={`h-11 w-11 rounded-full border transition-transform duration-300 hover:scale-105 ${
                      design.paperColor.toLowerCase() === c.hex.toLowerCase() ? "border-ink ring-1 ring-ink ring-offset-2 ring-offset-linen" : "border-ink/20"
                    }`}
                    style={{ background: c.hex }}
                  />
                ))}
                <ColourInput value={design.paperColor} onCommit={(hex) => a.setPaperColor(hex)} />
                <span className="label text-ink-soft">{t.yourColour}</span>
              </div>
            </Group>
          </>
        )}

        {tab === "finishing" && (
          <>
            <Group>
              <Label htmlFor="ribbon-text">{t.ribbonText}</Label>
              <div className="relative">
                <input
                  id="ribbon-text"
                  type="text"
                  maxLength={MAX_RIBBON}
                  value={design.ribbon.text}
                  placeholder={t.ribbonPlaceholder}
                  onFocus={beginGesture}
                  onBlur={endGesture}
                  onChange={(e) => a.setRibbon({ text: e.target.value })}
                  className="w-full border-b border-ink/30 bg-transparent py-3 pe-14 font-serif text-2xl italic outline-none transition-colors focus:border-ink"
                />
                <span className="label absolute bottom-3 end-0 text-ink-soft tabular-nums">
                  {design.ribbon.text.length}/{MAX_RIBBON}
                </span>
              </div>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="ribbon-y">{t.ribbonPosition}</Label>
                  <input
                    id="ribbon-y"
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={design.ribbon.y}
                    onPointerDown={beginGesture}
                    onPointerUp={endGesture}
                    onKeyDown={beginGesture}
                    onKeyUp={endGesture}
                    onChange={(e) => a.setRibbon({ y: Number(e.target.value) })}
                    className="w-full accent-wing"
                  />
                </div>
                <div>
                  <Label>{t.ribbonColour}</Label>
                  <div className="flex gap-3">
                    {ribbonColours.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        title={c.name}
                        aria-label={c.name}
                        aria-pressed={design.ribbon.color === c.hex}
                        onClick={() => a.setRibbon({ color: c.hex })}
                        className={`h-9 w-9 rounded-full border ${design.ribbon.color === c.hex ? "border-ink ring-1 ring-ink ring-offset-2 ring-offset-linen" : "border-ink/20"}`}
                        style={{ background: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Group>

            <Group>
              <Label>{t.fillers}</Label>
              <ul className="space-y-3">
                {fillers.map((f) => (
                  <li key={f.id} className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.images[0]} alt="" className="h-12 w-12 object-contain" />
                      {f.name}
                    </span>
                    <Stepper value={design.fillers[f.id] ?? 0} onChange={(v) => a.setFiller(f.id, v)} label={f.name} />
                  </li>
                ))}
              </ul>
            </Group>

            <Group>
              <Label>{t.toppers}</Label>
              <div className="grid grid-cols-3 gap-2">
                {toppers.map((tp) => (
                  <Tile key={tp.id} onClick={() => a.addTopper(tp.id)} img={tp.images[0]} label={`${t.add} ${tp.name.toLowerCase()}`} />
                ))}
              </div>
              {design.toppers.length > 0 && <p className="mt-4 text-sm text-ink-soft">{t.toppersHint}</p>}
              {selectedTopper && (
                <button type="button" className="label link-draw mt-3 pb-1 text-wing" onClick={() => a.removeTopper(selectedTopper)}>
                  {t.removeSelected}
                </button>
              )}
            </Group>

            <Group>
              <Label htmlFor="bouquet-name">{t.name}</Label>
              <input
                id="bouquet-name"
                type="text"
                maxLength={40}
                value={design.name}
                placeholder={t.namePlaceholder}
                onFocus={beginGesture}
                onBlur={endGesture}
                onChange={(e) => a.setName(e.target.value)}
                className="w-full border-b border-ink/30 bg-transparent py-3 font-serif text-2xl outline-none transition-colors focus:border-ink"
              />
            </Group>
          </>
        )}

        <div className="border-t border-line py-6">
          <button
            type="button"
            className="label link-draw pb-1 text-ink-soft"
            onClick={() => window.confirm(t.startAgainConfirm) && a.resetDesign()}
          >
            {t.startAgain}
          </button>
        </div>
      </div>
    </div>
  );
}
