import { describe, it, expect } from "vitest";
import {
  advance,
  collideWalls,
  collidePaddle,
  collideBricks,
  type Ball,
  type Paddle,
  type Brick,
} from "@/components/footer-game/engine";

const field = { w: 200, h: 100 };

function ball(overrides: Partial<Ball> = {}): Ball {
  return { x: 100, y: 50, vx: 0, vy: 0, r: 5, ...overrides };
}

describe("advance", () => {
  it("integrates position by velocity * dt", () => {
    const b = ball({ vx: 10, vy: -4 });
    advance(b, 2);
    expect(b.x).toBe(120);
    expect(b.y).toBe(42);
  });
});

describe("collideWalls", () => {
  it("reflects off the left wall", () => {
    const b = ball({ x: 2, vx: -6 });
    const r = collideWalls(b, field);
    expect(b.vx).toBe(6);
    expect(b.x).toBe(b.r);
    expect(r.lostBall).toBe(false);
  });

  it("reflects off the top wall", () => {
    const b = ball({ y: 1, vy: -6 });
    collideWalls(b, field);
    expect(b.vy).toBe(6);
  });

  it("reports lostBall past the bottom", () => {
    const b = ball({ y: 130, vy: 6 });
    expect(collideWalls(b, field).lostBall).toBe(true);
  });
});

describe("collidePaddle", () => {
  it("bounces the ball upward on contact", () => {
    const paddle: Paddle = { x: 80, y: 90, w: 40, h: 8 };
    const b = ball({ x: 100, y: 88, vy: 6, vx: 0 });
    expect(collidePaddle(b, paddle)).toBe(true);
    expect(b.vy).toBeLessThan(0);
  });

  it("does not bounce when the ball is elsewhere", () => {
    const paddle: Paddle = { x: 0, y: 90, w: 40, h: 8 };
    const b = ball({ x: 100, y: 88, vy: 6 });
    expect(collidePaddle(b, paddle)).toBe(false);
  });
});

describe("collideBricks", () => {
  it("kills the overlapped brick and reflects vertical velocity", () => {
    const bricks: Brick[] = [
      { x: 90, y: 40, w: 20, h: 10, alive: true, row: 0 },
    ];
    const b = ball({ x: 100, y: 46, vy: -6 });
    const hit = collideBricks(b, bricks);
    expect(hit).toBe(0);
    expect(bricks[0].alive).toBe(false);
    expect(b.vy).toBe(6);
  });

  it("ignores dead bricks and returns -1 when nothing hit", () => {
    const bricks: Brick[] = [
      { x: 0, y: 0, w: 5, h: 5, alive: false, row: 0 },
    ];
    expect(collideBricks(ball(), bricks)).toBe(-1);
  });
});
