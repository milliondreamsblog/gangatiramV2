// components/footer-game/BrickBreaker.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  createGame,
  serveBall,
  tick,
  type GameState,
} from "@/components/footer-game/engine";
import { buildWordGrid } from "@/components/footer-game/glyphs";
import { getHighScore, setHighScore, getMuted, setMuted } from "@/components/footer-game/storage";
import { createSound } from "@/components/footer-game/sound";
import { pixelify } from "@/components/footer-game/font";
import { useCanHover } from "@/components/footer-game/useCanHover";
import { PixelHeart, PixelSpeaker, PixelStar, PlayChip } from "@/components/footer-game/PixelIcons";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

// Matches the `bricxlabs` footer watermark token (--fill-0) so the bricks,
// paddle, and shards read as the grey wordmark come alive; the ball is dark
// per the game mock (frame 2147260652) so it stays easy to track.
const BRICK = "#D9D9D9";
const PADDLE = "#9a9a9a";
/** The ball is the design's own 16x16 sprite (Figma node 1543:8328), exported
 *  to public/footer-game/ball.png — a sphere lit from the upper-left that
 *  shades through mid-grey to a black lower-right. */
const BALL_SRC = "/footer-game/ball.png";
const BALL_FALLBACK = "#4d4d4d";

export function BrickBreaker({ onExit }: { onExit: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);
  const soundRef = useRef(createSound());
  const reducedMotion = useRef(false);
  const ballSpriteRef = useRef<HTMLCanvasElement | null>(null);

  const [phase, setPhase] = useState<GameState["phase"]>("serving");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [highScore, setHigh] = useState(() => getHighScore());
  const [muted, setMutedState] = useState(() => getMuted());
  const [shareCopied, setShareCopied] = useState(false);
  const canHover = useCanHover();

  // Share the final score — native share sheet where available; clipboard
  // fallback (with a "Copied!" flash) when share is missing or fails.
  const shareScore = useCallback(async (finalScore: number) => {
    const text = `I scored ${finalScore} smashing bricks on the Ganga Tiram footer game — beat that!`;
    const url = "https://gangatiram.in";
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ text, url });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return; // user closed the sheet
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2000);
    } catch {
      /* clipboard unavailable — nothing sensible left to do */
    }
  }, []);

  const ended = phase === "won" || phase === "lost";

  const build = useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const rect = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const field = { w: rect.width, h: rect.height };
    const prev = stateRef.current;
    const s = createGame(field, buildWordGrid());
    if (prev) {
      s.score = prev.score;
      s.lives = prev.lives;
      s.phase = prev.phase;
      // preserve which bricks were already broken (same count/order across sizes)
      for (let i = 0; i < s.bricks.length && i < prev.bricks.length; i++) {
        s.bricks[i].alive = prev.bricks[i].alive;
      }
      // rescale ball + paddle to the new field so the round continues sensibly
      const sx = prev.field.w ? field.w / prev.field.w : 1;
      const sy = prev.field.h ? field.h / prev.field.h : 1;
      s.ball.x = prev.ball.x * sx;
      s.ball.y = prev.ball.y * sy;
      s.ball.vx = prev.ball.vx * sx;
      s.ball.vy = prev.ball.vy * sy;
      s.paddle.x = Math.max(0, Math.min(field.w - s.paddle.w, prev.paddle.x * sx));
    }
    stateRef.current = s;
    setPhase(s.phase);
    setScore(s.score);
    setLives(s.lives);
  }, []);

  // The sprite ships on a white field (it sits on the white play area in the
  // design). Punch that white out once at load so the ball never stamps a
  // white square over a brick it is overlapping.
  useEffect(() => {
    const img = new window.Image();
    img.src = BALL_SRC;
    img.onload = () => {
      const off = document.createElement("canvas");
      off.width = img.width;
      off.height = img.height;
      const c = off.getContext("2d");
      if (!c) return;
      c.drawImage(img, 0, 0);
      const data = c.getImageData(0, 0, off.width, off.height);
      const px = data.data;
      for (let i = 0; i < px.length; i += 4) {
        if (px[i] >= 225 && px[i + 1] >= 225 && px[i + 2] >= 225) px[i + 3] = 0;
      }
      c.putImageData(data, 0, 0);
      ballSpriteRef.current = off;
    };
  }, []);

  // init + resize
  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    soundRef.current.setMuted(getMuted());
    build();
    const ro = new ResizeObserver(() => build());
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [build]);

  const spawnParticles = useCallback((x: number, y: number, size: number) => {
    if (reducedMotion.current) return;
    const arr = particlesRef.current;
    for (let i = 0; i < 6; i++) {
      arr.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.8) * 4,
        life: 1,
        size: size * (0.2 + Math.random() * 0.3),
      });
    }
  }, []);

  // game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = (ts: number) => {
      const s = stateRef.current;
      if (!s) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      const last = lastTsRef.current || ts;
      const dt = Math.min((ts - last) / 16.67, 2.5); // frames, clamped
      lastTsRef.current = ts;

      if (s.phase === "playing") {
        const r = tick(s, dt);
        if (r.brokeIndex >= 0) {
          const b = s.bricks[r.brokeIndex];
          spawnParticles(b.x + b.w / 2, b.y + b.h / 2, b.w);
          soundRef.current.play("brick");
        }
        if (r.hitPaddle) soundRef.current.play("paddle");
        // `tick` can mutate s.phase (e.g. to "won"/"lost"); re-read via a
        // widened type since TS's narrowing from the outer `if` doesn't
        // account for that in-place mutation through the function call.
        const phaseAfterTick = s.phase as GameState["phase"];
        if (r.lostBall) soundRef.current.play(phaseAfterTick === "lost" ? "lose" : "life");
        if (phaseAfterTick === "won") {
          setHighScore(s.score);
          setHigh(getHighScore());
          soundRef.current.play("win");
        }
        if (phaseAfterTick === "lost") {
          setHighScore(s.score);
          setHigh(getHighScore());
        }
        setPhase(s.phase);
        setScore(s.score);
        setLives(s.lives);
      }

      // particles
      const ps = particlesRef.current;
      for (const p of ps) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 0.15 * dt;
        p.life -= 0.03 * dt;
      }
      particlesRef.current = ps.filter((p) => p.life > 0);

      // draw
      ctx.clearRect(0, 0, s.field.w, s.field.h);
      // bricks — solid watermark grey, uniform like the wordmark
      ctx.fillStyle = BRICK;
      for (const b of s.bricks) {
        if (!b.alive) continue;
        roundRect(ctx, b.x, b.y, b.w, b.h, Math.min(4, b.w * 0.12));
        ctx.fill();
      }
      // paddle is a mid grey (mock #9a9a9a) so it reads against the pale bricks
      ctx.fillStyle = PADDLE;
      roundRect(ctx, s.paddle.x, s.paddle.y, s.paddle.w, s.paddle.h, s.paddle.h / 2);
      ctx.fill();
      drawBall(ctx, ballSpriteRef.current, s.ball.x, s.ball.y, s.ball.r);
      // particles — brick shards keep the grey
      ctx.fillStyle = BRICK;
      for (const p of particlesRef.current) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [spawnParticles]);

  // controls — while serving, enough cursor movement launches the ball, so the
  // "Move your cursor" hint is literally the way to start (click/Space also work).
  const moveAccumRef = useRef(0);
  const lastMoveXRef = useRef<number | null>(null);

  const serve = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    soundRef.current.resume();
    moveAccumRef.current = 0;
    lastMoveXRef.current = null;
    if (s.phase === "serving") {
      serveBall(s);
      setPhase("playing");
    } else if (s.phase === "won" || s.phase === "lost") {
      const fresh = createGame(s.field, buildWordGrid());
      stateRef.current = fresh;
      setPhase("serving");
      setScore(0);
      setLives(fresh.lives);
    }
  }, []);

  const movePaddle = useCallback((clientX: number) => {
    const s = stateRef.current;
    const canvas = canvasRef.current;
    if (!s || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    s.paddle.x = Math.max(0, Math.min(s.field.w - s.paddle.w, x - s.paddle.w / 2));
    if (s.phase === "serving") {
      s.ball.x = s.paddle.x + s.paddle.w / 2;
      const last = lastMoveXRef.current;
      if (last !== null) moveAccumRef.current += Math.abs(clientX - last);
      lastMoveXRef.current = clientX;
      // Scale the launch threshold to the field: a flat 60px is a natural
      // mouse nudge on a 1376px desktop field but a big deliberate swipe on a
      // 350px phone one, which left players unable to start the ball.
      if (moveAccumRef.current > Math.max(24, s.field.w * 0.05)) serve();
    }
  }, [serve]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (!s) return;
      if (e.key === "Escape") {
        onExit();
      } else if (e.key === " ") {
        e.preventDefault();
        serve();
      } else if (e.key === "ArrowLeft") {
        s.paddle.x = Math.max(0, s.paddle.x - s.field.w * 0.04);
        if (s.phase === "serving") s.ball.x = s.paddle.x + s.paddle.w / 2;
      } else if (e.key === "ArrowRight") {
        s.paddle.x = Math.min(s.field.w - s.paddle.w, s.paddle.x + s.field.w * 0.04);
        if (s.phase === "serving") s.ball.x = s.paddle.x + s.paddle.w / 2;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit, serve]);

  const toggleMute = useCallback(() => {
    setMutedState((m) => {
      const next = !m;
      setMuted(next);
      soundRef.current.setMuted(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const snd = soundRef.current;
    return () => snd.dispose();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 z-20 touch-none select-none"
      onPointerMove={(e) => movePaddle(e.clientX)}
      onPointerDown={(e) => {
        // A mouse already hovers the paddle into place before you click, so a
        // click can serve straight away. A finger has no hover: serving on
        // touch-down would fire the ball before the player has taken hold of
        // the paddle, and it drains a life. So the first touch only brings the
        // paddle under the finger — the drag itself launches the ball.
        if (e.pointerType === "touch" && stateRef.current?.phase === "serving") {
          movePaddle(e.clientX);
          return;
        }
        serve();
      }}
      onTouchMove={(e) => {
        if (e.touches[0]) movePaddle(e.touches[0].clientX);
      }}
      role="application"
      aria-label="Brick breaker game"
    >
      <canvas ref={canvasRef} className="h-full w-full" />

      {/* HUD — mock frame 2147260652: hearts + score | "Move your cursor" |
          star + best + sound + close, all on one pixel-font row */}
      <div
        className={`${pixelify.className} absolute inset-x-0 top-0 flex items-center justify-between gap-4 px-4 pb-4 pt-1.5 text-[#222020]`}
      >
        {/* left: lives as hearts + score */}
        <div className="pointer-events-none flex items-center gap-3">
          {/* Hearts are nudged up 2px: the glyph tapers to a point, so a
              box-centered heart optically sits low against the pixel digits. */}
          <span
            className="flex -translate-y-[2px] items-center gap-1.5"
            role="img"
            aria-label={`${lives} of 3 lives`}
          >
            {[0, 1, 2].map((i) => (
              <PixelHeart key={i} lost={i >= lives} />
            ))}
          </span>
          {!ended && (
            <span className="text-xl leading-none" aria-label={`Score ${score}`}>
              {score}
            </span>
          )}
        </div>

        {/* The final score fits the HUD row at every width, since the running
            score is hidden once the round ends. */}
        {ended && (
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-base text-[#666] sm:text-lg">
            Score : {score}
          </div>
        )}

        {/* right: best + sound + close */}
        <div className="flex items-center gap-3">
          <span className="pointer-events-none flex items-center gap-1.5" aria-label={`Best score ${highScore}`}>
            <PixelStar />
            <span className="text-xl leading-none">{highScore}</span>
          </span>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="rounded p-1 opacity-80 transition-opacity hover:opacity-100"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            <PixelSpeaker muted={muted} />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onExit();
            }}
            className="rounded p-1 opacity-80 transition-opacity hover:opacity-100"
            aria-label="Close game"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Start hint. It sits in the HUD row on desktop, but a phone-width row
          has no room beside the hearts and best score, so there it drops into
          the open field below the wordmark. */}
      {phase === "serving" && (
        <div
          className={`${pixelify.className} pointer-events-none absolute left-1/2 top-[52%] flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 whitespace-nowrap text-base text-[#666] sm:top-4 sm:text-lg`}
        >
          <PlayChip />
          <span>{canHover ? "Move your cursor" : "Swipe to play"}</span>
        </div>
      )}

      {/* ending score card — Figma frame 2147260661 */}
      {ended && (
        <EndCard
          title={phase === "won" ? "You won!" : "Game over"}
          score={score}
          shareLabel={shareCopied ? "Copied!" : "Share"}
          onPlayAgain={serve}
          onShare={() => shareScore(score)}
        />
      )}
    </div>
  );
}

/** Floating end-of-round score card (Figma frame 2147260661): faint title, big
 *  pixel score, black "Play Again", bordered "Share". The field stays visible
 *  behind it — no dimming wash. Pointer events stop here so clicks on the card
 *  never reach the wrap's serve-on-pointerdown. */
function EndCard({
  title,
  score,
  shareLabel,
  onPlayAgain,
  onShare,
}: {
  title: string;
  score: number;
  shareLabel: string;
  onPlayAgain: () => void;
  onShare: () => void;
}) {
  return (
    <div
      className={`${pixelify.className} absolute left-1/2 top-1/2 z-10 w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-[10px] border border-black/10 bg-white p-4 text-center shadow-[0_12px_32px_rgba(0,0,0,0.12)]`}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <p className="pt-2 text-base text-[#c7c7c7]">{title}</p>
      <p className="py-3 text-[64px] leading-none text-[#d9d9d9]">{score}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPlayAgain();
        }}
        className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-[6px] bg-black text-base text-white transition-transform hover:scale-[1.02]"
      >
        <svg viewBox="0 0 8 8" width={10} height={10} aria-hidden>
          <path d="M2 1 L7 4 L2 7 Z" fill="#fff" />
        </svg>
        Play Again
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onShare();
        }}
        className="mt-2 flex h-10 w-full items-center justify-center rounded-[6px] border border-black bg-white text-base text-black transition-colors hover:bg-black/5"
      >
        {shareLabel}
      </button>
    </div>
  );
}

/** Blit the ball sprite with nearest-neighbour sampling so its pixels stay
 *  crisp, snapping the destination to whole pixels. Falls back to a plain disc
 *  for the frames before the sprite finishes decoding. */
function drawBall(
  ctx: CanvasRenderingContext2D,
  sprite: HTMLCanvasElement | null,
  cx: number,
  cy: number,
  r: number
) {
  if (!sprite) {
    ctx.fillStyle = BALL_FALLBACK;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  const size = Math.max(8, Math.round(r * 2));
  const prev = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sprite, Math.round(cx - size / 2), Math.round(cy - size / 2), size, size);
  ctx.imageSmoothingEnabled = prev;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
