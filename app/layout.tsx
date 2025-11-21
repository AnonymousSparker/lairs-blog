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
  title: "Lairs.bug | Personal Blog",
  description: "Personal blog by Lairs.bug covering tech, life, and thoughts.",
  icons: {
    icon: '/asset/Logo.png', // Path to your logo in public/asset
    shortcut: '/asset/Logo.png',
    apple: '/asset/Logo.png', // Optional: for Apple devices
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