import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  title: "PassionFruits - Radiant, communal, and effortlessly organized.",
  description: "Join a radiant community dedicated to holistic wellness, creative connection, and effortlessly organized lifestyles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${beVietnamPro.variable} h-full antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-body">
        {children}
      </body>
    </html>
  );
}
