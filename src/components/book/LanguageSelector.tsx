import type { Language } from "@/data/chapters";

export default function LanguageSelector({ language, onChange, disabled }: { language: Language; onChange: (language: Language) => void; disabled?: boolean }) {
  return <div className="language-selector" role="group" aria-label="Poetry language">
    <button type="button" lang="ur" dir="rtl" aria-pressed={language === "ur"} onClick={() => onChange("ur")} disabled={disabled}>اردو</button>
    <span aria-hidden="true">/</span>
    <button type="button" aria-pressed={language === "roman"} onClick={() => onChange("roman")} disabled={disabled}>Roman Urdu</button>
    <span aria-hidden="true">/</span>
    <button type="button" aria-pressed={language === "en"} onClick={() => onChange("en")} disabled={disabled}>English</button>
  </div>;
}
