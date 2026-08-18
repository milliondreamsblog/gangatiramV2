import type Lenis from "lenis";

/**
 * Holds the app's single Lenis smooth-scroll instance so non-provider code
 * (e.g. the full-screen MegaMenu) can pause/resume page scrolling. `SmoothScroll`
 * registers the instance on mount and clears it on unmount.
 */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;
