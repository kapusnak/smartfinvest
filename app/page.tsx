import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"

import { Container } from "@/components/container"
import { Footer } from "@/components/footer"
import { LeadForm } from "@/components/lead-form"
import { ServiceCard } from "@/components/service-card"

const services = [
  {
    icon: "/images/icons/dum.png",
    title: "Refinancování na míru",
    short: "Lepší podmínky pro vaše závazky a zástavy nemovitostí.",
    details:
      "Pomáháme klientům získat výhodnější podmínky u závazků a zástav zajištěných nemovitostí. Spolupracujeme s finančními institucemi i soukromými investory, abychom dosáhli nižších splátek, prodloužení splatnosti nebo celkově udržitelnějšího nastavení financování.",
    partner: null as null | { href: string; label: string; logo: string; width: number },
  },
  {
    icon: "/images/icons/dluh.png",
    title: "Řešení dluhů a pohledávek",
    short: "Efektivní správa a vymáhání pohledávek.",
    details:
      "Máme více než 25 let zkušeností v oblasti správy a vymáhání pohledávek pro firmy i jednotlivce. Nabízíme mimosoudní řešení, soudní postupy i exekuce ve spolupráci s právníky. Kromě inkasa zajišťujeme také odkup jednotlivých pohledávek i celých portfolií, upomínkový servis a poradenství v prevenci vzniku dlužných částek. Naše práce je transparentní, efektivní a bez skrytých poplatků.",
    partner: {
      href: "https://vymahanidluzniku.cz/",
      label: "vymahanidluzniku.cz",
      logo: "/images/partners/inkasni-kancelar.png",
      width: 175,
    },
  },
  {
    icon: "/images/icons/financovani.png",
    title: "Financování na míru",
    short: "Zajistíme kapitál pro Vaše plány i rozvoj podnikání",
    details:
      "Klientům pomáháme zajistit individuální financování – ať už jde o refinancování závazků, rozvoj podnikání nebo využití zástavy majetku. Součástí naší nabídky je také dočasný výkup vozidel s možností zpětného odkupu. Zajišťujeme financování od menších částek až po vysoké objemy určené pro náročné projekty. Naším cílem je vytvářet oboustranně výhodná řešení, která přinesou stabilitu klientovi a jistotu investorovi.",
    partner: {
      href: "https://docasnyvykup.cz/",
      label: "docasnyvykup.cz",
      logo: "/images/partners/docasnyvykup.png",
      width: 107,
    },
  },
]

export default function HomePage() {
  return (
    <>
      <main>
        <section
          className="relative flex min-h-[min(72svh,560px)] items-center justify-center md:min-h-[min(80svh,720px)]"
          aria-label="Úvod"
        >
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/images/hero.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[50%_90%]"
            />
            <div className="absolute inset-0 bg-black/25" aria-hidden />
          </div>
          <Container className="relative z-10 py-12 md:py-16 lg:py-20">
            <div className="mx-auto max-w-[565px] text-center text-white">
              <h1 className="font-[family-name:var(--font-instrument)] text-3xl font-semibold leading-tight tracking-[0.2px] sm:text-4xl md:text-[2.15rem] md:leading-snug">
                Refinancování nemovitostí
                <br />a závazků na míru
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-body-inverse tracking-[0.2px]">
                Pomůžeme Vám sloučit splátky, získat výhodnější podmínky.
              </p>
              <div className="mt-6 flex justify-center">
                <Link
                  href="/#formular"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-[25px] bg-[var(--color-primary)] px-8 text-sm font-semibold uppercase tracking-[0.2px] text-white transition-colors hover:bg-[var(--color-primary-hover)]"
                >
                  Nezávazná konzultace zdarma
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section
          id="sluzby"
          className="bg-white py-12 md:py-16"
          aria-label="Služby"
        >
          <Container>
            <div className="grid items-start gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
              {services.map((item) => (
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
          aria-label="Formulář a kontakty"
        >
          <Container>
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-start">
              <div>
                <h2 className="font-[family-name:var(--font-instrument)] text-2xl font-semibold text-[var(--color-foreground)] md:text-[2.1rem]">
                  Nezávazná poptávka
                </h2>
                <p className="mt-2 text-body-muted">
                  Vyplňte formulář — ozveme se a domluvíme další postup.
                </p>
                <div className="mt-6 rounded-2xl border border-[var(--color-foreground)]/[0.08] bg-white p-5 shadow-sm sm:p-8">
                  <Suspense fallback={null}>
                    <LeadForm />
                  </Suspense>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="font-[family-name:var(--font-instrument)] text-2xl font-semibold text-[var(--color-foreground)] md:text-[2.1rem]">
                    O společnosti
                  </h2>
                  <p className="mt-4 text-body-foreground">
                    Smart Finvest s.r.o. je mladá společnost, která vznikla jako přirozený vývoj dlouholetého
                    podnikání v oblasti financí, investic a správy pohledávek. Naše kořeny sahají více než 25
                    let zpět, kdy jsme působili jako fyzická osoba podnikající v tomto oboru.
                  </p>
                  <p className="mt-4 text-body-foreground">
                    Máme rozsáhlé zkušenosti nejen s financemi a investicemi, ale také s řešením a správou
                    pohledávek. Díky tomu dokážeme klientům nabídnout komplexní služby, které zohledňují i
                    složitější finanční situace. Naším cílem je pomáhat klientům nacházet řešení v oblasti
                    refinancování úvěrů a zástav nemovitostí, konsolidace závazků i individuálních finančních
                    potřeb.
                  </p>
                </div>

                <div>
                  <h2 className="font-[family-name:var(--font-instrument)] text-2xl font-semibold text-[var(--color-foreground)] md:text-[2.1rem]">
                    Kontaktujte nás
                  </h2>
                  <div className="mt-4 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="space-y-3 text-body-foreground">
                      <p>
                        <strong>Smart Finvest s.r.o.</strong>
                        <br />
                        IČ: 23627000
                        <br />
                        Podvesná VII/6192
                        <br />
                        760 01 Zlín
                      </p>
                      <p>
                        E-mail:{" "}
                        <a
                          href="mailto:info@smartfinvest.cz"
                          className="underline underline-offset-2 hover:text-[var(--color-primary)]"
                        >
                          info@smartfinvest.cz
                        </a>
                      </p>
                      <p>
                        Telefon:
                        <br />
                        <a href="tel:+420777400256" className="hover:text-[var(--color-primary)]">
                          +420 777 400 256
                        </a>
                        <br />
                        <a href="tel:+420776680720" className="hover:text-[var(--color-primary)]">
                          +420 776 680 720
                        </a>
                      </p>
                      <p>
                        Pošlete společnosti Smart Finvest s.r.o. zprávu přes{" "}
                        <a
                          href="https://wa.me/420777400256"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-primary)] underline-offset-2 hover:underline"
                        >
                          WhatsApp
                        </a>
                      </p>
                    </div>
                    <div className="flex justify-center sm:justify-end">
                      <Image
                        src="/images/logo-circle.png"
                        alt="Smart Finvest s.r.o. — Finance, investice, pohledávky"
                        width={190}
                        height={190}
                        className="h-[190px] w-[190px] rounded-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
