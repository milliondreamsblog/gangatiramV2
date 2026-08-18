"use client";

type Kind = "paddle" | "brick" | "life" | "win" | "lose";

const TONES: Record<Kind, { freq: number; dur: number; type: OscillatorType }> = {
  paddle: { freq: 220, dur: 0.05, type: "square" },
  brick: { freq: 440, dur: 0.06, type: "square" },
  life: { freq: 140, dur: 0.25, type: "sawtooth" },
  win: { freq: 660, dur: 0.4, type: "triangle" },
  lose: { freq: 110, dur: 0.5, type: "sawtooth" },
};

export interface Sound {
  play(kind: Kind): void;
  resume(): void;
  setMuted(v: boolean): void;
  dispose(): void;
}

export function createSound(): Sound {
  let ctx: AudioContext | null = null;
  let muted = false;

  function ensure(): AudioContext | null {
    if (typeof window === "undefined") return null;
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    if (!ctx) {
      try {
        ctx = new Ctor();
      } catch {
        return null;
      }
    }
    return ctx;
  }

  return {
    resume() {
      const c = ensure();
      if (c && c.state === "suspended") c.resume().catch(() => {});
    },
    setMuted(v: boolean) {
      muted = v;
    },
    play(kind: Kind) {
      if (muted) return;
      const c = ensure();
      if (!c) return;
      try {
        const { freq, dur, type } = TONES[kind];
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.08, c.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
        osc.connect(gain).connect(c.destination);
        osc.start();
        osc.stop(c.currentTime + dur);
      } catch {
        /* ignore */
      }
    },
    dispose() {
      try {
        if (ctx) ctx.close().catch(() => {});
      } catch {
        /* ignore */
      }
      ctx = null;
    },
  };
}
