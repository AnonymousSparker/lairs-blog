import type { Metadata } from "next";
import { Inter, Lora, JetBrains_Mono, Arimo } from "next/font/google";
import NextTopLoader from 'nextjs-toploader'; // <--- 1. IMPORT THIS
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
const sedgwick = Arimo({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-sedgwick", // <--- Crucial: Must be unique
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL('https://lairsbug-blogs.netlify.app'),
  title: {
    default: "Lairs.bug | Personal Blog",
    template: "%s"
  },
  description: "Personal blog by Lairs.bug covering tech, life, and thoughts.",
  verification: {
    google: 'YOUR_GSC_VERIFICATION_CODE_HERE', 
  },
  openGraph: {
    title: 'Lairs.bug | Personal Blog',
    description: 'Personal blog by Lairs.bug covering tech, life, and thoughts.',
    url: 'https://lairsbug-blogs.netlify.app',
    siteName: 'Lairs.bug',
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
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
        // 3. Add the variable to the body class list
        className={`${inter.variable} ${lora.variable} ${jetbrainsMono.variable} ${sedgwick.variable} antialiased`}
      >
        <NextTopLoader color="#8b5cf6" 
        initialPosition={0.08}
        crawlSpeed={300}
        height={5}        /* Nice thin bar */
        crawl={true}
        showSpinner={false} /* Spinners are annoying, bars are sleek */
        easing="ease"
        speed={200}
        />
        {children}
      </body>
    </html>
  );
}