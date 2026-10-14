import type { Metadata } from "next";
import "@fontsource/eb-garamond/400.css";
import "@fontsource/eb-garamond/400-italic.css";
import "@fontsource/eb-garamond/500.css";
import "@fontsource/noto-nastaliq-urdu/400.css";
import "./globals.css";
import "@/styles/book.css";

export const metadata: Metadata = {
  title: "عشق کے سات مقامات · Ishq Ke Saat Maqamaat",
  description: "The Seven Stages of Love. An antique poetry book in Urdu, Roman Urdu, and English, from Hubb to Fanaa.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ur" dir="ltr"><body>{children}</body></html>;
}
