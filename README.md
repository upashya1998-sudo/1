# Ishq Ke Saat Maqamaat

An interactive antique poetry book built with Next.js App Router, TypeScript, Tailwind CSS, Motion, and StPageFlip.

## Run locally

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3005. For a production build, use `npm run build` and then `npm start`. Port 3005 keeps the book separate from other projects using port 3000.

## Reading

- Click the cover to open it. Click a page edge or drag its corner to turn a leaf.
- Use the discreet Previous/Next controls, or the left/right arrow keys.
- Swipe on mobile. The book displays one page below 880px and a spread on larger screens.
- Choose Urdu, Roman Urdu, or English. The current stage and nearest original verse line are retained.
- Use the contents button to jump to a stage, the book button to close the front cover, Home/Escape to return to the cover, or End to reach the back cover. Click the back cover to reopen it.
- Poetry can be selected with a mouse while reading. Reduced motion uses immediate page turns.

## Manuscript and artwork

The seven poems are in `src/data/chapters.ts`, reproduced exactly as supplied in all three languages. Preserve newlines and blank lines when editing. Font measurement automatically lays the text into consecutive leaves. Verse lines and stanzas stay together when they fit on a fresh leaf. An unusually long line continues at an existing word boundary, with its original characters and logical line identity preserved.

The illustrations and gold ornaments are original reusable SVG drawings. CSS and small SVG noise textures create the leather, paper grain, aged edges, and binding shadows. The reference JPGs are retained in `public/references` and are not used as page backgrounds.

EB Garamond and Noto Nastaliq Urdu are self-hosted from Fontsource, so reading does not depend on a Google Fonts request. Their license files are distributed with their installed packages.

## Optional recorded page sound

Sound is unavailable and off by default because no audio recording was supplied. Add a real recording to `public/audio/page-turn.mp3`, then set `pageTurnAudio` in `src/data/chapters.ts` to `/audio/page-turn.mp3`. The toggle becomes available after the recording loads and remains muted until the reader enables it. There is no background music or synthetic sound.

## Checks

```sh
npm run typecheck
npm test
npm run build
```

The tests check all 21 poems at several page sizes, stage preservation across language changes, chapter links, keyboard bounds, cover reopening, mobile mode, swipe events, and a physical corner drag. They run in a simulated DOM with deterministic text measurements. Browser screenshots and actual Nastaliq layout still require a connected browser for visual verification.
