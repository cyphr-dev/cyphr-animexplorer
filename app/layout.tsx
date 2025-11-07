import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnimeProfileAvatar } from "@/components/AnimeProfileAvatar";
import AnimeHeader from "@/components/AnimeHeader";
import { ThemeProvider } from "@/components/ui/theme-provider";
import AnimeFooter from "@/components/AnimeFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Animexplorer - Discover Your Next Favorite Anime",
  description:
    "Explore and discover anime from around the world with Anime Explorer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnimeHeader />
          {children}
          <AnimeFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
