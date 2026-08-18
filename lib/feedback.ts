/**
 * Subtle interaction feedback for hoverable elements.
 *
 * - Sound: a short synthesized blip via the Web Audio API (no asset needed).
 *   Each section passes a distinct "voice" so hovering CTAs / logos / projects /
 *   services / avatars / FAQs each sound different.
 * - Haptics: `navigator.vibrate` fires on devices that support it (mobile).
 *   NOTE: macOS trackpad haptics are NOT accessible from the browser.
 */

export type Voice = "cta" | "logo" | "project" | "service" | "avatar" | "faq";

// [startFreq, endFreq, waveform, duration(s), peakGain]
const VOICES: Record<Voice, [number, number, OscillatorType, number, number]> = {
  cta: [540, 720, "sine", 0.11, 0.05],
  logo: [360, 360, "triangle", 0.08, 0.035],
  project: [300, 240, "sine", 0.16, 0.05],
  service: [480, 560, "triangle", 0.1, 0.045],
  avatar: [720, 900, "sine", 0.07, 0.04],
  faq: [420, 340, "square", 0.09, 0.02],
};

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function hoverFeedback(voice: Voice = "cta") {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const [f0, f1, type, dur, peak] = VOICES[voice];

  const audio = getCtx();
  if (audio) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const now = audio.currentTime;
    osc.type = type;
    osc.frequency.setValueAtTime(f0, now);
    osc.frequency.exponentialRampToValueAtTime(f1, now + dur);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain).connect(audio.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  }

  if ("vibrate" in navigator) {
    try {
      navigator.vibrate(8);
    } catch {
      /* ignore */
    }
  }
}
