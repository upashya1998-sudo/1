declare module "page-flip" {
  export type PageState = "read" | "fold_corner" | "user_fold" | "flipping";
  export type PageOrientation = "portrait" | "landscape";
  export interface FlipSettings {
    width: number; height: number; startPage?: number; size?: "fixed" | "stretch";
    minWidth?: number; maxWidth?: number; minHeight?: number; maxHeight?: number;
    drawShadow?: boolean; flippingTime?: number; usePortrait?: boolean;
    startZIndex?: number; autoSize?: boolean; maxShadowOpacity?: number;
    showCover?: boolean; mobileScrollSupport?: boolean; clickEventForward?: boolean;
    useMouseEvents?: boolean; swipeDistance?: number; showPageCorners?: boolean; disableFlipByClick?: boolean;
  }
  export interface FlipEvent<T> { data: T; object: PageFlip }
  export class PageFlip {
    constructor(element: HTMLElement, settings: FlipSettings);
    on(event: "flip", handler: (event: FlipEvent<number>) => void): this;
    on(event: "changeState", handler: (event: FlipEvent<PageState>) => void): this;
    on(event: "changeOrientation", handler: (event: FlipEvent<PageOrientation>) => void): this;
    on(event: "init" | "update", handler: (event: FlipEvent<{ page: number; mode: PageOrientation }>) => void): this;
    off(event: string): void;
    loadFromHTML(elements: HTMLElement[]): void;
    updateFromHtml(elements: HTMLElement[]): void;
    getSettings(): FlipSettings;
    getUI(): { setOrientationStyle: (orientation: PageOrientation) => void };
    getState(): PageState;
    getCurrentPageIndex(): number;
    getPageCount(): number;
    getOrientation(): PageOrientation;
    turnToPage(index: number): void;
    turnToNextPage(): void;
    turnToPrevPage(): void;
    flip(index: number, corner?: "top" | "bottom"): void;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    destroy(): void;
  }
}
