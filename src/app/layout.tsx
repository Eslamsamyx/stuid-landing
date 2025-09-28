import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: "StuID - Die digitale Studentenkarte für die Schweiz",
  description: "Erhalte exklusive Rabatte und Vorteile mit deiner digitalen Studentenkarte. Verfügbar für Studierende an allen Schweizer Hochschulen.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
