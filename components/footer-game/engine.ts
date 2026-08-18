export interface Field {
  w: number;
  h: number;
}

export interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  alive: boolean;
  row: number;
}

// Ratios measured off the game mock (Figma frame 2147260652): the wordmark
// spans the full footer content width, and sits roughly an eighth of the field
// below the top so the HUD row has air beneath it.
const BRICK_GAP_RATIO = 0.1; // fraction of cell size used as gap — tight mosaic look
const FIELD_WIDTH_USE = 1; // bricks span the full field width
const TOP_MARGIN_RATIO = 0.172; // clears the HUD row by ~4 tiles, as the mock does
const MAX_BAND_RATIO = 0.6; // bricks must stay inside the top 60% of the field

export function buildBricks(grid: number[][], field: Field): Brick[] {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  if (rows === 0 || cols === 0) return [];

  // Width sets the cell size, but on a wide-and-short field that block would
  // reach the paddle — scale it down so the band always clears MAX_BAND_RATIO.
  const originY = field.h * TOP_MARGIN_RATIO;
  const maxCellByHeight = (field.h * MAX_BAND_RATIO - originY) / rows;
  const cell = Math.max(1, Math.min((field.w * FIELD_WIDTH_USE) / cols, maxCellByHeight));
  const gap = cell * BRICK_GAP_RATIO;
  const brickW = cell - gap;
  const brickH = cell - gap;

  const gridW = cols * cell;
  const originX = (field.w - gridW) / 2 + gap / 2;

  const bricks: Brick[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] !== 1) continue;
      bricks.push({
        x: originX + x * cell,
        y: originY + y * cell,
        w: brickW,
        h: brickH,
        alive: true,
        row: y,
      });
    }
  }
  return bricks;
}

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

export interface Paddle {
  x: number; // left edge
  y: number;
  w: number;
  h: number;
}

const MAX_STEER = 6; // max horizontal velocity imparted by paddle edge

export function advance(ball: Ball, dt: number): void {
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
}

export function collideWalls(ball: Ball, field: Field): { lostBall: boolean } {
  if (ball.x - ball.r < 0) {
    ball.x = ball.r;
    ball.vx = Math.abs(ball.vx);
  } else if (ball.x + ball.r > field.w) {
    ball.x = field.w - ball.r;
    ball.vx = -Math.abs(ball.vx);
  }
  if (ball.y - ball.r < 0) {
    ball.y = ball.r;
    ball.vy = Math.abs(ball.vy);
  }
  return { lostBall: ball.y - ball.r > field.h };
}

function overlapsRect(
  ball: Ball,
  r: { x: number; y: number; w: number; h: number }
): boolean {
  const nx = Math.max(r.x, Math.min(ball.x, r.x + r.w));
  const ny = Math.max(r.y, Math.min(ball.y, r.y + r.h));
  const dx = ball.x - nx;
  const dy = ball.y - ny;
  return dx * dx + dy * dy <= ball.r * ball.r;
}

export function collidePaddle(ball: Ball, paddle: Paddle): boolean {
  if (ball.vy <= 0) return false;
  if (!overlapsRect(ball, paddle)) return false;
  const speed = Math.hypot(ball.vx, ball.vy);
  const hit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2); // -1..1
  ball.vx = Math.max(-1, Math.min(1, hit)) * MAX_STEER;
  ball.vy = -Math.abs(ball.vy);
  // preserve overall speed after steering
  const newSpeed = Math.hypot(ball.vx, ball.vy) || 1;
  ball.vx *= speed / newSpeed;
  ball.vy *= speed / newSpeed;
  ball.y = paddle.y - ball.r;
  return true;
}

export function collideBricks(ball: Ball, bricks: Brick[]): number {
  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];
    if (!brick.alive) continue;
    if (overlapsRect(ball, brick)) {
      brick.alive = false;
      ball.vy = -ball.vy;
      return i;
    }
  }
  return -1;
}

export type Phase = "serving" | "playing" | "won" | "lost";

export interface GameState {
  field: Field;
  bricks: Brick[];
  ball: Ball;
  paddle: Paddle;
  phase: Phase;
  lives: number;
  score: number;
  speed: number;
}

export const START_LIVES = 3;
export const BRICK_POINTS = 10;

function ballRadius(field: Field): number {
  return Math.max(4, field.w * 0.006);
}

function baseSpeed(field: Field): number {
  return field.h * 0.012;
}

export function createGame(field: Field, grid: number[][]): GameState {
  // 17% matches the mock on desktop, but that is only ~60px on a phone — too
  // fine to catch a ball with a fingertip, so narrow fields get a floor.
  const paddleW = Math.max(field.w * 0.17, Math.min(96, field.w * 0.3));
  const paddleH = Math.max(6, field.h * 0.0125);
  const paddle: Paddle = {
    x: (field.w - paddleW) / 2,
    y: field.h - paddleH * 3,
    w: paddleW,
    h: paddleH,
  };
  const r = ballRadius(field);
  const ball: Ball = {
    x: paddle.x + paddle.w / 2,
    y: paddle.y - r,
    vx: 0,
    vy: 0,
    r,
  };
  return {
    field,
    bricks: buildBricks(grid, field),
    ball,
    paddle,
    phase: "serving",
    lives: START_LIVES,
    score: 0,
    speed: baseSpeed(field),
  };
}

export function resetBallOnPaddle(s: GameState): void {
  s.ball.x = s.paddle.x + s.paddle.w / 2;
  s.ball.y = s.paddle.y - s.ball.r;
  s.ball.vx = 0;
  s.ball.vy = 0;
  s.phase = "serving";
}

export function serveBall(s: GameState): void {
  s.ball.vx = s.speed * 0.4;
  s.ball.vy = -s.speed;
  s.phase = "playing";
}

export function tick(
  s: GameState,
  dt: number
): { brokeIndex: number; hitPaddle: boolean; lostBall: boolean } {
  const result = { brokeIndex: -1, hitPaddle: false, lostBall: false };
  if (s.phase !== "playing") return result;

  advance(s.ball, dt);

  const wall = collideWalls(s.ball, s.field);
  if (wall.lostBall) {
    result.lostBall = true;
    s.lives -= 1;
    if (s.lives <= 0) {
      s.lives = 0;
      s.phase = "lost";
    } else {
      resetBallOnPaddle(s);
    }
    return result;
  }

  result.hitPaddle = collidePaddle(s.ball, s.paddle);

  const broke = collideBricks(s.ball, s.bricks);
  if (broke >= 0) {
    result.brokeIndex = broke;
    s.score += BRICK_POINTS;
    // slight speed-up as the wall clears
    const factor = 1.0004;
    s.ball.vx *= factor;
    s.ball.vy *= factor;
    if (s.bricks.every((b) => !b.alive)) s.phase = "won";
  }

  return result;
}
