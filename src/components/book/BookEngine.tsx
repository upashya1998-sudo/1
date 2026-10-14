"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { PageFlip, type PageOrientation, type PageState } from "page-flip";
import type { Language } from "@/data/chapters";
import BookPage from "./BookPage";
import type { BookDimensions, BookLeaf } from "./pagination";

export interface BookEngineHandle { pageFlip: () => PageFlip | null }
interface Props {
  size: BookDimensions; leaves: BookLeaf[]; language: Language; startPage: number; reducedMotion: boolean;
  onFlip: (page: number) => void; onOrientation: (orientation: PageOrientation) => void; onState: (state: PageState) => void;
  onChapter: (id: string) => void; onNext: () => void; onPrev: () => void;
}

// React owns the contents of each portal, while StPageFlip owns the page containers.
// Updating controls never reloads the engine or interrupts a physical page turn.
const BookEngine = forwardRef<BookEngineHandle, Props>(function BookEngine(props, ref) {
  const mountRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<PageFlip | null>(null);
  const loadedNodes = useRef<HTMLElement[]>([]);
  const changing = useRef(false);
  const latest = useRef(props);
  latest.current = props;
  const nodes = useMemo(() => props.leaves.map(leaf => {
    const node = document.createElement("div");
    node.dataset.density = leaf.kind === "front" || leaf.kind === "back" ? "hard" : "soft";
    node.className = "engine-leaf";
    return node;
  }), [props.leaves]);
  const latestNodes = useRef(nodes);
  latestNodes.current = nodes;

  useImperativeHandle(ref, () => ({ pageFlip: () => engineRef.current }), []);

  useEffect(() => {
    let active = true;
    // Deferring one microtask avoids creating a discarded engine in React Strict Mode.
    queueMicrotask(() => {
      if (!active || !mountRef.current) return;
      const current = latest.current;
      const host = document.createElement("div");
      host.className = "physical-book";
      mountRef.current.appendChild(host);
      hostRef.current = host;
      const engine = new PageFlip(host, {
        width: current.size.width, height: current.size.height,
        startPage: current.startPage, size: "fixed", minWidth: 260, maxWidth: 408,
        minHeight: 380, maxHeight: 596, usePortrait: current.size.portrait,
        drawShadow: true, flippingTime: current.reducedMotion ? 1 : 1100,
        startZIndex: 10, autoSize: true, maxShadowOpacity: .4, showCover: true,
        mobileScrollSupport: false, clickEventForward: true, useMouseEvents: true,
        swipeDistance: 30, showPageCorners: !current.reducedMotion, disableFlipByClick: true,
      });
      engineRef.current = engine;
      engine.on("flip", event => { if (active && !changing.current) latest.current.onFlip(event.data); });
      engine.on("changeState", event => { if (active) latest.current.onState(event.data); });
      engine.on("changeOrientation", event => { if (active) latest.current.onOrientation(event.data); });
      engine.on("init", () => {
        if (active) { latest.current.onOrientation(engine.getOrientation()); latest.current.onFlip(engine.getCurrentPageIndex()); }
      });
      loadedNodes.current = latestNodes.current;
      engine.loadFromHTML(latestNodes.current);
    });
    return () => {
      active = false;
      const engine = engineRef.current;
      if (engine) {
        ["flip", "changeState", "changeOrientation", "init", "update"].forEach(event => engine.off(event));
        engine.destroy();
      }
      engineRef.current = null;
      hostRef.current = null;
    };
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    const host = hostRef.current;
    if (!engine || !host) return;
    const settings = engine.getSettings();
    const resized = settings.width !== props.size.width || settings.height !== props.size.height || settings.usePortrait !== props.size.portrait;
    const pagesChanged = loadedNodes.current !== nodes;
    settings.width = props.size.width;
    settings.height = props.size.height;
    settings.usePortrait = props.size.portrait;
    settings.flippingTime = props.reducedMotion ? 1 : 1100;
    settings.showPageCorners = !props.reducedMotion;
    if (!resized && !pagesChanged) return;
    const width = props.size.width * (props.size.portrait ? 1 : 2);
    host.style.minWidth = `${width}px`;
    host.style.maxWidth = `${width}px`;
    host.style.minHeight = `${props.size.height}px`;
    changing.current = true;
    if (pagesChanged) {
      if (engine.getCurrentPageIndex() >= nodes.length) engine.turnToPage(nodes.length - 1);
      engine.updateFromHtml(nodes);
      loadedNodes.current = nodes;
    }
    engine.getUI().setOrientationStyle(props.size.portrait ? "portrait" : "landscape");
    changing.current = false;
    engine.turnToPage(props.startPage);
    latest.current.onOrientation(engine.getOrientation());
  }, [nodes, props.size, props.startPage, props.reducedMotion]);

  return <>
    <div ref={mountRef} className="engine-mount" style={{ width: props.size.width * (props.size.portrait ? 1 : 2), height: props.size.height }} />
    {props.leaves.map((leaf, index) => createPortal(<BookPage leaf={leaf} index={index} language={props.language} size={props.size} onChapter={props.onChapter} onOpen={props.onNext} onReopen={props.onPrev} onNext={props.onNext} onPrev={props.onPrev} />, nodes[index], leaf.id))}
  </>;
});

export default BookEngine;
