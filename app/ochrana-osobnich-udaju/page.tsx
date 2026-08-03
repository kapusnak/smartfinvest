import type { Metadata } from "next"
import Link from "next/link"

import { Container } from "@/components/container"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: "Ochrana osobních údajů",
  description:
    "Informace o zpracování osobních údajů společností Smart Finvest s.r.o. v souladu s GDPR (text z původního webu smartfinvest.cz).",
}

export default function OchranaOsobnichUdajuPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-background)]">
        <section className="bg-[var(--color-primary)] pb-12 pt-10 md:pb-16 md:pt-14">
          <Container>
            <h1 className="text-center font-[family-name:var(--font-instrument)] text-3xl font-semibold leading-tight text-white md:text-4xl">
              Ochrana osobních údajů
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-center text-body-inverse">
              Smart Finvest s.r.o., IČ 23627000, Podvesná VII/6192, 760 01 Zlín
            </p>
          </Container>
        </section>

        <section className="py-12 lg:py-16">
          <Container>
            <article className="mx-auto max-w-3xl space-y-8 text-body-muted">
              <section>
                <h2 className="text-lg font-bold text-[var(--color-foreground)] md:text-xl">1. Úvod</h2>
                <p className="mt-3">
                  Tento dokument obsahuje informace o tom, jak společnost{" "}
                  <strong className="text-[var(--color-foreground)]">Smart Finvest s.r.o.</strong>, IČ: 23627000, se sídlem
                  Podvesná VII/6192, 760 01 Zlín (dále jen „Správce“ nebo „my“), jako správce osobních údajů, zpracovává vaše
                  osobní údaje v souladu s nařízením (EU) 2016/679 (GDPR) a dalšími platnými právními předpisy.
                </p>
                <p className="mt-3">
                  Cílem těchto zásad je poskytnout vám jasné informace o tom, jaké osobní údaje shromažďujeme, za jakým účelem,
                  jak s nimi nakládáme a jaká máte práva.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[var(--color-foreground)] md:text-xl">2. Jaké osobní údaje zpracováváme</h2>
                <p className="mt-3">
                  Pro účely navázání kontaktu a zpracování vaší poptávky prostřednictvím našeho webového formuláře zpracováváme
                  následující údaje:
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-6">
                  <li>
                    <strong className="text-[var(--color-foreground)]">Jméno a příjmení</strong>
                  </li>
                  <li>
                    <strong className="text-[var(--color-foreground)]">E-mailová adresa</strong>
                  </li>
                  <li>
                    <strong className="text-[var(--color-foreground)]">Telefonní číslo</strong>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[var(--color-foreground)] md:text-xl">3. Jak vaše údaje získáváme</h2>
                <p className="mt-3">
                  Vaše osobní údaje získáváme výhradně od vás, a to prostřednictvím webového formuláře na našich stránkách{" "}
                  <strong className="text-[var(--color-foreground)]">www.smartfinvest.cz</strong>.
                </p>
                <p className="mt-3">
                  Poskytnutí těchto údajů je zcela dobrovolné, ale je nezbytné pro to, abychom vás mohli kontaktovat a poskytnout
                  vám naše služby.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[var(--color-foreground)] md:text-xl">4. Účely a právní základ zpracování</h2>
                <p className="mt-3">
                  Vaše údaje slouží výhradně k tomu, abychom vás mohli zpětně kontaktovat ohledně vaší poptávky a projednat případnou
                  nabídku našich služeb.
                </p>
                <p className="mt-3">Vaše osobní údaje zpracováváme na základě:</p>
                <ul className="mt-3 list-disc space-y-1 pl-6">
                  <li>
                    <strong className="text-[var(--color-foreground)]">čl. 6 odst. 1 písm. b) GDPR</strong> – zpracování je
                    nezbytné pro provedení opatření přijatých před uzavřením smlouvy na vaši žádost (např. vytvoření nabídky,
                    zodpovězení dotazů),
                  </li>
                  <li>
                    <strong className="text-[var(--color-foreground)]">čl. 6 odst. 1 písm. f) GDPR</strong> – náš oprávněný zájem na
                    efektivní komunikaci se zájemci o naše služby.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[var(--color-foreground)] md:text-xl">5. Předání osobních údajů třetím stranám</h2>
                <p className="mt-3">
                  Vaše osobní údaje <strong className="text-[var(--color-foreground)]">nepředáváme žádným třetím stranám</strong>.
                  Zůstávají pouze u nás pro účely uvedené v tomto dokumentu, s výjimkou případů, kdy nám takovou povinnost ukládá
                  zákon (např. na vyžádání orgánů činných v trestním řízení).
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[var(--color-foreground)] md:text-xl">6. Doba uchování údajů</h2>
                <p className="mt-3">
                  Osobní údaje jsou uchovávány po dobu nezbytně nutnou k vyřízení vaší poptávky a související komunikaci. Pokud
                  nedojde k navázání smluvní spolupráce, budou vaše údaje smazány nejpozději do 6 měsíců od našeho posledního
                  kontaktu.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[var(--color-foreground)] md:text-xl">7. Cookies a online sledování</h2>
                <p className="mt-3">
                  Na našem webu používáme pouze{" "}
                  <strong className="text-[var(--color-foreground)]">technicky nezbytné (funkční) cookies</strong>, které zajišťují
                  správné fungování webových stránek a kontaktního formuláře.
                </p>
                <p className="mt-3">
                  <strong className="text-[var(--color-foreground)]">
                    Nepoužíváme žádné reklamní, marketingové ani pokročilé analytické cookies
                  </strong>{" "}
                  pro sledování vašeho chování na internetu.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[var(--color-foreground)] md:text-xl">8. Zabezpečení údajů</h2>
                <p className="mt-3">
                  Přijali jsme odpovídající technická a organizační opatření, aby vaše údaje byly v bezpečí a chráněny proti zneužití,
                  ztrátě nebo neoprávněnému zpřístupnění.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[var(--color-foreground)] md:text-xl">9. Vaše práva</h2>
                <p className="mt-3">V souvislosti se zpracováním osobních údajů máte následující práva:</p>
                <ul className="mt-3 list-disc space-y-1 pl-6">
                  <li>
                    právo na <strong className="text-[var(--color-foreground)]">přístup</strong> k osobním údajům,
                  </li>
                  <li>
                    právo na <strong className="text-[var(--color-foreground)]">opravu</strong> nepřesných údajů,
                  </li>
                  <li>
                    právo na <strong className="text-[var(--color-foreground)]">výmaz</strong> (tzv. právo „být zapomenut“),
                  </li>
                  <li>
                    právo na <strong className="text-[var(--color-foreground)]">omezení zpracování</strong>,
                  </li>
                  <li>
                    právo <strong className="text-[var(--color-foreground)]">vznést námitku</strong> proti zpracování,
                  </li>
                  <li>
                    právo na <strong className="text-[var(--color-foreground)]">přenositelnost</strong> údajů,
                  </li>
                  <li>
                    právo podat <strong className="text-[var(--color-foreground)]">stížnost</strong> u dozorového orgánu – Úřadu
                    pro ochranu osobních údajů (
                    <a
                      href="https://www.uoou.cz"
                      className="text-[var(--color-primary)] underline-offset-2 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      www.uoou.cz
                    </a>
                    ).
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[var(--color-foreground)] md:text-xl">10. Kontakt na Správce</h2>
                <p className="mt-3">
                  Pro uplatnění vašich práv nebo v případě jakýchkoliv dotazů ohledně zpracování vašich osobních údajů nás neváhejte
                  kontaktovat:
                </p>
                <p className="mt-3">
                  <strong className="text-[var(--color-foreground)]">Smart Finvest s.r.o.</strong>
                  <br />
                  Podvesná VII/6192, 760 01 Zlín
                </p>
                <p className="mt-3">
                  <strong className="text-[var(--color-foreground)]">E-mail:</strong>{" "}
                  <a href="mailto:info@smartfinvest.cz" className="text-[var(--color-primary)] underline-offset-2 hover:underline">
                    info@smartfinvest.cz
                  </a>
                  <br />
                  <strong className="text-[var(--color-foreground)]">Telefon:</strong>{" "}
                  <a href="tel:+420776680720" className="text-[var(--color-primary)] underline-offset-2 hover:underline">
                    +420 776 680 720
                  </a>
                </p>
                <p className="mt-8">
                  <Link href="/" className="text-[var(--color-primary)] font-medium underline-offset-2 hover:underline">
                    Zpět na úvod
                  </Link>
                </p>
              </section>
            </article>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
