import type { MetadataRoute } from "next"

import { getSiteOrigin } from "@/lib/site-url"

export const dynamic = "force-static"

const base = getSiteOrigin()

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: `${base}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/reseni-pro-klienty`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    { url: `${base}/ochrana-osobnich-udaju`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/zasady-cookies`, lastModified, changeFrequency: "yearly", priority: 0.4 },
  ]
}
