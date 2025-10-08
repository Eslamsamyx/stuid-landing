import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Geist } from "next/font/google";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4A90E2' },
    { media: '(prefers-color-scheme: dark)', color: '#2C4F7C' }
  ],
};

export const metadata: Metadata = {
  title: "StuID - Die digitale Studentenkarte für die Schweiz",
  description: "Erhalte exklusive Rabatte und Vorteile mit deiner digitalen Studentenkarte. Verfügbar für Studierende an allen Schweizer Schulen.",
  metadataBase: new URL('https://stuid.ch/landing'),
  icons: {
    icon: [
      { url: '/landing/favicon.ico?v=2', type: 'image/x-icon' },
      { url: '/landing/favicon-16x16.png?v=2', sizes: '16x16', type: 'image/png' },
      { url: '/landing/favicon-32x32.png?v=2', sizes: '32x32', type: 'image/png' }
    ],
    shortcut: [
      { url: '/landing/favicon.ico?v=2' }
    ],
    apple: [
      { url: '/landing/apple-touch-icon.png?v=2', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/landing/favicon-32x32.png?v=2',
        color: '#4A90E2'
      }
    ]
  },
  manifest: '/landing/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'StuID'
  },
  openGraph: {
    title: 'StuID - Die digitale Studentenkarte für die Schweiz',
    description: 'Erhalte exklusive Rabatte und Vorteile mit deiner digitalen Studentenkarte.',
    url: 'https://stuid.ch/landing',
    siteName: 'StuID',
    images: [
      {
        url: '/landing/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'StuID Logo',
      }
    ],
    locale: 'de_CH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StuID - Die digitale Studentenkarte für die Schweiz',
    description: 'Erhalte exklusive Rabatte und Vorteile mit deiner digitalen Studentenkarte.',
    images: ['/landing/android-chrome-512x512.png'],
  },
  category: 'education',
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
