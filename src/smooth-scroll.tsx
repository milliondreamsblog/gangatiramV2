/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * Lenis turns the wheel's coarse ~100px notches into a continuous glide by
 * easing window.scrollY toward the target every frame. It drives the *real*
 * window scroll, so position: sticky/fixed, IntersectionObserver reveals, and
 * motion's useScroll all keep working — they just receive a smooth signal
 * instead of a stepped one. Touch scrolling stays native (already smooth),
 * and Lenis itself honors prefers-reduced-motion: smoothing turns off and
 * programmatic scrolls become instant.
 */

const LenisContext = createContext<Lenis | null>(null);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      autoRaf: true,
      /* Native <a href="#…"> jumps would fight the rAF loop — route them through Lenis. */
      anchors: true,
      /* Wheel input over a scrollable child (modals) scrolls the child, not the page. */
      allowNestedScroll: true
    });
    setLenis(instance);
    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

type ScrollTarget = number | string;

/**
 * Scroll to an absolute Y position or an element id, through Lenis when it is
 * mounted and via the native APIs otherwise. Both paths honor the CSS
 * scroll-padding/scroll-margin offsets, so they land identically.
 */
export function useSmoothScrollTo() {
  const lenis = useContext(LenisContext);

  return useCallback(
    (target: ScrollTarget, options?: { immediate?: boolean }) => {
      const immediate = options?.immediate ?? false;
      const el = typeof target === 'string' ? document.getElementById(target) : null;
      if (typeof target === 'string' && !el) return;

      if (lenis) {
        lenis.scrollTo(el ?? (target as number), { immediate });
        return;
      }

      const behavior: ScrollBehavior = immediate ? 'instant' : 'smooth';
      if (el) {
        el.scrollIntoView({ behavior });
      } else {
        window.scrollTo({ top: target as number, behavior });
      }
    },
    [lenis]
  );
}

/**
 * Freeze page scroll while a dialog is open. Stopping Lenis swallows wheel
 * input aimed at the page (its lenis-stopped class clips overflow for native
 * input too); the body overflow lock is the fallback for when Lenis is absent.
 * Containers marked data-lenis-prevent keep scrolling natively throughout.
 */
export function useScrollLock(locked: boolean) {
  const lenis = useContext(LenisContext);

  useEffect(() => {
    if (!locked) return;
    lenis?.stop();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
      lenis?.start();
    };
  }, [locked, lenis]);
}
