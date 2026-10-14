import { bookTitle } from "@/data/chapters";
import { CoverFiligree, Flourish } from "./Ornaments";

export default function BookCover({ back = false, onOpen }: { back?: boolean; onOpen?: () => void }) {
  return <div className={`leather-cover ${back ? "back-cover" : "front-cover"}`}>
    <div className="cover-spine" aria-hidden="true"><i /><i /><i /><i /><i /></div>
    <CoverFiligree />
    <div className="cover-content">
      {back ? <>
        <span className="back-emblem" lang="ur" dir="rtl">فنا</span>
        <Flourish />
        <span className="cover-edition">FINIS</span>
      </> : <>
        <span className="cover-edition">A BOOK OF SEVEN STAGES</span>
        <h1 lang="ur" dir="rtl" className="cover-urdu">عشق کے<br />سات مقامات</h1>
        <Flourish />
        <p className="cover-roman">ISHQ KE SAAT<br />MAQAMAAT</p>
        <p className="cover-english">{bookTitle.english}</p>
      </>}
    </div>
    <p className="cover-inscription">{back ? "Love, beyond the self." : "A Journey Through the Seven Stages of Love"}</p>
    {onOpen && <button type="button" className="cover-open-button" aria-label={back ? "Reopen the book" : "Open Ishq Ke Saat Maqamaat"} onClick={onOpen} />}
  </div>;
}
