"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { X } from "lucide-react";
import { BricxLogo } from "@/components/BricxLogo";
import { navMenus, bookACallHref, socials } from "@/content/site";
import { getLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";
import { hoverFeedback } from "@/lib/feedback";

/** Exit fade length; the parent unmount is deferred by this much. */
const EXIT_MS = 320;

/** Shared soft entrance for bars and rows (paired with an inline animationDelay). */
const ENTER = "mm-anim animate-[mm-row-in_760ms_cubic-bezier(0.22,1,0.36,1)_both]";

/**
 * MegaMenu — Figma node 1158:1481. A full-screen, blurred nav takeover: category
 * pills + logomark + CTA along the top, the active category's items as big
 * centered rows, and an SF clock · Close · socials bar along the bottom. Opened
 * from the Navbar by clicking Services / Industries / Resources; the top pills
 * switch the active category in place.
 *
 * Rendered through a portal on `document.body` so `fixed inset-0` fills the whole
 * viewport. The backdrop fades in/out; bars and rows each rise in with a soft
 * stagger. The row list is keyed by the active category, so switching categories
 * replays that stagger (a smooth swap rather than an instant cut). While open it
 * freezes the background by pausing Lenis (which ignores `overflow: hidden`).
 */
export function MegaMenu({
  activeLabel,
  onClose,
  onSelect,
}: {
  activeLabel: string;
  onClose: () => void;
  onSelect: (label: string) => void;
}) {
  const [shown, setShown] = useState(false); // backdrop visibility (enter/exit)
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  // Fade the backdrop out, then let the parent unmount us.
  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    setShown(false);
    timerRef.current = window.setTimeout(onClose, EXIT_MS);
  }, [onClose]);

  const requestCloseRef = useRef(requestClose);
  useEffect(() => {
    requestCloseRef.current = requestClose;
  }, [requestClose]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && requestCloseRef.current();
    document.addEventListener("keydown", onKey);

    // Freeze the background: pause Lenis (it drives scroll via rAF and ignores
    // overflow:hidden), hide native overflow, and block wheel/touch anywhere
    // except the menu's own scroll region so the page underneath can't move.
    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const blockScroll = (e: Event) => {
      const target = e.target as Node | null;
      const region = document.querySelector("[data-lenis-prevent]");
      if (region && target && region.contains(target)) return; // allow list scroll
      e.preventDefault();
    };
    window.addEventListener("wheel", blockScroll, { passive: false, capture: true });
    window.addEventListener("touchmove", blockScroll, { passive: false, capture: true });

    return () => {
      cancelAnimationFrame(raf);
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", blockScroll, { capture: true });
      window.removeEventListener("touchmove", blockScroll, { capture: true });
      lenis?.start();
      document.documentElement.style.overflow = prevOverflow;
    };
  }, []);

  // Logo goes home from every page; on the homepage itself it scrolls to top.
  const homeHref = usePathname() === "/" ? "#top" : "/";
  const items = navMenus.find((m) => m.label === activeLabel)?.items ?? [];
  const socialLinks = socials.slice(0, 2);

  // Close when the click lands outside the interactive options — i.e. on the
  // backdrop or any empty space, but not on a menu link/button (those handle
  // their own click).
  const onBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    requestClose();
  };

  const menu = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${activeLabel} menu`}
      onClick={onBackdropClick}
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center gap-6 bg-black/65 px-5 pb-6 pt-4 text-white backdrop-blur-2xl transition-opacity ease-out md:px-10",
        closing ? "duration-300" : "duration-[250ms]",
        shown ? "opacity-100" : "opacity-0",
      )}
    >
      {/* Top bar */}
      <div
        style={{ animationDelay: "40ms" }}
        className={cn(ENTER, "relative flex w-full max-w-[1800px] items-center justify-between")}
      >
        <div className="flex items-center gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navMenus.map((m) =>
            m.items ? (
              <button
                key={m.label}
                type="button"
                onClick={() => onSelect(m.label)}
                onMouseEnter={() => hoverFeedback("service")}
                aria-pressed={activeLabel === m.label}
                className={cn(
                  "flex min-h-11 items-center rounded-full px-3 text-sm font-medium tracking-[-0.01em] transition-colors md:min-h-[30px]",
                  activeLabel === m.label
                    ? "bg-white/[0.12] text-white"
                    : "text-white/90 hover:bg-white/[0.08]",
                )}
              >
                {m.label}
              </button>
            ) : (
              <a
                key={m.label}
                href={m.href}
                onClick={requestClose}
                className="flex min-h-11 items-center rounded-full px-3 text-sm font-medium tracking-[-0.01em] text-white/90 transition-colors hover:bg-white/[0.08] md:min-h-[30px]"
              >
                {m.label}
              </a>
            ),
          )}
        </div>

        <Link
          href={homeHref}
          aria-label="Ganga Tiram home"
          onClick={requestClose}
          className="absolute left-1/2 hidden -translate-x-1/2 md:block"
        >
          <BricxLogo className="text-white" />
        </Link>

        <div className="hidden items-center gap-0.5 md:flex">
          <a
            href="https://chat.whatsapp.com/DEAiLhWV0Yh3pHhUe8XqwS"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us"
            className="grid size-8 place-items-center rounded-full bg-white/[0.06] transition-colors hover:bg-white/[0.14]"
          >
            <Image src="/nav/chat.svg" alt="" width={16} height={16} />
          </a>
          <a
            href={bookACallHref}
            onMouseEnter={() => hoverFeedback("cta")}
            className="flex h-8 items-center rounded-full bg-white px-3 text-sm font-medium tracking-[-0.01em] text-cta-ink transition-transform hover:scale-[1.02]"
          >
            Dev Deepawali
          </a>
        </div>
      </div>

      {/* Item rows — centred when they fit, scrollable when they don't.
          Keyed by activeLabel so the stagger replays on every category switch.
          data-lenis-prevent lets this region scroll natively while Lenis is paused. */}
      <div
        data-lenis-prevent
        className="flex w-full flex-1 flex-col overflow-y-auto"
      >
        <div key={activeLabel} className="mx-auto my-auto w-full max-w-[1800px] py-2">
          {items.map((it, i) => (
            <div
              key={it.label}
              style={{ animationDelay: `${90 + i * 55}ms` }}
              className={cn(ENTER, "border-b border-white/[0.08]", i === 0 && "border-t")}
            >
              <a
                href={it.href}
                onClick={requestClose}
                onMouseEnter={() => hoverFeedback("project")}
                className="group flex h-[68px] w-full items-center justify-center transition-colors hover:bg-white/[0.03] md:h-[92px]"
              >
                <span className="text-2xl leading-[1.08] tracking-[-0.04em] text-white/85 transition-colors group-hover:text-white md:text-[28px]">
                  {it.label}
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{ animationDelay: "110ms" }}
        className={cn(ENTER, "flex w-full max-w-[1800px] items-center justify-center md:justify-between")}
      >
        <div className="hidden items-center gap-6 text-xs uppercase tracking-[-0.02em] text-white/80 md:flex">
          <span>San Francisco</span>
          <SfClock />
        </div>

        <button
          type="button"
          onClick={requestClose}
          className="flex min-h-11 items-center gap-1.5 rounded-full bg-black/25 pl-3 pr-3.5 text-sm font-medium tracking-[-0.01em] text-white transition-colors hover:bg-black/40 md:min-h-[30px] md:pl-2 md:pr-2.5"
        >
          <X size={14} />
          Close
        </button>

        <div className="hidden w-[184px] items-center justify-end gap-6 md:flex">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium tracking-[-0.01em] text-white/80 transition-colors hover:text-white"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(menu, document.body);
}

/** Live San Francisco time as `[ HH:MM:SS ]`; empty on the server to avoid a
 *  hydration mismatch, then fills in and ticks once mounted. */
function SfClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "America/Los_Angeles",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">[ {time || "--:--:--"} ]</span>;
}
