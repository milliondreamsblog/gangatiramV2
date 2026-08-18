import { bookACallHref } from "@/content/site";

/**
 * Purple promo bar shown above the navbar on blog + UX-agencies pages
 * (matches the live bricxlabs.com announcement bar). The whole bar links to
 * book-a-call.
 */
export function AnnouncementBar() {
  return (
    <a
      href={bookACallHref}
      className="flex min-h-[38px] w-full items-center justify-center gap-2 bg-brand px-4 py-1.5 text-center text-xs font-medium tracking-[-0.01em] text-white transition-opacity hover:opacity-90"
    >
      <span>
        Looking for a design agency? Bricx has helped 50+ B2B &amp; AI SaaS teams! Book a free call
      </span>
      <span aria-hidden className="shrink-0">
        →
      </span>
    </a>
  );
}
