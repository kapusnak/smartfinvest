import type { Metadata } from "next"
import { Cardo, Inter } from "next/font/google"

import { AppToaster } from "@/components/app-toaster"
import { BottomChrome } from "@/components/bottom-chrome"
import { getSiteUrlObject } from "@/lib/site-url"

import "./globals.css"

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
})

const cardo = Cardo({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-cardo",
  display: "swap",
})

const siteTitle = "Smart Finvest s.r.o. | Refinancování, pohledávky, financování"
const siteDescription =
  "Refinancování nemovitostí, řešení pohledávek a financování na míru. Smart Finvest s.r.o., Zlín. Nezávazná poptávka online."

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
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs" className={`${inter.variable} ${cardo.variable}`}>
      <body className="min-h-screen font-sans">
        {children}
        <BottomChrome />
        <AppToaster />
      </body>
    </html>
  )
}
