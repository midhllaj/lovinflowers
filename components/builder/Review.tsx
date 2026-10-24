"use client";

import { useEffect, useState } from "react";
import { toBlob } from "html-to-image";
import { copy } from "@/content/en";
import { site } from "@/config/site";
import { flowerCounts, fillerList, orderMessage, paperLabel, ribbonLabel, shapeName, topperList, totalPieces } from "@/lib/builder/message";
import { useBuilder } from "@/lib/builder/store";
import { openWhatsApp, hasWhatsApp, whatsappLink } from "@/lib/whatsapp";
import { ArrowIcon, WhatsAppIcon } from "../Icons";
import { SplitHeading, FadeUp } from "../motion/Reveal";
import { exportOptions } from "@/lib/builder/export";

const t = copy.design;

const AREAS = [
  "Al Karama", "Bur Dubai", "Deira", "Downtown Dubai", "Business Bay", "DIFC", "Dubai Marina", "JBR", "JLT",
  "Palm Jumeirah", "Jumeirah", "Al Barsha", "Al Quoz", "Dubai Hills", "Arabian Ranches", "Mirdif", "Silicon Oasis", "Motor City",
];

type Props = {
  snapshot: string | null;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onBack: () => void;
  /** An off-screen bouquet used to export a fresh image. */
  stage: React.ReactNode;
};

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex gap-6 border-b border-line py-4">
    <dt className="label w-28 shrink-0 pt-1 text-ink-soft">{label}</dt>
    <dd className="min-w-0 flex-1">{children}</dd>
  </div>
);

const fieldCls =
  "w-full border-b border-ink/30 bg-transparent py-3 text-[1rem] outline-none transition-colors placeholder:text-ink-soft/70 focus:border-ink";

export function Review({ snapshot, canvasRef, onBack, stage }: Props) {
  const design = useBuilder((s) => s.design);
  const order = useBuilder((s) => s.order);
  const setOrder = useBuilder((s) => s.setOrder);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [canShare, setCanShare] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    try {
      const probe = new File([new Blob()], "x.png", { type: "image/png" });
      setCanShare(!!navigator.canShare?.({ files: [probe] }));
    } catch {
      setCanShare(false);
    }
  }, []);

  const today = new Date();
  const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  const send = () => {
    const e: Record<string, boolean> = {};
    if (!order.name.trim()) e.name = true;
    if (!order.date) e.date = true;
    if (order.method === "delivery" && !order.area.trim()) e.area = true;
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`order-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    const message = orderMessage(design, order);
    if (hasWhatsApp()) window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    else openWhatsApp(message);
    setSent(true);
  };

  const fileName = `${(design.name.trim() || "my-lovin-bouquet").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;

  const shareImage = async () => {
    const node = canvasRef.current;
    if (!node) return;
    setBusy(true);
    try {
      const blob = await toBlob(node, exportOptions(node));
      if (!blob) throw new Error("no image");
      const file = new File([blob], fileName, { type: "image/png" });
      if (canShare && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: design.name || t.untitled, text: `${site.name} — ${design.name || t.untitled}` });
      } else {
        const url = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement("a"), { href: url, download: fileName });
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
      }
    } catch {
      // share sheet dismissed — nothing to do
    }
    setBusy(false);
  };

  const flowersList = flowerCounts(design);
  const fl = fillerList(design);
  const tp = topperList(design);

  return (
    <div className="frame pb-section pt-28 sm:pt-32 lg:pt-36">
      {stage}
      <button type="button" onClick={onBack} className="group label inline-flex min-h-[44px] items-center gap-3 text-ink-soft hover:text-ink">
        <ArrowIcon className="w-6 rotate-180 transition-transform duration-500 ease-silk group-hover:-translate-x-1 rtl:rotate-0" />
        {t.back}
      </button>

      <div className="mt-6 grid grid-cols-12 gap-x-6 gap-y-12 lg:gap-x-12">
        {/* Snapshot */}
        <div className="col-span-12 lg:col-span-6">
          <div className="lg:sticky lg:top-28">
            <div className="border border-line bg-linen">
              {snapshot ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={snapshot} alt={`${design.name || t.untitled} — your bouquet design`} className="bloom-pop block w-full" />
              ) : (
                <div className="aspect-[5/6] w-full bg-shell" />
              )}
            </div>
            <button
              type="button"
              onClick={shareImage}
              disabled={busy}
              className="label mt-4 inline-flex min-h-[48px] w-full items-center justify-center gap-3 border border-ink transition-colors duration-500 hover:bg-ink hover:text-linen disabled:opacity-50"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
                {canShare ? <path d="M10 13V3M6 7l4-4 4 4M4 11v6h12v-6" /> : <path d="M10 3v10M6 9l4 4 4-4M4 17h12" />}
              </svg>
              {canShare ? t.share : t.download}
            </button>
          </div>
        </div>

        {/* Details + form */}
        <div className="col-span-12 lg:col-span-6">
          <FadeUp immediate as="p" className="label text-wing">
            {t.reviewLabel}
          </FadeUp>
          <SplitHeading as="h1" text={t.reviewTitle} immediate className="mt-5 text-display-md" />

          <h2 className="mt-10 font-serif text-display-sm italic">{design.name.trim() || t.untitled}</h2>
          <dl className="mt-4 border-t border-line text-[0.95rem]">
            <Row label={t.shapeLabel}>{shapeName(design)}</Row>
            <Row label={t.wrapping}>
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border border-ink/20" style={{ background: design.paperColor }} aria-hidden="true" />
                {paperLabel(design)}
              </span>
            </Row>
            <Row label={`${t.flowers} (${design.slots.filter(Boolean).length})`}>
              <ul className="space-y-1.5">
                {flowersList.map((f) => (
                  <li key={f.id} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full border border-ink/20" style={{ background: f.swatch }} aria-hidden="true" />
                    <span className="tabular-nums">{f.count}</span> × {f.name}
                  </li>
                ))}
              </ul>
            </Row>
            {fl.length > 0 && <Row label={t.fillers}>{fl.map((f) => `${f.count} × ${f.name}`).join(", ")}</Row>}
            {design.ribbon.text.trim() && (
              <Row label={t.ribbonLabel}>
                <span className="font-serif text-lg italic">&ldquo;{design.ribbon.text.trim()}&rdquo;</span>{" "}
                <span className="text-ink-soft">· {ribbonLabel(design)}</span>
              </Row>
            )}
            {tp.length > 0 && <Row label={t.extras}>{tp.map((x) => (x.count > 1 ? `${x.count} × ${x.name}` : x.name)).join(", ")}</Row>}
          </dl>
          <p className="label mt-4 text-ink-soft">{t.pieces(totalPieces(design))}</p>

          <h2 className="mt-14 font-serif text-display-sm">{t.detailsTitle}</h2>
          <form
            className="mt-6 space-y-7"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <div>
              <label htmlFor="order-name" className="label text-ink-soft">
                {t.yourName}
              </label>
              <input id="order-name" autoComplete="name" className={fieldCls} value={order.name} onChange={(e) => setOrder({ name: e.target.value })} aria-invalid={errors.name} />
              {errors.name && <p className="mt-2 text-sm text-wing">{t.required}</p>}
            </div>
            <div>
              <label htmlFor="order-date" className="label text-ink-soft">
                {t.date}
              </label>
              <input id="order-date" type="date" min={minDate} className={fieldCls} value={order.date} onChange={(e) => setOrder({ date: e.target.value })} aria-invalid={errors.date} />
              {errors.date && <p className="mt-2 text-sm text-wing">{t.required}</p>}
            </div>
            <fieldset>
              <legend className="label text-ink-soft">{t.method}</legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(["delivery", "pickup"] as const).map((m) => (
                  <label
                    key={m}
                    className={`label flex min-h-[52px] cursor-pointer items-center justify-center border px-3 text-center transition-colors duration-300 ${
                      order.method === m ? "border-ink bg-ink text-linen" : "border-line hover:border-ink"
                    }`}
                  >
                    <input type="radio" name="method" value={m} checked={order.method === m} onChange={() => setOrder({ method: m })} className="sr-only" />
                    {m === "delivery" ? t.delivery : t.pickup}
                  </label>
                ))}
              </div>
            </fieldset>
            {order.method === "delivery" && (
              <div>
                <label htmlFor="order-area" className="label text-ink-soft">
                  {t.area}
                </label>
                <input
                  id="order-area"
                  list="dubai-areas"
                  className={fieldCls}
                  placeholder={t.areaPlaceholder}
                  value={order.area}
                  onChange={(e) => setOrder({ area: e.target.value })}
                  aria-invalid={errors.area}
                />
                <datalist id="dubai-areas">
                  {AREAS.map((a) => (
                    <option key={a} value={a} />
                  ))}
                </datalist>
                {errors.area && <p className="mt-2 text-sm text-wing">{t.required}</p>}
              </div>
            )}
            <div>
              <label htmlFor="order-note" className="label text-ink-soft">
                {t.note}
              </label>
              <textarea
                id="order-note"
                rows={3}
                className={`${fieldCls} resize-none`}
                placeholder={t.notePlaceholder}
                value={order.note}
                onChange={(e) => setOrder({ note: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="group inline-flex min-h-[56px] w-full items-center justify-center gap-3 bg-ink px-8 text-linen transition-colors duration-500 hover:bg-wing"
            >
              <WhatsAppIcon className="h-5 w-5" />
              <span className="label">{t.send}</span>
            </button>
            <p className="text-sm text-ink-soft">{sent ? t.afterSend : t.noPrices}</p>
          </form>
        </div>
      </div>
    </div>
  );
}
