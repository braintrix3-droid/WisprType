import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const headingFont = Outfit({ 
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"]
});

const bodyFont = Inter({ 
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"]
});

export const metadata: Metadata = {
  title: "WhisperType | Privacy-First Offline Voice Dictation",
  description: "Dictate instantly into any active app. 100% offline, privacy-first voice transcription powered by local AI and optimized for Apple Silicon and modern PCs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className={bodyFont.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
