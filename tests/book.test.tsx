import test, { after } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { act, createElement, createRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { chapters, type Language } from "../src/data/chapters";
import { createLeaves, findEquivalentLeaf, type BookDimensions } from "../src/components/book/pagination";

const browser = new Window({ width: 1280, height: 900, url: "http://localhost:3000" });
for (const name of ["window", "document", "navigator", "HTMLElement", "HTMLInputElement", "HTMLTextAreaElement", "Element", "SVGElement", "Node", "Event", "MouseEvent", "KeyboardEvent", "CustomEvent", "MutationObserver"]) {
  Object.defineProperty(globalThis, name, { value: name === "window" ? browser : (browser as unknown as Record<string, unknown>)[name], configurable: true, writable: true });
}
Object.defineProperty(globalThis, "getComputedStyle", { value: browser.getComputedStyle.bind(browser), configurable: true });
Object.defineProperty(globalThis, "requestAnimationFrame", { value: browser.requestAnimationFrame.bind(browser), configurable: true });
Object.defineProperty(globalThis, "cancelAnimationFrame", { value: browser.cancelAnimationFrame.bind(browser), configurable: true });
Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", { value: true, configurable: true });
Object.defineProperty(browser.document, "fonts", { value: { ready: Promise.resolve() } });
const originalMedia = browser.matchMedia.bind(browser);
browser.matchMedia = (query: string) => {
  const media = originalMedia(query);
  Object.defineProperty(media, "matches", { value: query.includes("prefers-reduced-motion"), configurable: true });
  return media;
};

// Happy DOM has no text layout. Deterministic measurements exercise pagination
// and lifecycle behavior; these checks do not claim to verify glyphs or visuals.
const prototype = browser.HTMLElement.prototype;
for (const [property, dimension] of [["offsetWidth", "width"], ["offsetHeight", "height"]] as const) {
  Object.defineProperty(prototype, property, { configurable: true, get() {
    const mount = this.closest(".engine-mount");
    return mount ? parseFloat(mount.style[dimension]) : dimension === "width" ? browser.innerWidth : browser.innerHeight;
  } });
}
prototype.getBoundingClientRect = function () {
  const measure = this.parentElement?.classList.contains("poem-measure") ? this.parentElement as typeof this : null;
  const width = measure ? parseFloat(measure.style.width) : this.offsetWidth;
  const font = measure ? parseFloat(measure.style.fontSize) : 18;
  const lineHeight = measure?.classList.contains("poem-ur") ? 2.55 : 1.5;
  const height = measure ? Math.ceil((this.textContent?.length ?? 0) * font * .55 / width) * font * lineHeight : this.offsetHeight;
  return new browser.DOMRect(0, 0, width, height);
};

let root: Root | null = null;
const sleep = (milliseconds: number) => new Promise(resolve => setTimeout(resolve, milliseconds));
async function settle(milliseconds = 30) { await act(async () => { await sleep(milliseconds); }); }
function button(label: string) {
  const node = Array.from(browser.document.querySelectorAll("button")).find(item => item.getAttribute("aria-label") === label || item.textContent === label);
  assert.ok(node, `Missing button: ${label}`);
  return node;
}
async function click(label: string) {
  await act(async () => { button(label).dispatchEvent(new browser.MouseEvent("click", { bubbles: true })); });
  await settle();
}
async function key(name: string) {
  await act(async () => { browser.dispatchEvent(new browser.KeyboardEvent("keydown", { key: name })); });
  await settle();
}
function status() { return browser.document.querySelector('[role="status"]')?.textContent ?? ""; }

after(async () => {
  if (root) await act(async () => { root?.unmount(); });
  Object.defineProperty(globalThis, "requestAnimationFrame", { value: () => 0, configurable: true });
  await browser.happyDOM.close();
});

test("all 21 poems retain every line and stanza at desktop and mobile sizes", () => {
  const sizes: BookDimensions[] = [
    { width: 408, height: 596, portrait: false },
    { width: 350, height: 511, portrait: true },
    { width: 280, height: 409, portrait: true },
  ];
  for (const size of sizes) for (const language of ["ur", "roman", "en"] as Language[]) {
    const leaves = createLeaves(language, size);
    assert.equal(leaves[0].kind, "front");
    assert.equal(leaves.at(-1)?.kind, "back");
    assert.equal(leaves.length % 2, 0, "The back cover must close as a single hardcover");
    for (const chapter of chapters) {
      const lines = leaves.filter(leaf => leaf.kind === "poem" && leaf.chapter?.id === chapter.id).flatMap(leaf => leaf.lines ?? []);
      const reconstructed = lines.map((line, i) => `${i === 0 || line.continuation ? "" : line.stanzaStart ? "\n\n" : "\n"}${line.text}`).join("");
      assert.equal(reconstructed, chapter.poems[language], `${chapter.name}, ${language}, ${size.width}px`);
      assert.equal(leaves.findIndex(leaf => leaf.kind === "chapter" && leaf.chapter?.id === chapter.id) % 2, 0, "Chapter openings begin on the right");
    }
    for (const leaf of leaves.filter(item => item.kind === "poem")) {
      const font = language === "ur" ? (size.width < 345 ? 16 : 18) : language === "roman" ? (size.width < 345 ? 17 : 19) : (size.width < 345 ? 20 : 22);
      const height = leaf.lines?.reduce((total, line, i) => total + Math.ceil(line.text.length * font * .55 / (size.width - 72)) * font * (language === "ur" ? 2.55 : 1.5) + (i > 0 && line.stanzaStart ? language === "ur" ? 17 : 22 : 0), 0) ?? 0;
      assert.ok(height <= size.height - 155 + .01, `${leaf.id} overflows at ${size.width}px: ${height}`);
    }
  }
});

test("language changes retain the same stage and the nearest logical verse line", () => {
  const size = { width: 280, height: 409, portrait: true };
  const original = createLeaves("ur", size);
  for (const language of ["roman", "en", "ur"] as Language[]) {
    const translated = createLeaves(language, size);
    for (const leaf of original.filter(leaf => leaf.kind === "chapter" || leaf.kind === "poem")) {
      const target = translated[findEquivalentLeaf(leaf, translated)];
      assert.equal(target.chapter?.id, leaf.chapter?.id);
      assert.equal(target.kind, leaf.kind);
    }
    assert.equal(translated[findEquivalentLeaf(original[0], translated)].kind, "front");
    assert.equal(translated[findEquivalentLeaf(original.at(-1), translated)].kind, "back");
  }
});

test("the reader opens, visits all chapters in every language, closes, resizes, and swipes", async () => {
  const { default: Book } = await import("../src/components/book/Book");
  const container = browser.document.createElement("div");
  browser.document.body.appendChild(container);
  root = createRoot(container as unknown as HTMLElement);
  await act(async () => { root?.render(createElement(Book)); });
  await settle();
  await settle();
  assert.match(status(), /Book closed/);
  const engineHost = browser.document.querySelector(".physical-book");
  assert.ok(engineHost);
  assert.ok(browser.document.querySelector(".--landscape"));
  await click("Open Ishq Ke Saat Maqamaat");
  assert.match(status(), /Page 1/);
  await key("ArrowRight");
  for (const chapter of chapters) {
    await click("Table of contents");
    await click(`Read ${chapter.name}: ${chapter.subtitle}`);
    assert.ok(status().includes(chapter.name), status());
    for (const language of ["Roman Urdu", "English", "اردو"]) {
      await click(language);
      assert.ok(status().includes(chapter.name), `Lost ${chapter.name} after selecting ${language}: ${status()}`);
      assert.strictEqual(browser.document.querySelector(".physical-book"), engineHost, "The page engine must remain mounted");
    }
  }
  await key("End");
  assert.match(status(), /back cover/);
  await click("English");
  assert.match(status(), /back cover/);
  await key("ArrowRight");
  assert.match(status(), /back cover/);
  await click("Reopen the book");
  assert.doesNotMatch(status(), /back cover/);
  await click("Close the book");
  assert.match(status(), /Book closed/);
  await key("ArrowLeft");
  assert.match(status(), /Book closed/);
  await click("اردو");
  await act(async () => {
    browser.happyDOM.setViewport({ width: 390, height: 844 });
    browser.dispatchEvent(new browser.Event("resize"));
    await sleep(190);
  });
  await settle();
  assert.ok(browser.document.querySelector(".--portrait"));
  assert.strictEqual(browser.document.querySelector(".physical-book"), engineHost);
  await click("Open Ishq Ke Saat Maqamaat");
  await key("ArrowRight");
  assert.match(status(), /Page 2/);
  const block = browser.document.querySelector(".stf__block");
  assert.ok(block);
  await act(async () => {
    const start = new browser.Event("touchstart", { bubbles: true, cancelable: true });
    Object.defineProperty(start, "changedTouches", { value: [{ clientX: 330, clientY: 250 }] });
    block.dispatchEvent(start);
    const end = new browser.Event("touchend", { bubbles: true, cancelable: true });
    Object.defineProperty(end, "changedTouches", { value: [{ clientX: 40, clientY: 250 }] });
    browser.dispatchEvent(end);
    await sleep(80);
  });
  await settle();
  assert.match(status(), /Page 3/);
  await click("Read Fanaa: The Annihilation of Self");
  await click("English");
  assert.match(status(), /Fanaa/);
  assert.ok(browser.document.querySelector('[aria-label="Page sounds unavailable for this edition"]:disabled'));
  await act(async () => { root?.unmount(); });
  root = null;
  container.remove();
});

test("a physical corner drag completes a forward turn with the real page engine", async () => {
  const { default: BookEngine } = await import("../src/components/book/BookEngine");
  type Handle = import("../src/components/book/BookEngine").BookEngineHandle;
  const ref = createRef<Handle>();
  const size = { width: 408, height: 596, portrait: false };
  const states: string[] = [];
  const pages: number[] = [];
  const container = browser.document.createElement("div");
  browser.document.body.appendChild(container);
  root = createRoot(container as unknown as HTMLElement);
  await act(async () => { root?.render(createElement(BookEngine, {
    ref, size, leaves: createLeaves("en", size), language: "en", startPage: 0, reducedMotion: false,
    onFlip: page => pages.push(page), onOrientation: () => {}, onState: state => states.push(state),
    onChapter: () => {}, onNext: () => ref.current?.pageFlip()?.flipNext("bottom"), onPrev: () => ref.current?.pageFlip()?.flipPrev("bottom"),
  })); });
  await settle();
  // The cover opens by click, then a soft parchment corner is dragged.
  await act(async () => { ref.current?.pageFlip()?.flipNext("bottom"); await sleep(1250); });
  assert.equal(ref.current?.pageFlip()?.getCurrentPageIndex(), 1);
  const block = container.querySelector(".stf__block");
  assert.ok(block);
  await act(async () => {
    block.dispatchEvent(new browser.MouseEvent("mousedown", { bubbles: true, clientX: 810, clientY: 590 }));
    for (const [clientX, clientY] of [[790, 580], [700, 560], [560, 520], [420, 470], [250, 420]]) {
      browser.dispatchEvent(new browser.MouseEvent("mousemove", { clientX, clientY, buttons: 1 }));
    }
    browser.dispatchEvent(new browser.MouseEvent("mouseup", { clientX: 180, clientY: 420 }));
    await sleep(1250);
  });
  assert.ok(states.includes("user_fold"), "A drag must engage the physical fold");
  assert.ok(states.includes("flipping"), "The hardcover must physically animate");
  assert.equal(ref.current?.pageFlip()?.getState(), "read");
  assert.equal(ref.current?.pageFlip()?.getCurrentPageIndex(), 3);
  assert.ok(pages.includes(3));
  await act(async () => { root?.unmount(); });
  root = null;
});
