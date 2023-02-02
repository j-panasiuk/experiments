import { type PointerEvent } from "react";

function isElementSelectable(el: Element): el is HTMLElement {
  return el instanceof HTMLElement && el.dataset.selection !== undefined;
}

export function getSelectableElement(ev: PointerEvent) {
  const elements = document.elementsFromPoint(ev.clientX, ev.clientY);
  return elements.find(isElementSelectable);
}

export function selectElement(el: HTMLElement) {
  el.dataset.selection = "selected";
}

export function toggleElement(el: HTMLElement) {
  if (el.dataset.selection !== "selected") el.dataset.selection = "selected";
  else el.dataset.selection = "";
}

export function getSelectableElements(el: HTMLElement) {
  return el.querySelectorAll("[data-selection]");
}
