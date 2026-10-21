/* Drawn for this site — thin strokes to sit with the serif headings. */
type P = { className?: string };

export function ArrowIcon({ className }: P) {
  return (
    <svg viewBox="0 0 28 12" fill="none" className={className} aria-hidden="true">
      <path d="M0 6h26M21 1l5 5-5 5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4.2 19.8l1.1-3.9A8.4 8.4 0 1 1 8.4 19l-4.2.8z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M9.1 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.2.3 0 .5.3.6.8 1.2 1.3 1.6.6.5 1.1.8 1.7 1 .2.1.4 0 .5-.1l.6-.7c.2-.2.3-.2.6-.1l1.5.7c.3.1.4.2.4.4 0 .5-.2 1.2-.7 1.5-.6.4-1.4.6-2.6.2-1.4-.5-2.7-1.3-3.7-2.4-.9-1-1.6-2.1-1.8-3.3-.1-.8.1-1.5.4-1.9z"
        fill="currentColor"
      />
    </svg>
  );
}

export function InstagramIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="12" r="3.9" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="17.1" cy="6.9" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function TikTokIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M13.5 3.5v11.3a3.3 3.3 0 1 1-3.3-3.3M13.5 3.5c.4 2.4 2.1 4 4.6 4.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StarIcon({ className }: P) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path d="M10 1.6l2.47 5.3 5.8.68-4.28 3.97 1.13 5.73L10 14.4l-5.12 2.88 1.13-5.73L1.73 7.58l5.8-.68z" fill="currentColor" />
    </svg>
  );
}
