const DEFAULT = "https://smartfinvest.cz"

/**
 * `NEXT_PUBLIC_SITE_URL` musí být absolutní URL (s https://). Na Railway/CI často chybí schéma — doplníme.
 */
export function getSiteOrigin(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT).trim()
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw.replace(/^\/+/, "")}`
  try {
    return new URL(withScheme || DEFAULT).origin
  } catch {
    return new URL(DEFAULT).origin
  }
}

export function getSiteUrlObject(): URL {
  return new URL(getSiteOrigin())
}
