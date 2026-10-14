"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { pageTurnAudio, type Language } from "@/data/chapters";
import BookEngine, { type BookEngineHandle } from "./BookEngine";
import BookCover from "./BookCover";
import BookControls, { BookToolbar } from "./BookControls";
import { createLeaves, findEquivalentLeaf, type BookDimensions, type BookLeaf } from "./pagination";

interface Layout { size: BookDimensions; leaves: BookLeaf[]; startPage: number }

function readingLeaf(layout: Layout, index: number): BookLeaf | undefined {
  const left = layout.leaves[index];
  const right = !layout.size.portrait ? layout.leaves[index + 1] : undefined;
  return right?.kind === "chapter" || right?.kind === "closing" ? right : left;
}

function getDimensions(): BookDimensions {
  const portrait = window.innerWidth < 880;
  const availableWidth = portrait ? window.innerWidth - 40 : (window.innerWidth - 100) / 2;
  const availableHeight = Math.max(390, window.innerHeight - (portrait ? 195 : 190));
  const width = Math.floor(Math.max(260, Math.min(408, availableWidth, availableHeight / 1.46)));
  return { width, height: Math.round(width * 1.46), portrait };
}

export default function Book() {
  const [language, setLanguage] = useState<Language>("ur");
  const [layout, setLayout] = useState<Layout | null>(null);
  const [page, setPage] = useState(0);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("landscape");
  const [turning, setTurning] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [soundAvailable, setSoundAvailable] = useState(false);
  const bookRef = useRef<BookEngineHandle | null>(null);
  const layoutRef = useRef<Layout | null>(null);
  const pageRef = useRef(0);
  const languageRef = useRef<Language>("ur");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const systemReducedMotion = useReducedMotion();
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null);
  const reducedMotion = motionOverride ?? !!systemReducedMotion;

  useEffect(() => {
    try {
      if (window.localStorage.getItem("ishq-book-motion") === "animate") setMotionOverride(false);
    } catch {
      // Keep the device preference when storage is unavailable.
    }
  }, []);

  const applyLayout = useCallback((size: BookDimensions, nextLanguage: Language) => {
    const previous = layoutRef.current;
    const oldLeaf = previous ? readingLeaf(previous, pageRef.current) : undefined;
    const leaves = createLeaves(nextLanguage, size);
    const desired = findEquivalentLeaf(oldLeaf, leaves);
    const next = { size, leaves, startPage: desired };
    layoutRef.current = next;
    setLayout(next);
    setPage(desired);
    pageRef.current = desired;
  }, []);

  useEffect(() => {
    let mounted = true;
    let resizeTimer: ReturnType<typeof setTimeout>;
    document.fonts.ready.then(() => {
      if (mounted) applyLayout(getDimensions(), languageRef.current);
    });
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const size = getDimensions();
        const previous = layoutRef.current?.size;
        if (previous?.width !== size.width || previous?.height !== size.height || previous?.portrait !== size.portrait) applyLayout(size, languageRef.current);
      }, 160);
    };
    window.addEventListener("resize", onResize);
    return () => { mounted = false; clearTimeout(resizeTimer); window.removeEventListener("resize", onResize); };
  }, [applyLayout]);

  useEffect(() => {
    if (!pageTurnAudio) return;
    const audio = new Audio(pageTurnAudio);
    audio.preload = "auto";
    audio.volume = .28;
    audioRef.current = audio;
    const ready = () => setSoundAvailable(true);
    const error = () => { setSoundAvailable(false); setSoundOn(false); };
    audio.addEventListener("canplaythrough", ready);
    audio.addEventListener("error", error);
    return () => { audio.pause(); audio.removeEventListener("canplaythrough", ready); audio.removeEventListener("error", error); audioRef.current = null; };
  }, []);

  const nextPage = useCallback(() => {
    const book = bookRef.current?.pageFlip();
    if (!book || book.getState() === "flipping" || book.getState() === "user_fold") return;
    if (book.getCurrentPageIndex() >= book.getPageCount() - 1) return;
    if (reducedMotion) book.turnToNextPage(); else book.flipNext("bottom");
  }, [reducedMotion]);

  const previousPage = useCallback(() => {
    const book = bookRef.current?.pageFlip();
    if (!book || book.getState() === "flipping" || book.getState() === "user_fold") return;
    if (book.getCurrentPageIndex() === 0) return;
    if (reducedMotion) book.turnToPrevPage(); else book.flipPrev("bottom");
  }, [reducedMotion]);

  const goTo = useCallback((index: number) => {
    const book = bookRef.current?.pageFlip();
    if (!book || book.getState() === "flipping" || book.getState() === "user_fold") return;
    if (index === book.getCurrentPageIndex() || index < 0 || index >= book.getPageCount()) return;
    if (reducedMotion) book.turnToPage(index); else book.flip(index, "bottom");
  }, [reducedMotion]);

  const onLanguage = (next: Language) => {
    if (next === language || !layout || turning) return;
    languageRef.current = next;
    setLanguage(next);
    applyLayout(layout.size, next);
  };

  const toggleMotion = () => {
    if (reducedMotion) {
      setMotionOverride(false);
      try { window.localStorage.setItem("ishq-book-motion", "animate"); } catch { /* Storage is optional. */ }
      return;
    }
    setMotionOverride(null);
    try { window.localStorage.removeItem("ishq-book-motion"); } catch { /* Storage is optional. */ }
  };

  const onChapter = (id: string) => {
    const index = layoutRef.current?.leaves.findIndex(leaf => leaf.kind === "chapter" && leaf.chapter?.id === id) ?? -1;
    if (index >= 0) goTo(index);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === "ArrowRight") { event.preventDefault(); nextPage(); }
      if (event.key === "ArrowLeft") { event.preventDefault(); previousPage(); }
      if (event.key === "Home" || event.key === "Escape") { event.preventDefault(); goTo(0); }
      if (event.key === "End") { event.preventDefault(); goTo((layoutRef.current?.leaves.length ?? 1) - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, nextPage, previousPage]);

  const onFlip = (index: number) => {
    setPage(index);
    pageRef.current = index;
    if (soundOn && audioRef.current) {
      audioRef.current.currentTime = 0;
      void audioRef.current.play().catch(() => { setSoundOn(false); });
    }
  };

  const count = layout?.leaves.length ?? 0;
  const isFront = page === 0;
  const isBack = count > 0 && page >= count - 1;
  const closed = isFront || isBack;
  const portrait = orientation === "portrait";
  const visibleLeaf = layout ? readingLeaf(layout, page) : undefined;
  const currentChapter = visibleLeaf?.chapter;
  const label = currentChapter ? `${currentChapter.numeral} · ${currentChapter.name}` : visibleLeaf?.kind === "contents" ? "The seven stages" : visibleLeaf?.kind === "closing" ? "Fanaa · Finis" : "The beginning";
  const stageOffset = !portrait && closed ? (isFront ? "-25%" : "25%") : "0%";

  return <main lang="en" className={`reading-room ${closed ? "room-closed" : "room-open"} ${turning ? "book-turning" : ""}`}>
    <div className="room-grain" aria-hidden="true" />
    <header className="room-heading"><span className="heading-diamond" aria-hidden="true" /><p>THE SEVEN STAGES OF LOVE</p><span className="heading-diamond" aria-hidden="true" /></header>
    <div className="reader-shell" style={layout ? { maxWidth: portrait ? layout.size.width : layout.size.width * 2 } : undefined}>
      <BookToolbar language={language} onLanguage={onLanguage} onContents={() => goTo(3)} onClose={() => goTo(0)} closed={closed} turning={turning} soundAvailable={soundAvailable} soundOn={soundOn} onSound={() => setSoundOn(value => !value)} systemReducedMotion={!!systemReducedMotion} reducedMotion={reducedMotion} onMotion={toggleMotion} />
      <div role="group" className={`book-stage ${portrait ? "stage-portrait" : "stage-landscape"}`} aria-label="Interactive antique poetry book" aria-describedby="reading-instructions">
        {layout ? <motion.div className="book-object" animate={{ x: stageOffset }} initial={false} transition={{ duration: reducedMotion ? 0 : .9, ease: [.22, .61, .36, 1] }} onMouseDownCapture={event => { if ((event.target as HTMLElement).closest(".poem-text")) event.stopPropagation(); }}>
          <BookEngine ref={bookRef} size={layout.size} leaves={layout.leaves} language={language} startPage={layout.startPage} reducedMotion={!!reducedMotion} onFlip={onFlip} onOrientation={setOrientation} onState={state => setTurning(state === "flipping" || state === "user_fold")} onChapter={onChapter} onNext={nextPage} onPrev={previousPage} />
        </motion.div> : <div className="loading-cover" aria-busy="true"><BookCover /></div>}
      </div>
      <BookControls page={page} count={count} portrait={portrait} label={label} turning={turning} onPrev={previousPage} onNext={nextPage} onOpen={isBack ? previousPage : nextPage} />
      <p id="reading-instructions" className="reading-instructions">{closed ? "A quiet journey, from Hubb to Fanaa." : <><span className="desktop-hint">Turn a corner, or use <kbd>←</kbd> <kbd>→</kbd></span><span className="mobile-hint">Swipe gently to turn the page</span></>}</p>
    </div>
    <span className="sr-only" role="status" aria-live="polite">{closed ? (isFront ? "Book closed. Open the front cover to begin." : "You have reached the back cover. Reopen to read again.") : `${label}. Page ${page}. ${language === "ur" ? "Urdu" : language === "roman" ? "Roman Urdu" : "English"}.`}</span>
  </main>;
}
