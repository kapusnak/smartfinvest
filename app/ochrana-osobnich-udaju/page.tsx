import type { Metadata } from "next"
import Link from "next/link"

import { Container } from "@/components/container"
import { Footer } from "@/components/footer"
import { SITE_PHONES } from "@/lib/site-contact"

export const metadata: Metadata = {
  title: "Ochrana osobních údajů",
  description:
    "Informace o zpracování osobních údajů společností Smart Finvest s.r.o. v souladu s GDPR (text z původního webu smartfinvest.cz).",
}

export default function OchranaOsobnichUdajuPage() {
  return (
    <>
      <main className="min-h-screen bg-[var(--color-background)]">
        <section className="bg-[var(--color-primary)] pb-12 pt-10 md:pb-16 md:pt-14">
          <Container>
            <p className="mb-4 text-center">
              <Link href="/" className="text-sm text-white/85 underline-offset-2 hover:text-white hover:underline">
                Zpět na hlavní stránku
              </Link>
            </p>
            <h1 className="text-center font-[family-name:var(--font-instrument)] text-3xl font-semibold leading-tight text-white md:text-4xl">
              Ochrana osobních údajů
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-center text-body-inverse">
              Smart Finvest s.r.o., IČ 23627000, Podvesná VII/6192, 760 01 Zlín
            </p>
            <p className="mt-2 text-center text-sm text-white/80">Aktualizováno: 8. 10. 2026</p>
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
                  Pro účely navázání kontaktu a zpracování vaší poptávky prostřednictvím webových formulářů, telefonické či
                  e-mailové komunikace zpracováváme zejména:
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
                <p className="mt-3">
                  Z veřejně dostupných zdrojů a veřejných evidencí můžeme pro zaslání nabídky našich služeb poštou zpracovávat
                  zejména:
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-6">
                  <li>
                    <strong className="text-[var(--color-foreground)]">Jméno a příjmení</strong>
                  </li>
                  <li>
                    <strong className="text-[var(--color-foreground)]">Adresu</strong>
                  </li>
                  <li>
                    <strong className="text-[var(--color-foreground)]">
                      Základní veřejně dostupné údaje vztahující se k nemovitosti
                    </strong>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[var(--color-foreground)] md:text-xl">3. Jak vaše údaje získáváme</h2>
                <p className="mt-3">
                  Osobní údaje získáváme přímo od Vás prostřednictvím webových formulářů, telefonické či e-mailové komunikace a
                  dále z veřejně dostupných zdrojů a veřejných evidencí, zejména z katastru nemovitostí, ARES, veřejných rejstříků,
                  živnostenského rejstříku, insolvenčního rejstříku a dalších zákonně zveřejňovaných zdrojů.
                </p>
                <p className="mt-3">
                  Poskytnutí údajů, které nám sdělíte přímo, je zcela dobrovolné, ale je nezbytné pro to, abychom vás mohli
                  kontaktovat a poskytnout vám naše služby.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[var(--color-foreground)] md:text-xl">4. Účely a právní základ zpracování</h2>
                <p className="mt-3">
                  Vaše údaje slouží k tomu, abychom vás mohli zpětně kontaktovat ohledně vaší poptávky a projednat případnou nabídku
                  našich služeb. V případech, kdy jsou splněny zákonné podmínky, je zpracováváme také za účelem zaslání nabídky
                  našich služeb poštou.
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
                    efektivní komunikaci se zájemci o naše služby,
                  </li>
                  <li>
                    <strong className="text-[var(--color-foreground)]">čl. 6 odst. 1 písm. f) GDPR</strong> – oprávněný zájem
                    správce na přímém marketingu (zaslání nabídky poštou).
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[var(--color-foreground)] md:text-xl">
                  Poštovní nabídky a veřejně dostupné zdroje
                </h2>
                <p className="mt-3">
                  Základní identifikační a adresní údaje získané z veřejně dostupných zdrojů a veřejných evidencí můžeme v
                  případech, kdy jsou splněny zákonné podmínky, zpracovávat také za účelem zaslání nabídky našich služeb poštou.
                  Jedná se zejména o jméno, příjmení, adresu a základní veřejně dostupné údaje vztahující se k nemovitosti. Právním
                  základem zpracování je oprávněný zájem správce na přímém marketingu dle čl. 6 odst. 1 písm. f) GDPR.
                </p>
                <div className="mt-4 rounded-2xl border border-[var(--color-primary)]/35 bg-[var(--color-accent-warm)] p-5 shadow-sm">
                  <p className="font-bold text-[var(--color-foreground)]">
                    Máte právo kdykoliv a bezplatně vznést námitku proti zpracování osobních údajů pro účely přímého marketingu. Po
                    uplatnění námitky nebudou Vaše osobní údaje pro tento účel dále zpracovávány.
                  </p>
                  <p className="mt-3 font-semibold text-[var(--color-foreground)]">
                    Námitku můžete uplatnit e-mailem na{" "}
                    <a
                      href="mailto:info@smartfinvest.cz"
                      className="text-[var(--color-primary)] underline-offset-2 hover:underline"
                    >
                      info@smartfinvest.cz
                    </a>{" "}
                    nebo dopisem na adresu správce.
                  </p>
                </div>
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
                  Osobní údaje získané v souvislosti s vaší poptávkou jsou uchovávány po dobu nezbytně nutnou k jejímu vyřízení a
                  související komunikaci. Pokud nedojde k navázání smluvní spolupráce, budou tyto údaje smazány nejpozději do 6
                  měsíců od našeho posledního kontaktu.
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
                  <strong className="text-[var(--color-foreground)]">Telefon:</strong>
                </p>
                <ul className="mt-2 space-y-1">
                  {SITE_PHONES.map((phone) => (
                    <li key={phone.tel}>
                      {phone.label}:{" "}
                      <a
                        href={`tel:${phone.tel}`}
                        className="text-[var(--color-primary)] underline-offset-2 hover:underline"
                      >
                        {phone.display}
                      </a>
                    </li>
                  ))}
                </ul>
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
