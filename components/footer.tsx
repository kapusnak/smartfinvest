import Link from "next/link"

import { Container } from "@/components/container"
import { SectionRule } from "@/components/section-rule"

export function Footer() {
  const year = new Date().getFullYear()
  const linkSubtle =
    "text-sm leading-normal text-white/65 no-underline transition-colors hover:text-white hover:underline hover:decoration-white/35 hover:underline-offset-2"

  return (
    <footer className="bg-[var(--color-footer)] text-white">
      <Container className="py-6 lg:py-7">
        <SectionRule className="bg-white/20" />

        <ul className="mt-4 flex flex-col items-center gap-1.5 sm:flex-row sm:justify-center sm:gap-6">
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

        <p className="mt-4 text-center text-xs leading-normal text-white/65">
          © {year} Smart Finvest s.r.o. Všechna práva vyhrazena.
        </p>
      </Container>
    </footer>
  )
}
