import Link from "next/link"

import { Container } from "@/components/container"
import { SectionRule } from "@/components/section-rule"

export function Footer() {
  const year = new Date().getFullYear()
  const muted = "text-white/65"
  const linkSubtle =
    `${muted} no-underline transition-colors hover:text-white hover:underline hover:decoration-white/35 hover:underline-offset-2`
  const telLink =
    "font-medium text-white no-underline transition-colors hover:text-white hover:underline hover:decoration-white/40 hover:underline-offset-2"
  const bodySm = "text-sm leading-normal text-white"

  return (
    <footer id="kontakty" className="bg-[var(--color-footer)] text-white">
      <Container className="py-10 lg:py-12">
        <h2 className="mb-6 font-[family-name:var(--font-cardo)] text-xl font-semibold leading-tight tracking-tight text-white md:text-2xl lg:mb-8">
          Kontakty
        </h2>
        <div className="grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 min-[480px]:gap-8 lg:gap-10 lg:items-start">
          <div className="min-w-0 space-y-2">
            <p className="text-sm font-semibold text-white">Smart Finvest s.r.o.</p>
            <p className={bodySm}>
              <span className={muted}>Telefon: </span>
              <a href="tel:+420776680720" className={telLink}>
                +420 776 680 720
              </a>
            </p>
            <p className={bodySm}>
              <span className={muted}>E-mail: </span>
              <a href="mailto:info@smartfinvest.cz" className={linkSubtle}>
                info@smartfinvest.cz
              </a>
            </p>
            <ul className={`${bodySm} space-y-0.5`}>
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
            <div className={`mt-6 space-y-0.5 text-xs leading-snug ${muted}`}>
              <p className="font-medium text-white/95">Smart Finvest s.r.o.</p>
              <p>IČ: 23627000</p>
              <p>Podvesná VII/6192, 760 01 Zlín</p>
            </div>
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-semibold text-white ${bodySm}`}>Otevírací doba</p>
            <p className={`${bodySm} mt-2`}>Po–Pá 8:00–17:00</p>
            <p className={`mt-4 text-sm leading-snug ${muted}`}>
              Refinancování nemovitostí, řešení pohledávek a financování na míru. Nezávazná konzultace.
            </p>
          </div>
        </div>

        <div className={`mt-8 space-y-1.5 pt-5 text-center text-xs leading-normal ${muted}`}>
          <SectionRule className="mb-5 bg-white/20" />
          <p className="pt-0.5 text-white/95">© {year} Smart Finvest s.r.o. Všechna práva vyhrazena.</p>
        </div>
      </Container>
    </footer>
  )
}
