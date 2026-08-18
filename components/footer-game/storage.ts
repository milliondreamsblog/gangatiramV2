const HIGH_SCORE_KEY = "gangatiram.brickbreaker.highscore";
const MUTED_KEY = "gangatiram.brickbreaker.muted";

function store(): Storage | null {
  try {
    return typeof localStorage !== "undefined" ? localStorage : null;
  } catch {
    return null;
  }
}

export function getHighScore(): number {
  try {
    const raw = store()?.getItem(HIGH_SCORE_KEY);
    const n = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

export function setHighScore(n: number): void {
  try {
    if (Number.isFinite(n) && n > getHighScore()) store()?.setItem(HIGH_SCORE_KEY, String(Math.floor(n)));
  } catch {
    /* no-op */
  }
}

export function getMuted(): boolean {
  try {
    return store()?.getItem(MUTED_KEY) === "1";
  } catch {
    return false;
  }
}

export function setMuted(v: boolean): void {
  try {
    store()?.setItem(MUTED_KEY, v ? "1" : "0");
  } catch {
    /* no-op */
  }
}
