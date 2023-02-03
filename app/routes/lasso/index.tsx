import type { MetaFunction, LinksFunction } from "@remix-run/node";
import { type HTMLProps, type PointerEvent, useCallback, useRef } from "react";
import { cls } from "~/utils/classes";
import {
  getCenterPoint,
  getRectangle,
  isInside,
  toPoint,
} from "./coordinates.utils";
import {
  getSelectableElement,
  getSelectableElements,
  getSelectionBehavior,
} from "./selection.utils";
import { PointIndex, setLassoStyles, removeLassoStyles } from "./lasso.utils";
import styles from "./lasso.css";

export const meta: MetaFunction = () => ({
  title: "Experiments - Lasso selection",
});

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function LassoRoute() {
  return (
    <main className="h-screen flex items-center justify-center bg-slate-700">
      <LassoProvider>
        {({ selectable }) => (
          <div className="grid grid-cols-2 gap-8">
            <Box className="" {...selectable()} />
            <Box className="" {...selectable()} />
            <Box className="" {...selectable()} />
            <Box className="" {...selectable()} />
          </div>
        )}
      </LassoProvider>
    </main>
  );
}

// --- BOXES ---

function Box({ className, ...props }: HTMLProps<HTMLDivElement>) {
  return <div className={cls("w-20 h-20 bg-blue-400", className)} {...props} />;
}

// --- LASSO ---

type LassoProviderProps = {
  children: (props: LassoRenderProps) => JSX.Element;
};

type LassoRenderProps = {
  selectable: (initialSelected?: boolean) => {
    "data-selection": string;
  };
};

const selectableProps: LassoRenderProps = {
  selectable: (initialSelected?: boolean) => ({
    "data-selection": initialSelected ? "selected" : "",
  }),
};

function LassoProvider({ children }: LassoProviderProps) {
  return (
    <>
      <LassoOverlay />
      {children(selectableProps)}
    </>
  );
}

function LassoOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const lassoRef = useRef<{ start?: PointerEvent }>({});

  const onPointerDown = useCallback((ev: PointerEvent) => {
    setLassoStyles(overlayRef.current, ev);
    lassoRef.current.start = ev;
  }, []);

  const onPointerMove = useCallback((ev: PointerEvent) => {
    if (ev.pressure > 0) {
      setLassoStyles(overlayRef.current, ev, PointIndex.END);
    }
  }, []);

  const onPointerUp = useCallback((ev: PointerEvent) => {
    removeLassoStyles(overlayRef.current);

    const lassoStart = toPoint(lassoRef.current.start!);
    const lassoEnd = toPoint(ev);
    const selection = getSelectionBehavior(lassoStart, lassoEnd);

    if ("rectangle" in selection) {
      const lassoRect = getRectangle(lassoStart, lassoEnd);
      const elements = getSelectableElements(
        overlayRef.current!.parentElement!
      );
      elements.forEach((el) => {
        if (isInside(lassoRect, getCenterPoint(el))) {
          selection.action(el);
        }
      });
    } else {
      const el = getSelectableElement(ev);
      if (el) {
        selection.action(el);
      }
    }

    delete lassoRef.current.start;
  }, []);

  const onPointerLeave = useCallback(() => {
    removeLassoStyles(overlayRef.current);
    delete lassoRef.current.start;
  }, []);

  return (
    <div
      className="LassoOverlay"
      ref={overlayRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="Lasso" />
    </div>
  );
}
