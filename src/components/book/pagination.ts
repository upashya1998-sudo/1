import { chapters, type Chapter, type Language } from "@/data/chapters";

export interface VerseLine { text: string; stanzaStart: boolean; index: number; continuation?: boolean }
export interface BookLeaf {
  id: string;
  kind: "front" | "endpaper" | "title" | "contents" | "chapter" | "poem" | "blank" | "closing" | "back";
  chapter?: Chapter;
  lines?: VerseLine[];
  part?: number;
}
export interface BookDimensions { width: number; height: number; portrait: boolean }

export function poemStyle(language: Language, width: number) {
  return { fontSize: language === "ur" ? (width < 345 ? 16 : 18) : language === "roman" ? (width < 345 ? 17 : 19) : (width < 345 ? 20 : 22) };
}

function paginate(text: string, language: Language, size: BookDimensions): VerseLine[][] {
  const measure = document.createElement("div");
  measure.className = `poem-text poem-measure poem-${language}`;
  measure.dir = language === "ur" ? "rtl" : "ltr";
  measure.style.width = `${size.width - 72}px`;
  measure.style.fontSize = `${poemStyle(language, size.width).fontSize}px`;
  document.body.appendChild(measure);
  const available = size.height - 155;
  const groups = text.split("\n\n").map((stanza, stanzaIndex) => stanza.split("\n").map((line, i) => ({ text: line, stanzaStart: stanzaIndex > 0 && i === 0, index: 0 })));
  let lineIndex = 0;
  const pages: VerseLine[][] = [];
  let current: VerseLine[] = [];
  let used = 0;
  const heightOf = (line: VerseLine) => {
    const span = document.createElement("span");
    span.className = "verse-line";
    span.textContent = line.text;
    measure.replaceChildren(span);
    return span.getBoundingClientRect().height;
  };
  const fittedGroups = groups.map(stanza => stanza.flatMap(line => {
    const original = { ...line, index: lineIndex++ };
    if (heightOf(original) <= available) return [original];
    // An original English line can be a long paragraph. Continue it at an
    // existing word boundary, retaining all characters and its logical identity.
    const words = line.text.match(/\s*\S+\s*/gu) ?? [line.text];
    const pieces: VerseLine[] = [];
    let cursor = 0;
    while (cursor < words.length) {
      let low = 1;
      let high = words.length - cursor;
      let fitting = 1;
      while (low <= high) {
        const count = Math.floor((low + high) / 2);
        const text = words.slice(cursor, cursor + count).join("");
        if (heightOf({ ...original, text }) <= available) { fitting = count; low = count + 1; }
        else high = count - 1;
      }
      pieces.push({ ...original, text: words.slice(cursor, cursor + fitting).join(""), stanzaStart: pieces.length === 0 && line.stanzaStart, continuation: pieces.length > 0 });
      cursor += fitting;
    }
    return pieces;
  }));
  for (const stanza of fittedGroups) {
    const heights = stanza.map(heightOf);
    const gap = language === "ur" ? 17 : 22;
    const stanzaHeight = heights.reduce((a, b) => a + b, 0);
    // Keep a whole stanza together wherever it fits on a fresh leaf.
    if (current.length && stanzaHeight <= available && used + stanzaHeight + gap > available) {
      pages.push(current); current = []; used = 0;
    }
    stanza.forEach((line, i) => {
      const space = current.length && line.stanzaStart ? gap : 0;
      if (current.length && used + heights[i] + space > available) {
        pages.push(current); current = []; used = 0;
      }
      current.push(line);
      used += heights[i] + (current.length > 1 ? space : 0);
    });
  }
  if (current.length) pages.push(current);
  measure.remove();
  return pages;
}

export function createLeaves(language: Language, size: BookDimensions): BookLeaf[] {
  const leaves: BookLeaf[] = [
    { id: "front", kind: "front" },
    { id: "front-endpaper", kind: "endpaper" },
    { id: "title", kind: "title" },
    { id: "contents", kind: "contents" },
  ];
  for (const chapter of chapters) {
    if (leaves.length % 2 !== 0) leaves.push({ id: `${chapter.id}-verso`, kind: "blank", chapter });
    leaves.push({ id: `${chapter.id}-opening`, kind: "chapter", chapter });
    paginate(chapter.poems[language], language, size).forEach((lines, part) => leaves.push({ id: `${chapter.id}-poem-${part}`, kind: "poem", chapter, lines, part }));
  }
  if (leaves.length % 2 !== 0) leaves.push({ id: "closing-verso", kind: "blank", chapter: chapters[6] });
  leaves.push({ id: "closing", kind: "closing" });
  if (leaves.length % 2 !== 0) leaves.push({ id: "back-endpaper", kind: "endpaper" });
  if (leaves.length % 2 === 0) leaves.push({ id: "last-verso", kind: "blank" });
  leaves.push({ id: "back", kind: "back" });
  return leaves;
}

export function findEquivalentLeaf(old: BookLeaf | undefined, next: BookLeaf[]): number {
  if (!old) return 0;
  if (old.kind === "poem") {
    const line = old.lines?.[0]?.index ?? 0;
    const matching = next.findIndex(p => p.kind === "poem" && p.chapter?.id === old.chapter?.id && p.lines?.some(l => l.index === line));
    if (matching >= 0) return matching;
  }
  const exact = next.findIndex(p => p.id === old.id);
  return exact >= 0 ? exact : Math.max(0, next.findIndex(p => p.chapter?.id === old.chapter?.id && p.kind === old.kind));
}
