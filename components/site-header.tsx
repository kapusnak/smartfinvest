"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, type MouseEvent } from "react"
import { Menu, X } from "lucide-react"

import { Container } from "@/components/container"
import { stashScrollHash, scrollToId } from "@/components/scroll-to-hash"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/#sluzby", label: "Vymáhání a správa pohledávek" },
  { href: "/reseni-pro-klienty", label: "Řešení pro klienty" },
  { href: "/#kontakty", label: "Kontakt" },
] as const

function splitHashHref(href: string): { path: string; hash: string | null } {
  const i = href.indexOf("#")
  if (i === -1) return { path: href || "/", hash: null }
  return { path: href.slice(0, i) || "/", hash: href.slice(i + 1) }
}

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const linkClass = (href: string) =>
    cn(
      "text-sm font-medium transition-colors hover:text-[var(--color-primary)]",
      href === "/reseni-pro-klienty" && pathname === "/reseni-pro-klienty"
        ? "text-[var(--color-primary)]"
        : "text-[var(--color-foreground)]",
    )

  const onNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false)
    const { path, hash } = splitHashHref(href)
    if (!hash) return

    // Same page: scroll after menu closes so header height is correct.
    if (pathname === path) {
      e.preventDefault()
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollToId(hash))
      })
      return
    }

    // Cross-page: stash hash so ScrollToHash runs after soft navigation.
    // Do NOT prevent default — let the <Link> handle the navigation itself.
    // Stash hash before the click propagates so ScrollToHash can read it on arrival.
    stashScrollHash(hash)
  }

  return (
    // Above phone-popup backdrop (z-48) so nav stays clickable while the sheet is open.
    <header className="sticky top-0 z-[60] border-b border-black/[0.06] bg-white/95 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between gap-4 md:h-[4.25rem]">
        <Link href="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)}>
          <Image
            src="/images/new-logo.png"
            alt="Smart Finvest s.r.o."
            width={160}
            height={51}
            className="h-9 w-auto sm:h-10"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Hlavní navigace">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(link.href)}
              onClick={(e) => onNavClick(e, link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg text-[var(--color-foreground)] transition-colors hover:bg-black/[0.04] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Zavřít menu" : "Otevřít menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" strokeWidth={2.25} /> : <Menu className="h-5 w-5" strokeWidth={2.25} />}
        </button>
      </Container>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-black/[0.06] bg-white md:hidden"
          aria-label="Mobilní navigace"
        >
          <Container className="flex flex-col gap-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-[var(--color-surface-cream)]",
                  linkClass(link.href),
                )}
                onClick={(e) => onNavClick(e, link.href)}
              >
                {link.label}
              </Link>
            ))}
          </Container>
        </nav>
      ) : null}
    </header>
  )
}
