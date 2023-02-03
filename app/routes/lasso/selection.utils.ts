import { type PointerEvent } from "react";
import {
  dist,
  getRectangle,
  type Point,
  type Rectangle,
} from "./coordinates.utils";

function isElementSelectable(el: Element): el is HTMLElement {
  return el instanceof HTMLElement && el.dataset.selection !== undefined;
}

export function getSelectableElement(ev: PointerEvent) {
  const elements = document.elementsFromPoint(ev.clientX, ev.clientY);
  return elements.find(isElementSelectable);
}

export function getSelectableElements(el: HTMLElement) {
  return el.querySelectorAll<HTMLElement>("[data-selection]");
}

function selectElement(el: HTMLElement) {
  el.dataset.selection = "selected";
}

function toggleElement(el: HTMLElement) {
  if (el.dataset.selection !== "selected") el.dataset.selection = "selected";
  else el.dataset.selection = "";
}

const rectSelectMinimumDistancePx = 10;

export function getSelectionBehavior(p1: Point, p2: Point): SelectionBehavior {
  return dist(p1, p2) >= rectSelectMinimumDistancePx
    ? // Above specified distance threshould, use rectangle selection
      {
        mode: "select",
        action: selectElement,
        rectangle: getRectangle(p1, p2),
      }
    : // Below that distance, use single point selection
      {
        mode: "toggle",
        action: toggleElement,
        point: p2,
      };
}

export type SelectionBehavior =
  | {
      action: SelectionAction;
      mode: SelectionMode;
      rectangle: Rectangle;
    }
  | {
      action: SelectionAction;
      mode: SelectionMode;
      point: Point;
    };

type SelectionMode = "select" | "toggle";
type SelectionAction = (el: HTMLElement) => void;
