export const REAL_ESTATE_AMOUNT_VALUES = (() => {
  const low: number[] = []
  for (let v = 100000; v <= 500000; v += 10000) low.push(v)
  const high: number[] = []
  for (let v = 600000; v <= 25000000; v += 100000) high.push(v)
  return [...low, ...high]
})()

export const REAL_ESTATE_RANGE = { min: 100000, max: 25000000 } as const

export function snapToRealEstateValue(value: number): number {
  if (value <= REAL_ESTATE_AMOUNT_VALUES[0]) return REAL_ESTATE_AMOUNT_VALUES[0]
  if (value >= REAL_ESTATE_AMOUNT_VALUES[REAL_ESTATE_AMOUNT_VALUES.length - 1]) {
    return REAL_ESTATE_AMOUNT_VALUES[REAL_ESTATE_AMOUNT_VALUES.length - 1]
  }
  let i = 0
  while (i < REAL_ESTATE_AMOUNT_VALUES.length - 1 && REAL_ESTATE_AMOUNT_VALUES[i + 1] < value) i += 1
  const a = REAL_ESTATE_AMOUNT_VALUES[i]
  const b = REAL_ESTATE_AMOUNT_VALUES[i + 1]
  return value - a <= b - value ? a : b
}

export function realEstateAmountToIndex(value: number): number {
  const snapped = snapToRealEstateValue(value)
  const idx = REAL_ESTATE_AMOUNT_VALUES.indexOf(snapped)
  return idx >= 0 ? idx : 0
}

export const DEFAULT_REAL_ESTATE_AMOUNT = 2000000

export function formatAmountKc(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1).replace(".0", "")} mil. Kč`
  }
  return `${(value / 1000).toFixed(0)} tis. Kč`
}

export function formatRangeLabelKc(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)} mil. Kč`
  }
  return `${(value / 1000).toFixed(0)} tis. Kč`
}

export const realEstateServices = [
  { value: "refinancovani-nemovitosti", label: "Refinancování nemovitosti" },
  { value: "reseni-pohledavek", label: "Řešení pohledávek" },
  { value: "financovani-a-investice", label: "Financování a investice" },
] as const

export type RealEstateServiceValue = (typeof realEstateServices)[number]["value"]

export const SOCIAL_PROOF_FALLBACK =
  "Klientům pomáháme s financováním a refinancováním — ozveme se vám obvykle ihned."
