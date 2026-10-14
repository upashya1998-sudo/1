import { forwardRef, type CSSProperties } from "react";
import { bookTitle, closingLine, type Language } from "@/data/chapters";
import type { BookDimensions, BookLeaf } from "./pagination";
import { poemStyle } from "./pagination";
import BookCover from "./BookCover";
import ChapterPage from "./ChapterPage";
import TableOfContents from "./TableOfContents";
import BotanicalIllustration from "./BotanicalIllustration";
import { Corner, Flourish } from "./Ornaments";

interface Props { leaf: BookLeaf; index: number; language: Language; size: BookDimensions; onChapter: (id: string) => void; onOpen: () => void; onReopen: () => void; onNext: () => void; onPrev: () => void }

const BookPage = forwardRef<HTMLDivElement, Props>(function BookPage({ leaf, index, language, size, onChapter, onOpen, onReopen, onNext, onPrev }, ref) {
  const cover = leaf.kind === "front" || leaf.kind === "back";
  const style = { "--page-w": `${size.width}px`, "--page-h": `${size.height}px` } as CSSProperties;
  return <div ref={ref} data-density={cover ? "hard" : "soft"} data-leaf-id={leaf.id} className={`book-page ${cover ? "hard-page" : "paper-page"} ${index % 2 ? "page-left" : "page-right"} leaf-${leaf.kind}`} style={style}>
    {cover ? <BookCover back={leaf.kind === "back"} onOpen={leaf.kind === "back" ? onReopen : onOpen} /> : <>
      <div className="paper-grain" aria-hidden="true" />
      <div className="paper-inner">
        {leaf.kind === "endpaper" && <div className="endpaper-art"><BotanicalIllustration stage={5} /><Flourish /><span className="ex-libris">EX LIBRIS<br /><i>A little book of love</i></span></div>}
        {leaf.kind === "title" && <section className="title-page"><span className="page-eyebrow">SEVEN STAGES · ONE JOURNEY</span><h2 lang="ur" dir="rtl">عشق کے<br />سات مقامات</h2><Flourish /><p className="title-roman">{bookTitle.roman}</p><p className="title-english">{bookTitle.english}</p><BotanicalIllustration stage={2} className="title-botanical" /><span className="title-colophon">A JOURNEY FROM HUBB TO FANAA</span></section>}
        {leaf.kind === "contents" && <TableOfContents language={language} onChapter={onChapter} />}
        {leaf.kind === "chapter" && leaf.chapter && <ChapterPage chapter={leaf.chapter} />}
        {leaf.kind === "poem" && leaf.chapter && <section className="poetry-page" lang={language === "ur" ? "ur" : language === "roman" ? "ur-Latn" : "en"} aria-label={`${leaf.chapter.name}, poetry${leaf.part ? `, continued ${leaf.part + 1}` : ""}`}>
          <header className="running-head"><span>{leaf.chapter.numeral}</span><span>{leaf.chapter.name}</span><span>{leaf.part ? "CONTINUED" : ""}</span></header>
          <div className={`poem-text poem-${language}`} dir={language === "ur" ? "rtl" : "ltr"} style={poemStyle(language, size.width)}>
            {leaf.lines?.map((line, i) => <span key={`${line.index}-${i}`} className={`verse-line ${i > 0 && line.stanzaStart ? "stanza-start" : ""}`}>{line.text}</span>)}
          </div>
          <Flourish className="poetry-flourish" />
        </section>}
        {leaf.kind === "blank" && <div className="quiet-verso"><BotanicalIllustration stage={leaf.chapter?.number ?? 7} /><Flourish /></div>}
        {leaf.kind === "closing" && <section className="closing-page"><span className="page-eyebrow">THE LAST STAGE</span><h2 className="chapter-urdu" lang="ur" dir="rtl">فنا</h2><Flourish /><blockquote>{closingLine}</blockquote><BotanicalIllustration stage={7} /><span className="closing-finis">FINIS</span></section>}
      </div>
      {leaf.kind !== "endpaper" && <><Corner className="corner-top" /><Corner className="corner-bottom" /><span className="folio" aria-hidden="true">{String(index).padStart(2, "0")}</span></>}
      <div className="gutter-shade" aria-hidden="true" />
      {(size.portrait || index % 2 === 1) && <button type="button" className="page-edge edge-left" tabIndex={-1} aria-label="Turn the left page edge" onClick={onPrev} />}
      {(size.portrait || index % 2 === 0) && <button type="button" className="page-edge edge-right" tabIndex={-1} aria-label="Turn the right page edge" onClick={onNext} />}
    </>}
  </div>;
});

export default BookPage;
