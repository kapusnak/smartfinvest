import type { MetadataRoute } from "next"

import { getSiteOrigin } from "@/lib/site-url"

export const dynamic = "force-static"

const base = getSiteOrigin()

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  }
}
