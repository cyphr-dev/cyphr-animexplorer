import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnimeHeader from "@/components/AnimeHeader";
import { ThemeProvider } from "@/components/ui/theme-provider";
import AnimeFooter from "@/components/AnimeFooter";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Anime Explorer - Discover Your Next Favorite Anime",
    template: "%s | Anime Explorer",
  },
  description:
    "Discover and explore the world of anime. Browse the latest releases, most popular series, and timeless classics. Track your favorites and find your next anime to watch.",
  keywords: [
    "anime",
    "manga",
    "anime explorer",
    "anime list",
    "anime database",
    "watch anime",
    "anime recommendations",
    "anime tracker",
    "japanese animation",
  ],
  authors: [{ name: "Cyphr Dev" }],
  creator: "Cyphr Dev",
  publisher: "Cyphr Dev",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    // process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    "https://cyphr-animexplore.vercel.app"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Anime Explorer - Discover Your Next Favorite Anime",
    description:
      "Discover and explore the world of anime. Browse the latest releases, most popular series, and timeless classics.",
    url: "/",
    siteName: "Anime Explorer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Anime Explorer - Discover Your Next Favorite Anime",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anime Explorer - Discover Your Next Favorite Anime",
    description:
      "Discover and explore the world of anime. Browse the latest releases, most popular series, and timeless classics.",
    images: ["/og-image.png"],
    creator: "@cyphrdev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Anime Explorer",
  },
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
          <div className="overflow-x-clip">{children}</div>
          <AnimeFooter />
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
