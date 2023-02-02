import type { PointerEvent } from "react";

export enum LassoPoint {
  START = 1,
  END = 2,
}

const POINTS = [LassoPoint.START, LassoPoint.END] as const;

const x = (i: LassoPoint) => `--x${i}`;
const y = (i: LassoPoint) => `--y${i}`;

export function setLassoStyles(
  el: HTMLElement | null,
  ev: PointerEvent,
  p?: LassoPoint
): void {
  if (el) {
    for (const i of p ? [p] : POINTS) {
      el.style.setProperty(x(i), String(ev.nativeEvent.offsetX));
      el.style.setProperty(y(i), String(ev.nativeEvent.offsetY));
    }
  }
}

export function removeLassoStyles(el: HTMLDivElement | null): void {
  if (el) {
    for (const i of POINTS) {
      el.style.removeProperty(x(i));
      el.style.removeProperty(y(i));
    }
    el.removeAttribute("style");
  }
}
