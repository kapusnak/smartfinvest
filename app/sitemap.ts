import type { MetadataRoute } from "next"

export const dynamic = "force-static"

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://smartfinvest.cz"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: `${base}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/ochrana-osobnich-udaju`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/zasady-cookies`, lastModified, changeFrequency: "yearly", priority: 0.4 },
  ]
}
