"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { BricxLogo } from "@/components/BricxLogo";
import { MegaMenu } from "./MegaMenu";
import { navMenus, bookACallHref } from "@/content/site";
import { cn } from "@/lib/utils";
import { hoverFeedback } from "@/lib/feedback";

/**
 * `overlay` (default) sits absolutely over the dark hero image (light text) and
 * scrolls away with the page. `fixed` is the same treatment but pinned to the
 * viewport for the whole scroll. `solid` is an in-flow bar for light pages (dark
 * text on white); its section anchors point back to the homepage.
 *
 * `fixed` sits at `z-40`, above every section but deliberately *below* the
 * MegaMenu's `z-50` — the takeover renders its own nav row, so a bar above it
 * would show two.
 *
 * Clicking Services / Industries / Resources opens the full-screen MegaMenu
 * takeover; Portfolio is a plain link. On mobile the mega items become
 * accordions in the drawer.
 */
export function Navbar({ variant = "overlay" }: { variant?: "overlay" | "solid" | "fixed" }) {
  const [menu, setMenu] = useState<string | null>(null); // open full-screen mega menu
  const solid = variant === "solid";
  const pinned = variant === "fixed";
  // Logo goes home from every page; on the homepage itself it scrolls to top.
  const homeHref = usePathname() === "/" ? "#top" : "/";
  // Mobile opens the same full-screen mega menu, starting on the first category.
  const firstMega = navMenus.find((m) => m.items)?.label ?? null;

  const pill = cn(
    "flex h-[30px] items-center gap-1 rounded-full px-3 text-sm font-medium tracking-[-0.01em] backdrop-blur-md transition-colors",
    solid
      ? "bg-surface text-black hover:bg-[#efefef]"
      : "bg-black/25 text-white hover:bg-black/40",
  );

  return (
    <header
      className={cn(
        solid
          ? "relative z-30 bg-white"
          : pinned
            ? "fixed inset-x-0 top-0 z-40"
            : "absolute inset-x-0 top-0 z-30",
      )}
    >
      <nav className="mx-auto flex w-full max-w-[1800px] items-center justify-between px-5 py-4 md:px-10">
        {/* Left: nav (desktop) — categories open the full-screen mega menu */}
        <div className="hidden items-center gap-0.5 md:flex">
          {navMenus.map((m) =>
            m.items ? (
              <button
                key={m.label}
                type="button"
                aria-expanded={menu === m.label}
                onClick={() => setMenu((v) => (v === m.label ? null : m.label))}
                className={pill}
              >
                {m.label}
              </button>
            ) : (
              <a key={m.label} href={m.href} className={pill}>
                {m.label}
              </a>
            ),
          )}
        </div>

        {/* Center: logomark */}
        <Link
          href={homeHref}
          aria-label="Ganga Tiram home"
          className={cn(
            "-m-3 flex min-h-11 min-w-11 items-center p-3 md:absolute md:left-1/2 md:m-0 md:min-h-0 md:min-w-0 md:-translate-x-1/2",
            // A pinned bar rides over light bands too (`bg-thrust-grey`,
            // `#fafafa`), where a bare white logomark disappears. Give it the
            // same translucent pill the nav items already use.
            pinned ? "rounded-full bg-black/25 backdrop-blur-md md:px-3 md:py-2" : "md:p-0",
          )}
        >
          <BricxLogo className={solid ? "text-black" : "text-white"} />
        </Link>

        {/* Right: contact + CTA (desktop) */}
        <div className="hidden items-center gap-0.5 md:flex">
          <a
            href="#whatsapp-group-link"
            aria-label="Chat on WhatsApp"
            className={cn(
              "grid size-8 place-items-center rounded-full backdrop-blur-md transition-colors",
              solid ? "bg-surface hover:bg-[#efefef]" : "bg-black/25 hover:bg-black/40",
            )}
          >
            <Image
              src="/hero/whatsapp.svg"
              alt=""
              width={16}
              height={16}
              className={solid ? "[filter:brightness(0)]" : undefined}
            />
          </a>
          <a
            href={bookACallHref}
            onMouseEnter={() => hoverFeedback("cta")}
            className={cn(
              "flex h-8 items-center rounded-full px-3 text-sm font-medium tracking-[-0.01em] backdrop-blur-md transition-transform hover:scale-[1.02]",
              solid ? "bg-black text-white" : "bg-white text-cta-ink",
            )}
          >
            Dev Deepawali
          </a>
        </div>

        {/* Mobile: opens the same full-screen mega menu as desktop */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenu(firstMega)}
          className={cn(
            "grid size-11 place-items-center rounded-full backdrop-blur-md md:hidden",
            solid ? "bg-surface text-black" : "bg-black/25 text-white",
          )}
        >
          <Menu size={18} />
        </button>
      </nav>

      {/* Full-screen mega menu — desktop categories and mobile menu */}
      {menu && (
        <MegaMenu
          activeLabel={menu}
          onClose={() => setMenu(null)}
          onSelect={setMenu}
        />
      )}
    </header>
  );
}
