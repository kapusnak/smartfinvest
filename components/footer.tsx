import Link from "next/link"

import { Container } from "@/components/container"
import { SectionRule } from "@/components/section-rule"

export function Footer() {
  const year = new Date().getFullYear()
  const linkSubtle =
    "text-sm leading-normal text-white/65 no-underline transition-colors hover:text-white hover:underline hover:decoration-white/35 hover:underline-offset-2"

  return (
    <footer id="kontakty" className="bg-[var(--color-footer)] text-white">
      <Container className="py-10 lg:py-12">
        <ul className="flex flex-col items-center gap-1.5 sm:flex-row sm:justify-center sm:gap-6">
          <li>
            <Link href="/ochrana-osobnich-udaju" className={linkSubtle}>
              Ochrana osobních údajů
            </Link>
          </li>
          <li>
            <Link href="/zasady-cookies" className={linkSubtle}>
              Zásady cookies
            </Link>
          </li>
        </ul>

        <div className="mt-8 space-y-1.5 pt-5 text-center text-xs leading-normal text-white/65">
          <SectionRule className="mb-5 bg-white/20" />
          <p className="pt-0.5 text-white/95">© {year} Smart Finvest s.r.o. Všechna práva vyhrazena.</p>
        </div>
      </Container>
    </footer>
  )
}
