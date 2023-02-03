import type { PointerEvent } from "react";

export type Point = {
  x: number;
  y: number;
};

export type Rectangle = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export function dist(p1: Point, p2: Point): number {
  return Math.max(Math.abs(p1.x - p2.x), Math.abs(p1.y - p2.y));
}

export function isInside(
  { x1, y1, x2, y2 }: Rectangle,
  { x, y }: Point
): boolean {
  return x1 <= x && x <= x2 && y1 <= y && y <= y2;
}

export function getRectangle(p1: Point, p2: Point): Rectangle {
  const x1 = Math.min(p1.x, p2.x);
  const y1 = Math.min(p1.y, p2.y);
  const x2 = Math.max(p1.x, p2.x);
  const y2 = Math.max(p1.y, p2.y);
  return { x1, y1, x2, y2 };
}

export function getCenterPoint(el: Element): Point {
  const { left, top, width, height } = el.getBoundingClientRect();
  return {
    x: left + width / 2,
    y: top + height / 2,
  };
}

export function toPoint(ev: PointerEvent): Point {
  return {
    x: ev.nativeEvent.offsetX,
    y: ev.nativeEvent.offsetY,
  };
}
