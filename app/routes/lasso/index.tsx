import type { MetaFunction, LinksFunction } from "@remix-run/node";
import { type HTMLProps, type PointerEvent, useCallback, useRef } from "react";
import { cls } from "~/utils/classes";
import { LassoPoint, setLassoStyles, removeLassoStyles } from "./lasso.utils";
import {
  getSelectableElement,
  selectElement,
  toggleElement,
} from "./selection.utils";
import styles from "./lasso.css";

export const meta: MetaFunction = () => ({
  title: "Experiments - Lasso selection",
});

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function LassoRoute() {
  return (
    <main className="h-screen flex items-center justify-center bg-slate-700">
      <Lasso>
        {(selectableProps) => (
          <div className="grid grid-cols-3 gap-8">
            <Box className="" {...selectableProps(true)} />
            <Box className="" {...selectableProps(false)} />
            <Box />
            <Box />
            <Box className="" {...selectableProps(true)} />
            <Box className="" {...selectableProps(false)} />
          </div>
        )}
      </Lasso>
    </main>
  );
}

// --- BOXES ---

function Box({ className, ...props }: HTMLProps<HTMLDivElement>) {
  return <div className={cls("w-20 h-20 bg-blue-400", className)} {...props} />;
}

// --- LASSO ---

type LassoProps = {
  children: (props: SelectableProps) => JSX.Element;
};

type SelectableProps = (selected?: boolean) => {
  "data-selection": string;
};

function Lasso({ children }: LassoProps) {
  return (
    <>
      <LassoContainer />
      <LassoSelection>{children}</LassoSelection>
    </>
  );
}

function LassoContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Set<HTMLElement>>(new Set());

  const onPointerDown = useCallback((ev: PointerEvent) => {
    setLassoStyles(containerRef.current, ev);
    const el = getSelectableElement(ev);
    if (el) selectionRef.current.add(el);
  }, []);

  const onPointerUp = useCallback((ev: PointerEvent) => {
    removeLassoStyles(containerRef.current);
    const el = getSelectableElement(ev);
    if (el) selectionRef.current.add(el);
    const act = selectionRef.current.size > 1 ? selectElement : toggleElement;
    for (const sel of selectionRef.current.values()) act(sel);
    selectionRef.current.clear();
  }, []);

  const onPointerMove = useCallback((ev: PointerEvent) => {
    if (ev.pressure > 0)
      setLassoStyles(containerRef.current, ev, LassoPoint.END);
  }, []);

  const onPointerLeave = useCallback(() => {
    removeLassoStyles(containerRef.current);
  }, []);

  return (
    <div
      className="LassoContainer"
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="Lasso" />
    </div>
  );
}

function LassoSelection({ children }: LassoProps) {
  const selectableProps: SelectableProps = (selected?: boolean) => ({
    "data-selection": selected ? "selected" : "",
  });

  return <div className="LassoContent">{children(selectableProps)}</div>;
}
