import type { Metadata } from "next"
import { Suspense } from "react"

import { Container } from "@/components/container"
import { Footer } from "@/components/footer"
import { LeadForm } from "@/components/lead-form"

export const metadata: Metadata = {
  title: "Nezávazná žádost",
  description:
    "Vyplňte nezávaznou žádost — ozveme se a společně najdeme nejvhodnější řešení. Smart Finvest s.r.o.",
}

export default function ZadostPage() {
  return (
    <>
      <main>
        <section
          className="scroll-mt-[5.5rem] bg-[var(--color-section-tint)] py-12 md:py-16"
          aria-label="Nezávazná žádost"
        >
          <Container>
            <div className="mx-auto max-w-xl">
              <h1 className="text-center font-[family-name:var(--font-instrument)] text-2xl font-semibold text-[var(--color-foreground)] md:text-[2.1rem]">
                Nezávazná žádost
              </h1>
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
