import { cn } from "@/lib/utils"

/** Short centered hairline; not full content width. */
export function SectionRule({ className }: { className?: string }) {
  return (
    <div
      className={cn("mx-auto h-[0.5px] w-[min(72%,19rem)] shrink-0 bg-black/[0.12]", className)}
      aria-hidden
    />
  )
}
