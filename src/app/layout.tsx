import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PassionFruits - Radiant, communal, and effortlessly organized.",
  description: "Join a radiant community dedicated to holistic wellness, creative connection, and effortlessly organized lifestyles.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PassionFruits",
  },
};

import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { DynamicFavicon } from "@/components/DynamicFavicon";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#9a78b4" />
        <link rel="apple-touch-icon" href="/images/PF app logo iphone.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Pretendard Font */}
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        {/* Material Icons */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        {/* App Fonts: Plus Jakarta Sans & Space Grotesk */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Space+Grotesk:wght@700&display=swap" 
          rel="stylesheet" 
        />
        {/* PDF Libraries */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
        <script src="https://unpkg.com/pdf-lib/dist/pdf-lib.min.js"></script>
        <DynamicFavicon />
      </head>
      <body className="h-full overscroll-none select-none">
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>

        {/* PWA Service Worker Registration */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(registration) {
                  console.log('SW registered');
                }, function(err) {
                  console.log('SW failed: ', err);
                });
              });
            }
          `
        }} />
      </body>
    </html>
  );
}
