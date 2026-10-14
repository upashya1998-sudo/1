import type { Chapter } from "@/data/chapters";
import BotanicalIllustration from "./BotanicalIllustration";
import { Flourish } from "./Ornaments";

export default function ChapterPage({ chapter }: { chapter: Chapter }) {
  return <section className="chapter-opening" aria-label={`${chapter.numeral}. ${chapter.name} — ${chapter.subtitle}`}>
    <p className="chapter-numeral">{chapter.numeral}</p>
    <h2 lang="ur" dir="rtl" className="chapter-urdu">{chapter.urdu}</h2>
    <p className="chapter-name">{chapter.name}</p>
    <Flourish />
    <p className="chapter-subtitle">{chapter.subtitle}</p>
    <BotanicalIllustration stage={chapter.number} className="chapter-botanical" />
  </section>;
}
