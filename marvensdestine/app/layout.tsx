import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import TopSocials from "./components/TopSocials";
import TransitionProvider, { ContentTransition } from "./components/TransitionProvider";
import AuthProvider from "./components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marvens Destine",
  description: "Marvens Destine's 3D portfolio",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "Marvens Destine – 3D Visuals, Motion & Interactive",
    description: "3D visualization, motion graphics, interactive web experiences, and NFT collections by Marvens Destine.",
    url: '/',
    siteName: 'Marvens Destine',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Marvens Destine Portfolio' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marvens Destine – 3D Visuals, Motion & Interactive',
    description: "3D visualization, motion graphics, interactive web experiences, and NFT collections by Marvens Destine.",
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <TransitionProvider>
            <TopSocials />
            <BottomNav />
            <ContentTransition>
              {children}
            </ContentTransition>
          </TransitionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
