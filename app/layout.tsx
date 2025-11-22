import type { Metadata } from "next";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lairs.bug | Personal Blog",
    template: "%s | Lairs.bug" // Makes titles look like "My Post | Lairs.bug"
  },
  description: "Personal blog by Lairs.bug covering tech, life, and thoughts.",
  
  icons: {
    icon: '/icon.png', // points to app/icon.png
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  metadataBase: new URL('https://lairsbug-blogs.netlify.app'),

  // 2. Google Search Console Verification
  verification: {
    // You get this code from Google Search Console (I'll explain how below)
    google: 'RYKnbQatu3BV67Mj3CdDF5RE-8TJoLnNhtyYG14FLQw', 
  },
  
  // 3. Basic OpenGraph (Social Sharing) setup
  openGraph: {
    title: 'Lairs.bug | Personal Blog',
    description: 'Personal blog by Lairs.bug covering tech, life, and thoughts.',
    url: 'https://lairsbug-blogs.netlify.app',
    siteName: 'Lairs.bug',
    locale: 'en_US',
    type: 'website',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        // Note: We don't need to add bg-colors here anymore, we do it in CSS
        className={`${inter.variable} ${lora.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}