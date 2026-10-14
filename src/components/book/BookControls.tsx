import { ArrowLeft, ArrowRight, BookOpen, Library, Volume2, VolumeX } from "lucide-react";
import type { Language } from "@/data/chapters";
import LanguageSelector from "./LanguageSelector";

interface ToolbarProps {
  language: Language; onLanguage: (language: Language) => void;
  onContents: () => void; onClose: () => void; closed: boolean; turning: boolean;
  soundAvailable: boolean; soundOn: boolean; onSound: () => void;
  systemReducedMotion: boolean; reducedMotion: boolean; onMotion: () => void;
}

export function BookToolbar({ language, onLanguage, onContents, onClose, closed, turning, soundAvailable, soundOn, onSound, systemReducedMotion, reducedMotion, onMotion }: ToolbarProps) {
  return <div className="book-toolbar">
    <div className={`toolbar-tools ${closed ? "tools-hidden" : ""}`}>
      <button type="button" onClick={onContents} disabled={closed || turning} className="icon-control" aria-label="Table of contents" title="Contents"><Library size={17} strokeWidth={1.3} /></button>
      <button type="button" onClick={onClose} disabled={closed || turning} className="icon-control" aria-label="Close the book" title="Close the book"><BookOpen size={17} strokeWidth={1.3} /></button>
    </div>
    <LanguageSelector language={language} onChange={onLanguage} disabled={turning} />
    <div className="toolbar-right">
      {systemReducedMotion && <button type="button" onClick={onMotion} aria-pressed={!reducedMotion} className="icon-control motion-control" aria-label={reducedMotion ? "Enable page animations" : "Use your device’s reduced-motion setting"} title={reducedMotion ? "Enable page animations" : "Use your device’s reduced-motion setting"}>Animate</button>}
      <button type="button" onClick={onSound} disabled={!soundAvailable} aria-pressed={soundOn} className="icon-control sound-control" aria-label={soundAvailable ? (soundOn ? "Mute page sounds" : "Enable page sounds") : "Page sounds unavailable for this edition"} title={soundAvailable ? (soundOn ? "Mute page sounds" : "Enable page sounds") : "Page sounds unavailable for this edition"}>{soundOn ? <Volume2 size={17} strokeWidth={1.3} /> : <VolumeX size={17} strokeWidth={1.3} />}</button>
    </div>
  </div>;
}

export default function BookControls({ page, count, portrait, label, turning, onPrev, onNext, onOpen }: { page: number; count: number; portrait: boolean; label: string; turning: boolean; onPrev: () => void; onNext: () => void; onOpen: () => void }) {
  const front = page === 0;
  const back = page >= count - 1;
  if (front || back) return <div className="cover-invitation"><span className="invitation-rule" /><button type="button" onClick={onOpen} disabled={turning}>{front ? "Click to open" : "Open once more"}<ArrowRight size={15} strokeWidth={1} /></button><span className="invitation-rule" /></div>;
  return <nav className="book-controls" aria-label="Book navigation">
    <button type="button" className="page-nav" onClick={onPrev} disabled={turning || front} aria-label="Previous page"><ArrowLeft size={20} strokeWidth={1.2} /><span>Previous</span></button>
    <div className="reading-position"><span>{label}</span><small>{String(page).padStart(2, "0")}{!portrait && page + 1 < count - 1 ? ` — ${String(page + 1).padStart(2, "0")}` : ""}<i>/</i>{count - 2}</small></div>
    <button type="button" className="page-nav" onClick={onNext} disabled={turning || back} aria-label="Next page"><span>Next</span><ArrowRight size={20} strokeWidth={1.2} /></button>
  </nav>;
}
