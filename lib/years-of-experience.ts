/** Year activity / experience counting started. */
export const ACTIVITY_START_YEAR = 2000

/** Full calendar years of experience since {@link ACTIVITY_START_YEAR}. */
export function getYearsOfExperience(now: Date = new Date()): number {
  return Math.max(0, now.getFullYear() - ACTIVITY_START_YEAR)
}

/**
 * Czech plural for “year(s)”:
 * 1 rok · 2–4 roky · 5+ let (and teens 11–14 → let).
 */
export function czechYearsWord(years: number): string {
  const n = Math.abs(Math.trunc(years)) % 100
  const lastDigit = n % 10

  if (n >= 11 && n <= 14) return "let"
  if (lastDigit === 1) return "rok"
  if (lastDigit >= 2 && lastDigit <= 4) return "roky"
  return "let"
}

/** e.g. `"26 let"` */
export function formatYearsOfExperience(now: Date = new Date()): string {
  const years = getYearsOfExperience(now)
  return `${years} ${czechYearsWord(years)}`
}
