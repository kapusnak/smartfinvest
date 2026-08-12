import type { Metadata } from "next"
import { Instrument_Sans, Jost } from "next/font/google"

import { AppToaster } from "@/components/app-toaster"
import { BottomChrome } from "@/components/bottom-chrome"
import { ScrollToHash } from "@/components/scroll-to-hash"
import { SiteHeader } from "@/components/site-header"
import { getSiteUrlObject } from "@/lib/site-url"

import "./globals.css"

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
})

const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument",
  display: "swap",
})

const siteTitle = "Smart Finvest s.r.o. | Vymáhání pohledávek a správa pohledávek"
const siteDescription =
  "Inkasní kancelář — správa a vymáhání pohledávek pro věřitele. Smart Finvest s.r.o., Zlín. Navazující řešení i pro klienty."

export const metadata: Metadata = {
  metadataBase: getSiteUrlObject(),
  title: {
    default: siteTitle,
    template: "%s | Smart Finvest",
  },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    locale: "cs_CZ",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  icons: {
    icon: [{ url: "/images/favicon.png", type: "image/png" }],
    apple: "/images/favicon.png",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs" className={`${jost.variable} ${instrumentSans.variable}`}>
      <body className="min-h-screen font-sans">
        <SiteHeader />
        <ScrollToHash />
        {children}
        <BottomChrome />
        <AppToaster />
      </body>
    </html>
  )
}
