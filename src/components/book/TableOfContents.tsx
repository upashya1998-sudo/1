import { chapters, type Language } from "@/data/chapters";
import { Flourish } from "./Ornaments";

export default function TableOfContents({ language, onChapter }: { language: Language; onChapter: (id: string) => void }) {
  return <nav className="table-of-contents" aria-label="Table of contents">
    <span className="page-eyebrow">THE JOURNEY</span>
    <h2 lang="ur" dir="rtl" className="contents-urdu">سات مقامات</h2>
    <p className="contents-title">The Seven Stages</p>
    <Flourish />
    <ol>
      {chapters.map(chapter => <li key={chapter.id}>
        <button onClick={() => onChapter(chapter.id)} aria-label={`Read ${chapter.name}: ${chapter.subtitle}`}>
          <span className="toc-numeral">{chapter.numeral}</span>
          <span className="toc-word"><span className={language === "ur" ? "toc-urdu" : "toc-name"} lang={language === "ur" ? "ur" : "en"} dir={language === "ur" ? "rtl" : "ltr"}>{language === "ur" ? chapter.urdu : chapter.name}</span><span className="toc-description">{chapter.subtitle}</span></span>
          <span className="toc-dot" aria-hidden="true">·</span>
        </button>
      </li>)}
    </ol>
    <p className="contents-note">From the first glance<br />to the last trace of the self.</p>
  </nav>;
}
