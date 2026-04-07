const MAX_DIGITS = 9

/** National part only (9 digits), grouped with spaces — for the editable input next to a fixed +420 label. */
export function formatNationalDisplay(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, MAX_DIGITS)
  const groups = d.match(/.{1,3}/g) ?? []
  return groups.join(" ")
}

export function parsePhoneDigits(raw: string): string {
  let d = raw.replace(/\D/g, "")
  if (d.length > MAX_DIGITS && d.startsWith("420")) {
    d = d.slice(3)
  }
  return d.slice(0, MAX_DIGITS)
}

export function toFullPhone(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, MAX_DIGITS)
  return d.length === MAX_DIGITS ? `+420${d}` : ""
}
