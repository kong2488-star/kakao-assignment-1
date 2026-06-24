import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kakao Todo",
  description: "Kakao assignment Todo application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
