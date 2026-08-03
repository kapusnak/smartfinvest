const GOOGLE_ADS_LEAD_CONVERSION_SEND_TO =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_SEND_TO

/** Full lead form (same event name as hnedpenize calculator). */
export const GA_EVENT_FORMULAR = "vyplneny_formular"

/** Phone-only: popup. */
export const GA_EVENT_TELEFON = "telefonni_cislo"

/** Matches `LeadParams["source"]` in lib/send-lead.ts — kept local to avoid circular imports. */
export type LeadSource = "calculator" | "popup" | "cta"

/**
 * Fires exactly one GA4 event per successful lead when `gtag` is present.
 * Optionally fires Google Ads `conversion` when NEXT_PUBLIC_GOOGLE_ADS_LEAD_CONVERSION_SEND_TO is set.
 */
export function trackLeadGenerated(params: {
  source: LeadSource
  leadValue?: number
  /** e.g. /kontakty — for phone events (popup + CTA) */
  pagePath?: string
}): void {
  if (typeof window === "undefined") return
  const gtag = window.gtag
  if (!gtag) return

  if (params.source === "calculator") {
    const eventParams: Record<string, string | number> = {
      lead_source: params.source,
    }
    if (
      params.leadValue != null &&
      Number.isFinite(params.leadValue)
    ) {
      eventParams.currency = "CZK"
      eventParams.value = params.leadValue
    }
    gtag("event", GA_EVENT_FORMULAR, eventParams)
  } else {
    const eventParams: Record<string, string> = {
      lead_source: params.source,
    }
    if (params.pagePath) {
      eventParams.page_path = params.pagePath
    }
    gtag("event", GA_EVENT_TELEFON, eventParams)
  }

  const sendTo = GOOGLE_ADS_LEAD_CONVERSION_SEND_TO?.trim()
  if (sendTo) {
    gtag("event", "conversion", { send_to: sendTo })
  }
}
