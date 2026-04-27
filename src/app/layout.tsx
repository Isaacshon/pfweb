import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PassionFruits - Radiant, communal, and effortlessly organized.",
  description: "Join a radiant community dedicated to holistic wellness, creative connection, and effortlessly organized lifestyles.",
};

import { LanguageProvider } from "@/context/LanguageContext";
import { DynamicFavicon } from "@/components/DynamicFavicon";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ffffff" />
        {/* Pretendard Font */}
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        {/* Material Symbols */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=add,arrow_back,auto_stories,chevron_left,chevron_right,close,dark_mode,edit_square,expand_more,favorite,format_quote,groups,history,history_edu,home,light_mode,location_on,more_horiz,notifications,payments,person,play_circle,profile,qr_code_scanner,remove,search,settings,share,translate,tune,volunteer_activism,volume_up" />
        {/* App Fonts: Plus Jakarta Sans & Space Grotesk */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Space+Grotesk:wght@700&display=swap" 
          rel="stylesheet" 
        />
        <DynamicFavicon />
      </head>
      <body className="min-h-full flex flex-col overscroll-none select-none">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
