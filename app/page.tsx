import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"
import { Check, Landmark, LineChart, Wallet } from "lucide-react"

import { Container } from "@/components/container"
import { Footer } from "@/components/footer"
import { FormularInlineLink } from "@/components/formular-inline-link"
import { Header } from "@/components/header"
import { LeadForm } from "@/components/lead-form"
import { SectionRule } from "@/components/section-rule"
import { ZavolejteTelLink } from "@/components/zavolejte-tel-link"

const heroImage =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80"

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section
          className="relative flex min-h-[min(72svh,560px)] items-center justify-center bg-[var(--color-surface-muted)] pt-[4.5rem] md:min-h-[min(88svh,880px)] md:pt-20"
          aria-label="Úvod"
        >
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-gradient-to-b from-[#0a3d5c]/75 via-[#0a3d5c]/55 to-[#0a3d5c]/80"
              aria-hidden
            />
          </div>
          <Container className="relative z-10 py-8 md:py-12 lg:py-20">
            <div className="mx-auto max-w-2xl text-center text-white">
              <h1 className="font-[family-name:var(--font-cardo)] text-3xl font-semibold leading-tight tracking-[-0.8px] sm:text-4xl md:text-[2.75rem] md:leading-snug">
                Finance a nemovitosti pod kontrolou
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-body-inverse text-white/90 md:mt-6">
                Pomůžeme s refinancováním nemovitosti, řešením pohledávek i investičním financováním — diskrétně a srozumitelně.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/#formular"
                  className="inline-flex min-h-[48px] w-full max-w-xs items-center justify-center rounded-full bg-[var(--color-cta)] px-8 text-sm font-semibold text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-cta-hover)] sm:w-auto"
                >
                  Nezávazná poptávka
                </Link>
                <p className="text-center text-sm text-white/85 sm:text-left">
                  Nebo zavolejte:{" "}
                  <ZavolejteTelLink variant="dark" className="text-white">
                    +420 776 680 720
                  </ZavolejteTelLink>
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section
          id="sluzby"
          className="scroll-mt-[var(--header-scroll-offset)] bg-[var(--color-background)] py-14 md:py-20"
          aria-label="Služby"
        >
          <Container>
            <h2 className="text-center font-[family-name:var(--font-cardo)] text-2xl font-bold text-[var(--color-foreground)] md:text-3xl">
              Naše služby
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-body-muted">
              Stejné zaměření jako na původním webu — přizpůsobíme řešení vaší situaci.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Landmark,
                  title: "Refinancování nemovitosti",
                  text: "Úprava zajištění a podmínek tak, aby dávaly smysl vašim plánům a cashflow.",
                },
                {
                  icon: Wallet,
                  title: "Řešení pohledávek",
                  text: "Strategie vymáhání a vyjednávání — hledáme realistickou cestu k úhradě.",
                },
                {
                  icon: LineChart,
                  title: "Financování a investice",
                  text: "Konzultace investičních a firemních potřeb v kontextu vašeho rizika a cílů.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[var(--color-foreground)]/[0.08] bg-white p-6 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-surface-cream)] text-[var(--color-primary)]">
                    <item.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-[family-name:var(--font-cardo)] text-lg font-semibold text-[var(--color-foreground)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-body-muted">{item.text}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section
          id="o-nas"
          className="scroll-mt-[var(--header-scroll-offset)] bg-[var(--color-surface-cream)] py-14 md:py-20"
          aria-label="O nás"
        >
          <Container>
            <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12">
              <div>
                <h2 className="font-[family-name:var(--font-cardo)] text-2xl font-bold text-[var(--color-foreground)] md:text-3xl">
                  Smart Finvest s.r.o.
                </h2>
                <SectionRule className="mt-4 bg-[var(--color-primary)]/25" />
                <p className="mt-4 text-body-muted">
                  Jsme tým konzultantů se sídlem ve Zlíně. Klientům pomáháme orientovat se v financích spojených s nemovitostmi —
                  od refinancování přes vymáhání až po investiční rozhodnutí.
                </p>
                <ul className="mt-6 space-y-2 text-body-foreground">
                  {["Diskrétní přístup", "Srozumitelná komunikace", "Rychlá zpětná vazba"].map((x) => (
                    <li key={x} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" aria-hidden />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-[var(--color-primary)]/15 bg-white p-6 shadow-sm md:p-8">
                <p className="text-body-muted">
                  Potřebujete projít vaši situaci krok za krokem? Vyplňte{" "}
                  <FormularInlineLink>nezávazný formulář</FormularInlineLink> — ozveme se a domluvíme další postup.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section
          id="formular"
          className="scroll-mt-[var(--header-scroll-offset)] bg-[var(--color-background)] py-14 md:py-20"
          aria-label="Nezávazná poptávka"
        >
          <Container>
            <div className="mx-auto max-w-lg">
              <h2 className="text-center font-[family-name:var(--font-cardo)] text-2xl font-bold text-[var(--color-foreground)] md:text-3xl">
                Nezávazná poptávka
              </h2>
              <p className="mt-3 text-center text-body-muted">
                Vyplňte údaje níže — stejný typ odeslání jako u projektu Dočasný výkup (EmailJS + potvrzení v prohlížeči).
              </p>
              <div className="mt-8 rounded-2xl border border-[var(--color-foreground)]/[0.08] bg-white p-5 shadow-sm sm:p-8">
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
