import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGroteskVF.ttf",
  variable: "--font-space-grotesk",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "own GPT",
  description:
    "Your own personal assistant. Self-hosted, CPU only. Ready to start great conversations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} antialiased m-0 p-0`}>
        <main className="container m-auto font-grotesk">{children}</main>
      </body>
    </html>
  );
}
