import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider, AuthProvider } from "@/lib/contexts";
import { FontProvider } from "@/components/providers/FontProvider";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "OTS - Overseering The Service",
  description: "온라인 일정 관리 시스템",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet" />
      </head>
      <body className={inter.variable} style={{ touchAction: 'pan-x pan-y', WebkitOverflowScrolling: 'touch' }}>
        <LanguageProvider>
          <FontProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </FontProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}