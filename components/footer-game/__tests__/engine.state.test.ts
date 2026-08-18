import { describe, it, expect } from "vitest";
import {
  createGame,
  serveBall,
  tick,
  START_LIVES,
  BRICK_POINTS,
  type GameState,
} from "@/components/footer-game/engine";
import { buildWordGrid } from "@/components/footer-game/glyphs";

const field = { w: 1000, h: 600 };

function newGame(): GameState {
  return createGame(field, buildWordGrid());
}

describe("createGame", () => {
  it("starts serving with full lives, zero score, ball on paddle", () => {
    const s = newGame();
    expect(s.phase).toBe("serving");
    expect(s.lives).toBe(START_LIVES);
    expect(s.score).toBe(0);
    expect(s.bricks.every((b) => b.alive)).toBe(true);
    expect(s.ball.vy).toBe(0);
  });
});

describe("tick", () => {
  it("does nothing while serving", () => {
    const s = newGame();
    const before = { ...s.ball };
    tick(s, 1);
    expect(s.ball.x).toBe(before.x);
    expect(s.ball.y).toBe(before.y);
  });

  it("scores and removes a brick when the ball hits one", () => {
    const s = newGame();
    serveBall(s);
    // Aim the ball straight up into the nearest brick above it.
    const target = [...s.bricks].sort((a, b) => b.y - a.y)[0];
    s.ball.x = target.x + target.w / 2;
    s.ball.y = target.y + target.h + s.ball.r + 1;
    s.ball.vx = 0;
    s.ball.vy = -Math.max(target.h, s.ball.r) - 1;
    const before = s.score;
    let broke = -1;
    for (let i = 0; i < 5 && broke < 0; i++) broke = tick(s, 1).brokeIndex;
    expect(broke).toBeGreaterThanOrEqual(0);
    expect(s.score).toBe(before + BRICK_POINTS);
  });

  it("loses a life and re-serves when the ball falls past the bottom", () => {
    const s = newGame();
    serveBall(s);
    s.ball.x = 500;
    s.ball.y = field.h + 100;
    s.ball.vy = 5;
    tick(s, 1);
    expect(s.lives).toBe(START_LIVES - 1);
    expect(s.phase).toBe("serving");
  });

  it("goes to lost when the last life is spent", () => {
    const s = newGame();
    s.lives = 1;
    serveBall(s);
    s.ball.y = field.h + 100;
    s.ball.vy = 5;
    tick(s, 1);
    expect(s.lives).toBe(0);
    expect(s.phase).toBe("lost");
  });

  it("wins when the last brick is cleared", () => {
    const s = newGame();
    serveBall(s);
    s.bricks.forEach((b, i) => {
      if (i > 0) b.alive = false;
    });
    const last = s.bricks[0];
    s.ball.x = last.x + last.w / 2;
    s.ball.y = last.y + last.h + s.ball.r + 1;
    s.ball.vx = 0;
    s.ball.vy = -Math.max(last.h, s.ball.r) - 1;
    for (let i = 0; i < 5 && s.phase === "playing"; i++) tick(s, 1);
    expect(s.phase).toBe("won");
  });
});
