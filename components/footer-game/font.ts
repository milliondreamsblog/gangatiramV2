import { Pixelify_Sans } from "next/font/google";

/** Shared pixel face for the footer game: the "Click to Play" chip and the
 *  in-game HUD (score, best, hints) all use it. */
export const pixelify = Pixelify_Sans({ subsets: ["latin"], weight: "400" });
