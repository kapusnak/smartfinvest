import Link from "next/link"

import { Container } from "@/components/container"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] bg-[var(--color-background)]">
        <Container className="py-20 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--color-primary)]">404</p>
          <h1 className="mt-2 font-[family-name:var(--font-instrument)] text-3xl font-semibold leading-tight text-[var(--color-foreground)]">
            Stránka nenalezena
          </h1>
          <p className="mx-auto mt-3 max-w-md text-body-muted">
            Odkaz může být neplatný nebo stránka byla přesunuta.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--color-primary)] px-8 text-sm font-semibold leading-snug text-white hover:bg-[var(--color-primary-hover)] md:text-base"
          >
            Zpět na úvod
          </Link>
        </Container>
      </main>
      <Footer />
    </>
  )
}
