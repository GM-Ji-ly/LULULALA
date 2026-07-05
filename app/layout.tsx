import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 廣告文案生成器",
  description: "利用 AI 一鍵生成繁體中文廣告文案，支援多平台、多語氣風格",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="h-full antialiased">
      <body className="min-h-full bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
