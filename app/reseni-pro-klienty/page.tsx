import type { Metadata } from "next"
import { Suspense } from "react"

import { Container } from "@/components/container"
import { Footer } from "@/components/footer"
import { LeadForm } from "@/components/lead-form"
import { ServiceCard } from "@/components/service-card"

export const metadata: Metadata = {
  title: "Řešení pro klienty",
  description:
    "Financování, refinancování, zajištěné úvěry a dočasný výkup. Nezávazná žádost online — Smart Finvest s.r.o.",
}

const clientServices = [
  {
    icon: "landmark" as const,
    title: "Financování na míru",
    short: "Zajistíme kapitál pro Vaše plány i rozvoj podnikání",
    details:
      "Klientům pomáháme zajistit individuální financování — ať už jde o refinancování závazků, rozvoj podnikání nebo individuální finanční potřeby. Zajišťujeme financování od menších částek až po vysoké objemy určené pro náročné projekty. Naším cílem je vytvářet oboustranně výhodná řešení, která přinesou stabilitu klientovi a jistotu investorovi.",
    partner: null as null | { href: string; label: string; logo: string; width: number },
  },
  {
    icon: "refreshCw" as const,
    title: "Refinancování na míru",
    short: "Lepší podmínky pro vaše závazky a zástavy nemovitostí.",
    details:
      "Pomáháme klientům získat výhodnější podmínky u závazků a zástav zajištěných nemovitostí. Spolupracujeme s finančními institucemi i soukromými investory, abychom dosáhli nižších splátek, prodloužení splatnosti nebo celkově udržitelnějšího nastavení financování.",
    partner: null,
  },
  {
    icon: "badgePercent" as const,
    title: "Zajištěné úvěry",
    short: "Prostředky se zajištěním nemovitosti či vozidla.",
    details:
      "Součástí naší nabídky je využití zástavy majetku — prostředky se zajištěním nemovitosti či vozidla. Pomáháme klientům najít řešení, které zohledňuje jejich situaci a dostupné zajištění.",
    partner: null,
  },
  {
    icon: "car" as const,
    title: "Dočasný výkup",
    short: "Dočasný výkup vozidel s možností zpětného odkupu.",
    details:
      "Součástí naší nabídky je také dočasný výkup vozidel s možností zpětného odkupu. Cílem je nabídnout klientům cestu, jak získat prostředky a zároveň si zachovat možnost vozidlo později odkoupit zpět.",
    partner: {
      href: "https://docasnyvykup.cz/",
      label: "docasnyvykup.cz",
      logo: "/images/partners/docasnyvykup.png",
      width: 140,
    },
  },
]

export default function ReseniProKlientyPage() {
  return (
    <>
      <main>
        <section
          className="bg-[var(--color-surface-cream)]/40 py-12 md:py-16"
          aria-label="Řešení pro klienty"
        >
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-[family-name:var(--font-instrument)] text-3xl font-semibold leading-tight tracking-[0.2px] text-[var(--color-foreground)] sm:text-4xl md:text-[2.15rem] md:leading-snug">
                Řešení pro klienty
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-body-foreground">
                Potřebujete vyřešit financování, konsolidaci závazků, vyplacení exekuce nebo získat
                prostředky se zajištěním nemovitosti či vozidla? Vyplňte nezávaznou žádost a společně
                najdeme nejvhodnější řešení.
              </p>
            </div>

            <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {clientServices.map((item) => (
                <ServiceCard
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  short={item.short}
                  details={item.details}
                  partner={item.partner}
                />
              ))}
            </div>
          </Container>
        </section>

        <section
          id="formular"
          className="bg-[var(--color-section-tint)] py-12 md:py-16"
          aria-label="Nezávazná žádost"
        >
          <Container>
            <div className="mx-auto max-w-xl">
              <h2 className="text-center font-[family-name:var(--font-instrument)] text-2xl font-semibold text-[var(--color-foreground)] md:text-[2.1rem]">
                Nezávazná žádost
              </h2>
              <p className="mt-2 text-center text-body-muted">
                Vyplňte formulář — ozveme se a společně najdeme nejvhodnější řešení.
              </p>
              <div className="mt-6 rounded-2xl border border-[var(--color-foreground)]/[0.08] bg-white p-5 shadow-sm sm:p-8">
                <Suspense fallback={null}>
                  <LeadForm />
                </Suspense>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
