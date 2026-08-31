import { SITE_PHONES } from "@/lib/site-contact"

export type LeadSource = "calculator" | "popup" | "cta"

export type LeadPayload = {
  source: LeadSource
  phone: string
  email?: string
  name?: string
  amount?: number
  assetType?: string
  serviceType?: string
  propertyAddress?: string
  pagePath?: string
}

/** Brand + contact used in operator/client e-mails for this site. */
const SITE = {
  domain: "smartfinvest.cz",
  brandName: "Smart Finvest s.r.o.",
  contactEmail: "info@smartfinvest.cz",
  signOff: "Váš tým Smart Finvest s.r.o.",
  phones: SITE_PHONES,
} as const

const ACCENT = "#299583"
const CALLBACK_ONLY_SERVICE = "Není relevantní (Callback)"
const CALLBACK_ONLY_AMOUNT = "--- Pouze požadavek na zavolání ---"
const PLACEHOLDER = "---"

/**
 * Compact E.164-style number for `tel:` links (no spaces).
 * `+420 728 020 048` → `+420728020048`
 */
export function normalizePhoneForTel(phone: string): string {
  const trimmed = phone.trim()
  if (!trimmed) return ""
  const digits = trimmed.replace(/\D/g, "")
  if (digits.length === 12 && digits.startsWith("420")) return `+${digits}`
  if (digits.length === 9) return `+420${digits}`
  return trimmed.replace(/\s/g, "")
}

/** e.g. `+420728020048` → `+420 728 020 048` for readable e-mail body */
export function formatPhoneDisplayForNotification(phone: string): string {
  const trimmed = phone.trim()
  if (!trimmed) return ""
  let digits = trimmed.replace(/\D/g, "")
  if (digits.length >= 11 && digits.startsWith("420")) digits = digits.slice(3)
  const national = digits.slice(0, 9)
  if (national.length !== 9) return trimmed
  const groups = national.match(/.{1,3}/g)?.join(" ") ?? national
  return `+420 ${groups}`
}

/** Format amount for email: "1 800 000,- Kč" */
export function formatAmountCzk(value: number): string {
  const integer = Math.round(value)
  const withSpaces = integer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return `${withSpaces},- Kč`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function leadSourceUrl(): string {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim().replace(/\/$/, "")
  const cleaned = (origin || "—").replace(/^Odesláno z:\s*/i, "").trim()
  return cleaned || "—"
}

/** Hostname for notify subject, e.g. `[smartfinvest.cz]`. */
function notifyDomainTag(): string {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim()
  if (origin) {
    try {
      const host = new URL(origin.includes("://") ? origin : `https://${origin}`).hostname.replace(
        /^www\./,
        "",
      )
      if (host) return host
    } catch {
      /* fall through */
    }
  }
  return SITE.domain
}

function isCallbackOnly(source: LeadSource): boolean {
  return source === "cta" || source === "popup"
}

export type BuiltLeadEmails = {
  notifySubject: string
  notifyText: string
  notifyHtml: string
  clientSubject: string
  clientText: string
  clientHtml: string
  clientEmail: string
  phoneTel: string
  phoneDisplay: string
}

/** Operator notification HTML. */
function buildNotifyHtml(fields: {
  source: string
  name: string
  phoneTel: string
  phoneDisplay: string
  email: string
  propertyAddress: string
  serviceType: string
  amount: string
  ip: string
}): string {
  const emailCell = fields.email
    ? `<a href="mailto:${escapeHtml(fields.email)}" style="color: ${ACCENT}; text-decoration: none;">${escapeHtml(fields.email)}</a>`
    : escapeHtml(PLACEHOLDER)
  const phoneCell = fields.phoneTel
    ? `<a href="tel:${escapeHtml(fields.phoneTel)}" style="color: ${ACCENT}; text-decoration: none;">${escapeHtml(fields.phoneDisplay)}</a>`
    : escapeHtml(fields.phoneDisplay || PLACEHOLDER)

  return `
<div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333333; max-width: 450px; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #ffffff;">
  <div style="display: flex; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid ${ACCENT};">
    <div style="padding: 6px 10px; background-color: #e8f3f1; border-radius: 5px; font-size: 20px; line-height: 1;">
      <span style="color: ${ACCENT};">📩</span>
    </div>
    <div style="color: ${ACCENT}; font-size: 17px; font-weight: bold; margin-left: 10px;">
      NOVÁ POPTÁVKA K POSOUZENÍ
    </div>
  </div>
  <div style="padding: 10px 0;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      <tbody>
        <tr>
          <td style="padding: 5px 0; width: 45%; vertical-align: top;"><strong>Zdroj:</strong></td>
          <td style="padding: 5px 0; text-align: right;">${escapeHtml(fields.source)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; width: 45%;"><strong>Jméno klienta:</strong></td>
          <td style="padding: 5px 0; text-align: right;">${escapeHtml(fields.name)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0;"><strong>Telefon:</strong></td>
          <td style="padding: 5px 0; text-align: right;">${phoneCell}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0;"><strong>E-mail:</strong></td>
          <td style="padding: 5px 0; text-align: right;">${emailCell}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 5px 0; border-top: 1px dashed #cccccc;"></td>
        </tr>
        <tr>
          <td style="padding: 5px 0;"><strong>Adresa nemovitosti:</strong></td>
          <td style="padding: 5px 0; text-align: right; font-weight: 500;">${escapeHtml(fields.propertyAddress)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0;"><strong>Požadovaná služba:</strong></td>
          <td style="padding: 5px 0; text-align: right; font-weight: 500;">${escapeHtml(fields.serviceType)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0;"><strong>IP adresa:</strong></td>
          <td style="padding: 5px 0; text-align: right; font-weight: 500;">${escapeHtml(fields.ip)}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div style="margin-top: 20px; padding: 12px; background-color: #e8f3f1; border: 1px solid ${ACCENT}; border-radius: 6px; text-align: center;">
    <div style="font-size: 13px; color: ${ACCENT}; margin-bottom: 3px;">POŽADOVANÁ ČÁSTKA</div>
    <div style="font-size: 22px; font-weight: bold; color: ${ACCENT};">${escapeHtml(fields.amount)}</div>
  </div>
</div>`.trim()
}

/** Client confirmation HTML — footer uses this site's brand. */
function buildClientHtml(fields: {
  name: string
  serviceType: string
  amount: string
}): string {
  const phoneLines = SITE.phones
    .map(
      (p) =>
        `${escapeHtml(p.label)}: <a style="color: ${ACCENT}; text-decoration: none;" href="tel:${escapeHtml(p.tel)}">${escapeHtml(p.display)}</a>`,
    )
    .join("<br>\n      ")
  const contactEmail = SITE.contactEmail

  return `
<div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #ffffff;">
  <div style="color: ${ACCENT}; font-size: 20px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid ${ACCENT}; padding-bottom: 10px;">Dobrý den, děkujeme za Vaši poptávku!</div>
  <div style="margin-bottom: 25px;">Potvrzujeme, že Vaše žádost byla úspěšně přijata. Brzy se s Vámi spojíme.</div>
  <div style="padding: 15px; background-color: #f7f7f7; border-radius: 6px; border: 1px solid #e8f3f1;">
    <div style="color: #2c3e50; font-size: 16px; font-weight: bold; margin-bottom: 10px;">SHRNUTÍ VAŠÍ ŽÁDOSTI</div>
    <table style="width: 100%; border-collapse: collapse;" role="presentation">
      <tbody>
        <tr>
          <td style="padding: 5px 0; width: 50%;"><strong>Jméno:</strong></td>
          <td style="padding: 5px 0; text-align: right;">${escapeHtml(fields.name)}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0;"><strong>Typ služby:</strong></td>
          <td style="padding: 5px 0; text-align: right;">${escapeHtml(fields.serviceType)}</td>
        </tr>
      </tbody>
    </table>
    <div style="margin-top: 15px; padding: 10px; background-color: #e8f3f1; border: 1px solid ${ACCENT}; border-radius: 6px; text-align: center;">
      <div style="font-size: 13px; color: ${ACCENT}; margin-bottom: 3px;">POŽADOVANÁ ČÁSTKA</div>
      <div style="font-size: 20px; font-weight: bold; color: ${ACCENT};">${escapeHtml(fields.amount)}</div>
    </div>
  </div>
  <div style="margin-top: 30px; padding: 15px; border-left: 4px solid ${ACCENT}; background-color: #f0faf7; border-radius: 4px;">
    <h3 style="color: ${ACCENT}; margin-top: 0; font-size: 17px;">CO BUDE DÁL?</h3>
    <p>Vaši poptávku zpracujeme a ozveme se Vám s návrhem dalšího postupu — ať už jde o refinancování, řešení pohledávek, nebo financování na míru.</p>
    <p style="margin: 10px 0 0 0; line-height: 1.5; font-weight: normal;">Obvykle se Vám ozveme během jedné hodiny.</p>
  </div>
  <div style="margin-top: 30px; padding-top: 15px; border-top: 1px dashed #cccccc;">
    <h4 style="margin-bottom: 10px; font-size: 15px; color: ${ACCENT};">Spěcháte, nebo máte dotazy?</h4>
    <p style="margin: 5px 0;">📞 Telefon:<br>
      ${phoneLines}
    </p>
    <p style="margin: 5px 0;">📧 E-mail: <a style="color: ${ACCENT}; text-decoration: none;" href="mailto:${escapeHtml(contactEmail)}">${escapeHtml(contactEmail)}</a></p>
  </div>
  <div style="margin-top: 30px;">
    <p style="margin: 0;">Těšíme se na spolupráci!</p>
    <p style="margin: 5px 0 0 0;">S pozdravem,</p>
    <p style="margin: 0; font-weight: bold; color: ${ACCENT};">${escapeHtml(SITE.signOff)}</p>
  </div>
</div>`.trim()
}

export function buildLeadEmails(params: LeadPayload & { ip: string }): BuiltLeadEmails {
  const callback = isCallbackOnly(params.source)
  const propertyAddress = callback ? PLACEHOLDER : (params.propertyAddress?.trim() || PLACEHOLDER)
  const phoneTel = normalizePhoneForTel(params.phone)
  const phoneDisplay = formatPhoneDisplayForNotification(params.phone) || params.phone.trim()
  const name = callback ? PLACEHOLDER : (params.name?.trim() || PLACEHOLDER)
  const email = (params.email ?? "").trim()
  const serviceType = callback ? CALLBACK_ONLY_SERVICE : (params.serviceType?.trim() || PLACEHOLDER)
  const amount =
    params.amount != null
      ? formatAmountCzk(params.amount)
      : callback
        ? CALLBACK_ONLY_AMOUNT
        : PLACEHOLDER
  const sourceUrl = leadSourceUrl()
  const ip = params.ip.trim() || "neznámá"
  const pagePath = params.pagePath?.trim() || ""
  const sourceDisplay = pagePath ? `${sourceUrl}${pagePath}` : sourceUrl
  const domainTag = notifyDomainTag()

  const notifySubjectCore = callback
    ? `Callback – ${phoneDisplay}`
    : `Nová poptávka – ${name !== PLACEHOLDER ? name : phoneDisplay}`
  const notifySubject = `[${domainTag}] ${notifySubjectCore}`

  const notifyText = [
    `Zdroj: ${sourceDisplay}`,
    `Jméno klienta: ${name}`,
    `Telefon: ${phoneDisplay}`,
    `E-mail: ${email || PLACEHOLDER}`,
    `Adresa nemovitosti: ${propertyAddress}`,
    `Požadovaná služba: ${serviceType}`,
    `Částka: ${amount}`,
    `IP adresa: ${ip}`,
  ].join("\n")

  const notifyHtml = buildNotifyHtml({
    source: sourceDisplay,
    name,
    phoneTel: phoneTel || params.phone.trim(),
    phoneDisplay,
    email,
    propertyAddress,
    serviceType,
    amount,
    ip,
  })

  const clientNameForBody = callback ? PLACEHOLDER : name
  const clientSubject = `Potvrzení přijetí poptávky – ${SITE.brandName}`
  const phoneLinesText = SITE.phones.map((p) => `${p.label}: ${p.display}`).join("\n")
  const clientText = [
    "Dobrý den, děkujeme za Vaši poptávku!",
    "",
    "Potvrzujeme, že Vaše žádost byla úspěšně přijata. Brzy se s Vámi spojíme.",
    "",
    `Jméno: ${clientNameForBody}`,
    `Typ služby: ${serviceType}`,
    `Požadovaná částka: ${amount}`,
    "",
    "Obvykle se Vám ozveme během jedné hodiny.",
    "",
    "Telefon:",
    phoneLinesText,
    `E-mail: ${SITE.contactEmail}`,
    "",
    "S pozdravem,",
    SITE.signOff,
  ].join("\n")

  const clientHtml = buildClientHtml({
    name: clientNameForBody,
    serviceType,
    amount,
  })

  return {
    notifySubject,
    notifyText,
    notifyHtml,
    clientSubject,
    clientText,
    clientHtml,
    clientEmail: email,
    phoneTel: phoneTel || params.phone.trim(),
    phoneDisplay,
  }
}
