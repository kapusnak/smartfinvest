import Image from "next/image"
import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

import { Container } from "@/components/container"
import { Footer } from "@/components/footer"
import { ServiceCard } from "@/components/service-card"
import { formatYearsOfExperience } from "@/lib/years-of-experience"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.85 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function getServices(yearsOfExperience: string) {
  return [
    {
      icon: "fileWarning" as const,
      title: "Vymáhání pohledávek",
      short: "Mimosoudní i soudní řešení pohledávek pro věřitele.",
      details: `Máme více než ${yearsOfExperience} zkušeností v oblasti správy a vymáhání pohledávek pro firmy i jednotlivce. Nabízíme mimosoudní řešení, soudní postupy i exekuce ve spolupráci s právníky. Naše práce je transparentní, efektivní a bez skrytých poplatků.`,
      partner: {
        href: "https://vymahanidluzniku.cz/",
        label: "vymahanidluzniku.cz",
        logo: "/images/partners/inkasni-kancelar.png",
        width: 175,
      },
    },
    {
      icon: "handshake" as const,
      title: "Odkup pohledávek a portfolií",
      short: "Odkup jednotlivých pohledávek i celých portfolií.",
      details:
        "Kromě inkasa zajišťujeme také odkup jednotlivých pohledávek i celých portfolií. Díky zkušenostem se správou pohledávek dokážeme nabídnout férový a rychlý postup pro věřitele, kteří chtějí pohledávky převést.",
      partner: null as null | { href: string; label: string; logo: string; width: number },
    },
    {
      icon: "shieldCheck" as const,
      title: "Upomínkový servis a prevence",
      short: "Upomínky a poradenství proti vzniku dlužných částek.",
      details:
        "Zajišťujeme upomínkový servis a poradenství v prevenci vzniku dlužných částek. Pomáháme věřitelům nastavit procesy tak, aby se pohledávky řešily včas a transparentně.",
      partner: null,
    },
  ]
}

/** Keep years-of-experience copy fresh after New Year without a full redeploy. */
export const revalidate = 86400

export default function HomePage() {
  const yearsOfExperience = formatYearsOfExperience()
  const services = getServices(yearsOfExperience)

  return (
    <>
      <main>
        <section
          className="relative flex min-h-[min(50svh,392px)] items-center justify-center md:min-h-[min(56svh,504px)]"
          aria-label="Úvod"
        >
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/images/zach-m-Cr6bktsH8PM-unsplash.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/40" aria-hidden />
          </div>
          <Container className="relative z-10 py-12 md:py-16 lg:py-20">
            <div className="mx-auto max-w-[565px] text-center text-white">
              <h1 className="font-[family-name:var(--font-instrument)] text-3xl font-semibold leading-tight tracking-[0.2px] sm:text-4xl md:text-[2.15rem] md:leading-snug">
                Správa a vymáhání
                <br />
                pohledávek
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-body-inverse tracking-[0.2px]">
                Inkasní kancelář s dlouholetou zkušeností — mimosoudní řešení, soudní postupy i odkup
                pohledávek.
              </p>
              <div className="mt-6 flex justify-center">
                <Link
                  href="/#kontakty"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-[25px] bg-[var(--color-cta)] px-8 text-sm font-semibold uppercase tracking-[0.2px] text-white transition-colors hover:bg-[var(--color-cta-hover)]"
                >
                  Kontaktujte nás
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section
          id="sluzby"
          className="bg-[var(--color-surface-cream)]/40 py-12 md:py-16"
          aria-label="Služby"
        >
          <Container>
            <div className="grid items-stretch gap-6 md:grid-cols-3 md:gap-7 lg:gap-8">
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
          className="bg-[var(--color-section-tint)] py-12 md:py-16"
          aria-label="Řešení pro klienty"
        >
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-[family-name:var(--font-instrument)] text-2xl font-semibold text-[var(--color-foreground)] md:text-[2.1rem]">
                Řešení pro klienty
              </h2>
              <p className="mt-4 text-body-foreground">
                Potřebujete jako klient aktivně vyřešit svou situaci? Nabízíme také financování,
                refinancování, zajištěné úvěry a dočasný výkup.
              </p>
              <div className="mt-6 flex justify-center">
                <Link
                  href="/reseni-pro-klienty"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-[25px] bg-[var(--color-cta)] px-8 text-sm font-semibold uppercase tracking-[0.2px] text-white transition-colors hover:bg-[var(--color-cta-hover)]"
                >
                  Zobrazit řešení pro klienty
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section
          id="kontakty"
          className="bg-white py-12 md:py-16"
          aria-label="O společnosti a kontakty"
        >
          <Container>
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-start">
              <div>
                <h2 className="font-[family-name:var(--font-instrument)] text-2xl font-semibold text-[var(--color-foreground)] md:text-[2.1rem]">
                  O společnosti
                </h2>
                <p className="mt-4 text-body-foreground">
                  Smart Finvest s.r.o. je společnost, která vznikla jako přirozený vývoj
                  dlouholetého podnikání v oblasti financí, investic a správy pohledávek. Naše kořeny
                  sahají více než {yearsOfExperience} zpět, kdy jsme působili jako fyzická osoba
                  podnikající v tomto oboru.
                </p>
                <p className="mt-4 text-body-foreground">
                  Máme rozsáhlé zkušenosti s řešením a správou pohledávek. Díky tomu dokážeme
                  věřitelům nabídnout komplexní služby inkasní kanceláře. Pro klienty, kteří chtějí
                  svou situaci aktivně řešit, nabízíme jako navazující možnost i refinancování
                  úvěrů a zástav nemovitostí, konsolidaci závazků i individuální financování.
                </p>
              </div>

              <div>
                <h2 className="font-[family-name:var(--font-instrument)] text-2xl font-semibold text-[var(--color-foreground)] md:text-[2.1rem]">
                  Kontaktujte nás
                </h2>

                <div className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
                  <Image
                    src="/images/logo-circle.png"
                    alt="Smart Finvest s.r.o. — Finance, investice, pohledávky"
                    width={148}
                    height={148}
                    className="h-[148px] w-[148px] shrink-0 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-lg font-semibold leading-snug text-[var(--color-foreground)] md:text-xl">
                      Smart Finvest s.r.o.
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-muted)] md:text-base">IČ: 23627000</p>
                  </div>
                </div>

                <ul className="mt-6 space-y-4">
                  <li className="flex gap-3">
                    <span
                      className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                      aria-hidden
                    >
                      <MapPin className="h-[1.125rem] w-[1.125rem]" strokeWidth={2.25} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-muted)]">Adresa</p>
                      <p className="mt-0.5 text-body-foreground">
                        Podvesná VII/6192
                        <br />
                        760 01 Zlín
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span
                      className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                      aria-hidden
                    >
                      <Mail className="h-[1.125rem] w-[1.125rem]" strokeWidth={2.25} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-muted)]">E-mail</p>
                      <a
                        href="mailto:info@smartfinvest.cz"
                        className="mt-0.5 inline-block text-body-foreground transition-colors hover:text-[var(--color-primary)]"
                      >
                        info@smartfinvest.cz
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span
                      className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                      aria-hidden
                    >
                      <Phone className="h-[1.125rem] w-[1.125rem]" strokeWidth={2.25} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-muted)]">Telefon</p>
                      <div className="mt-0.5 flex flex-col gap-0.5">
                        <a
                          href="tel:+420776680720"
                          className="text-body-foreground transition-colors hover:text-[var(--color-primary)]"
                        >
                          +420 776 680 720
                        </a>
                        <a
                          href="tel:+420777400256"
                          className="text-body-foreground transition-colors hover:text-[var(--color-primary)]"
                        >
                          +420 777 400 256
                        </a>
                      </div>
                    </div>
                  </li>
                </ul>

                <a
                  href="https://wa.me/420776680720"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex max-w-full items-center gap-3 rounded-xl border border-[#25D366]/45 bg-transparent px-4 py-3 transition-colors hover:border-[#25D366] hover:bg-[#25D366]/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/40 focus-visible:ring-offset-2"
                >
                  <WhatsAppIcon className="h-7 w-7 shrink-0 text-[#25D366]" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-snug text-[var(--color-foreground)] sm:text-base">
                      Napište nám na WhatsApp
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-[var(--color-muted)] sm:text-sm">
                      Rychlá zpráva — odpovíme co nejdříve
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
