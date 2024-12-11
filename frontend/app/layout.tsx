import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./components/header";
import { SITE_TEXTS } from "./constants/texts";
import "./globals.css";
import "./markdown.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: SITE_TEXTS.meta.title,
  description: SITE_TEXTS.meta.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fi">
      <body className={inter.className + " background-color"}>
        <Header />
        {children}
      </body>
    </html>
  );
}
