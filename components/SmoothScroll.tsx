"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/lenis";

/**
 * Global smooth ("lazy") scrolling via Lenis. Eased inertia scroll for the
 * whole page; native horizontal scroll (e.g. the testimonials carousel) is
 * left untouched. Works alongside `position: sticky` pins (e.g. the Team
 * section) since Lenis drives the real scroll position.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    setLenis(lenis);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
