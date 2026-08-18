import type { Metadata } from "next";
import { Inter } from "next/font/google";
// global styles (mega-menu keyframes etc.)
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { UtmTracker } from "@/components/UtmTracker";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://gangatiram.in";
const title = "Ganga Tiram — 2,525 Kilometers of Heritage";
const description =
  "Her exact route, told through 75 sacred places — a printed book that funds the mission to keep her festivals, art, craft, and environment alive. Join the community.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s — Ganga Tiram",
  },
  description,
  keywords: [
    "Ganga",
    "Ganga Tiram",
    "Ganga book",
    "Dev Deepawali",
    "Varanasi ghats",
    "Indian heritage",
    "river conservation",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Ganga Tiram",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        <UtmTracker />
        <div className="page-enter flex grow flex-col">{children}</div>
      </body>
    </html>
  );
}
