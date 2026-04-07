import type { ReactNode } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

type Props = {
  children: ReactNode
  variant?: "cream" | "dark"
  /** Pre-select Nemovitost / Vozidlo when opening the lead form. */
  leadMode?: "nemovitosti" | "vozidlo"
  className?: string
}

function formularHref(leadMode?: "nemovitosti" | "vozidlo") {
  if (leadMode === "vozidlo") return "/?mode=vozidlo#formular"
  if (leadMode === "nemovitosti") return "/?mode=nemovitosti#formular"
  return "/#formular"
}

export function FormularInlineLink({ children, variant = "cream", leadMode, className }: Props) {
  const styles =
    variant === "dark"
      ? "font-medium text-inherit underline decoration-solid decoration-white/55 underline-offset-[3px] transition-colors hover:decoration-white hover:text-white"
      : "font-medium text-inherit underline decoration-solid decoration-[var(--color-primary)]/60 underline-offset-[3px] transition-colors hover:decoration-[var(--color-primary)] hover:text-[var(--color-primary)]"

  return (
    <Link
      href={formularHref(leadMode)}
      scroll
      className={cn(styles, className)}
      aria-label="Přejít k formuláři poptávky"
    >
      {children}
    </Link>
  )
}
