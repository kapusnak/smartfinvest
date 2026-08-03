"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller, useWatch, type FieldErrors } from "react-hook-form"
import { z } from "zod"
import { Building2, Car, Check, Loader2, Lock, TrendingUp } from "lucide-react"
import { toast } from "sonner"

import { Slider } from "@/components/ui/slider"
import { SliderTouchLock } from "@/components/slider-touch-lock"
import { sendLead } from "@/lib/emailjs"
import {
  CAR_AMOUNT_VALUES,
  CAR_RANGE,
  DEFAULT_CAR_AMOUNT,
  DEFAULT_REAL_ESTATE_AMOUNT,
  REAL_ESTATE_AMOUNT_VALUES,
  REAL_ESTATE_RANGE,
  SOCIAL_PROOF_FALLBACK,
  carAmountToIndex,
  formatAmountKc,
  formatRangeLabelKc,
  realEstateAmountToIndex,
  realEstateServices,
  snapToCarValue,
  snapToRealEstateValue,
} from "@/lib/lead-form-scales"
import { PhoneDigitsInput } from "@/components/phone-digits-input"
import { toFullPhone } from "@/lib/phone-420"
import { cn } from "@/lib/utils"

const inputClass =
  "h-12 w-full rounded-xl border border-black/20 bg-white px-4 text-base text-[var(--color-foreground)] shadow-sm outline-none transition-[box-shadow] focus:ring-2 focus:ring-[var(--color-primary)]"

const phoneInputWrapperClass =
  "h-12 w-full rounded-xl border border-black/20 bg-white px-4 text-base text-[var(--color-foreground)] shadow-sm outline-none transition-[box-shadow] focus-within:ring-2 focus-within:ring-[var(--color-primary)]"

const serviceTypeEnum = z.enum(["zpetny-leasing", "zastava", "primy-vykup", "bez-zajisteni"])

const leadFormSchema = z
  .object({
    assetMode: z.enum(["nemovitosti", "vozidlo"]),
    name: z.string(),
    email: z.string(),
    phoneDigits: z.string(),
    serviceType: serviceTypeEnum,
    amountCzk: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    vehicleModel: z.string(),
    year: z.string(),
    mileage: z.string(),
    vin: z.string(),
    vehicleAmountCzk: z.number(),
  })
  .superRefine((data, ctx) => {
    if (!z.string().email().safeParse(data.email).success) {
      ctx.addIssue({ code: "custom", message: "Zadejte platný e-mail.", path: ["email"] })
    }
    const phoneOk = toFullPhone(data.phoneDigits) !== ""
    if (!phoneOk) {
      ctx.addIssue({
        code: "custom",
        message: "Zadejte platné telefonní číslo (9 číslic).",
        path: ["phoneDigits"],
      })
    }

    if (data.assetMode === "nemovitosti") {
      if (data.name.trim().length < 2) {
        ctx.addIssue({ code: "custom", message: "Zadejte jméno.", path: ["name"] })
      }
      if (data.amountCzk < REAL_ESTATE_RANGE.min || data.amountCzk > REAL_ESTATE_RANGE.max) {
        ctx.addIssue({ code: "custom", message: "Neplatná částka.", path: ["amountCzk"] })
      }
    } else {
      if (data.firstName.trim().length < 1) {
        ctx.addIssue({ code: "custom", message: "Zadejte jméno.", path: ["firstName"] })
      }
      if (data.lastName.trim().length < 1) {
        ctx.addIssue({ code: "custom", message: "Zadejte příjmení.", path: ["lastName"] })
      }
      if (data.vehicleModel.trim().length < 1) {
        ctx.addIssue({ code: "custom", message: "Zadejte značku a model.", path: ["vehicleModel"] })
      }
      if (data.year.trim().length < 2) {
        ctx.addIssue({ code: "custom", message: "Zadejte rok výroby.", path: ["year"] })
      }
      if (data.mileage.trim().length < 1) {
        ctx.addIssue({ code: "custom", message: "Zadejte počet kilometrů.", path: ["mileage"] })
      }
      if (data.vehicleAmountCzk < CAR_RANGE.min || data.vehicleAmountCzk > CAR_RANGE.max) {
        ctx.addIssue({ code: "custom", message: "Neplatná částka.", path: ["vehicleAmountCzk"] })
      }
    }
  })

type LeadFormValues = z.infer<typeof leadFormSchema>

function emptyVozidloFields() {
  return {
    firstName: "",
    lastName: "",
    vehicleModel: "",
    year: "",
    mileage: "",
    vin: "",
    vehicleAmountCzk: snapToCarValue(DEFAULT_CAR_AMOUNT),
  }
}

function emptyNemovitostiFields() {
  return {
    name: "",
    serviceType: "zpetny-leasing" as LeadFormValues["serviceType"],
    amountCzk: snapToRealEstateValue(DEFAULT_REAL_ESTATE_AMOUNT),
  }
}

/** Query `mode` wins over section hash (#vozidla / #nemovitosti). #formular alone does not imply a mode. */
function readLeadModeFromLocation(): "nemovitosti" | "vozidlo" | null {
  if (typeof window === "undefined") return null
  const params = new URLSearchParams(window.location.search)
  const q = params.get("mode")
  if (q === "vozidlo" || q === "nemovitosti") return q
  const h = window.location.hash
  if (h === "#vozidla") return "vozidlo"
  if (h === "#nemovitosti") return "nemovitosti"
  return null
}

export function LeadForm() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const modeQuery = searchParams.get("mode")
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const socialProofText = SOCIAL_PROOF_FALLBACK

  const defaultValues: LeadFormValues = {
    assetMode: "nemovitosti",
    ...emptyNemovitostiFields(),
    email: "",
    phoneDigits: "",
    ...emptyVozidloFields(),
  }

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })

  const assetMode = useWatch({ control: form.control, name: "assetMode" })
  const amountCzk = useWatch({ control: form.control, name: "amountCzk" })
  const vehicleAmountCzk = useWatch({ control: form.control, name: "vehicleAmountCzk" })
  const serviceType = useWatch({ control: form.control, name: "serviceType" })

  useEffect(() => {
    const syncFromUrl = () => {
      const mode = readLeadModeFromLocation()
      if (!mode) return
      const email = form.getValues("email")
      const phoneDigits = form.getValues("phoneDigits")
      if (mode === "vozidlo") {
        form.reset({
          assetMode: "vozidlo",
          email,
          phoneDigits,
          ...emptyNemovitostiFields(),
          name: "",
          ...emptyVozidloFields(),
        })
      } else {
        form.reset({
          assetMode: "nemovitosti",
          email,
          phoneDigits,
          ...emptyNemovitostiFields(),
          ...emptyVozidloFields(),
        })
      }
      setStatus("idle")
    }
    syncFromUrl()
    window.addEventListener("hashchange", syncFromUrl)
    return () => window.removeEventListener("hashchange", syncFromUrl)
  }, [form, modeQuery])

  const switchMode = useCallback(
    (mode: "nemovitosti" | "vozidlo") => {
      const email = form.getValues("email")
      const phoneDigits = form.getValues("phoneDigits")
      if (mode === "vozidlo") {
        form.reset({
          assetMode: "vozidlo",
          email,
          phoneDigits,
          ...emptyNemovitostiFields(),
          name: "",
          ...emptyVozidloFields(),
        })
      } else {
        form.reset({
          assetMode: "nemovitosti",
          email,
          phoneDigits,
          ...emptyNemovitostiFields(),
          ...emptyVozidloFields(),
        })
      }
      setStatus("idle")
    },
    [form],
  )

  const maxIdx = REAL_ESTATE_AMOUNT_VALUES.length - 1
  const valueIndex = realEstateAmountToIndex(amountCzk)
  const maxIdxCar = CAR_AMOUNT_VALUES.length - 1
  const valueIndexCar = carAmountToIndex(vehicleAmountCzk)

  const onSubmit = async (values: LeadFormValues) => {
    if (status === "success") return
    const phone = toFullPhone(values.phoneDigits)
    if (!phone) return
    setStatus("sending")
    try {
      const pagePath = pathname ?? ""
      let name: string
      let amount: number
      let assetType: string
      let serviceType: string
      if (values.assetMode === "nemovitosti") {
        name = values.name.trim()
        amount = snapToRealEstateValue(values.amountCzk)
        assetType = "Nemovitost"
        serviceType =
          realEstateServices.find((s) => s.value === values.serviceType)?.label ?? values.serviceType
      } else {
        name = `${values.firstName.trim()} ${values.lastName.trim()}`.trim()
        amount = snapToCarValue(values.vehicleAmountCzk)
        assetType = "Automobil"
        const vinPart = values.vin.trim() ? `, VIN ${values.vin.trim()}` : ""
        serviceType = `Peníze ihned a jezděte dál — ${values.vehicleModel.trim()}, r.v. ${values.year.trim()}, ${values.mileage.trim()} km${vinPart}`
      }
      await sendLead({
        source: "calculator",
        phone,
        email: values.email.trim() || undefined,
        name,
        amount,
        assetType,
        serviceType,
      })
      setStatus("success")
      toast.success("Děkujeme za poptávku", {
        id: "lead-form-success",
        description: "Brzy vás budeme kontaktovat. Zkontrolujte prosím i složku s nevyžádanou poštou.",
        duration: 5000,
      })
      const emailKeep = values.email
      const phoneKeep = values.phoneDigits
      if (values.assetMode === "nemovitosti") {
        form.reset({
          assetMode: "nemovitosti",
          email: emailKeep,
          phoneDigits: phoneKeep,
          ...emptyNemovitostiFields(),
          ...emptyVozidloFields(),
        })
      } else {
        form.reset({
          assetMode: "vozidlo",
          email: emailKeep,
          phoneDigits: phoneKeep,
          ...emptyNemovitostiFields(),
          name: "",
          ...emptyVozidloFields(),
        })
      }
    } catch (e) {
      setStatus("error")
      const hint = e instanceof Error ? e.message.trim() : ""
      const description =
        hint.length > 0 && hint.length <= 220
          ? hint
          : "Zkuste to prosím znovu nebo nás kontaktujte telefonicky. Podrobnosti jsou v konzoli prohlížeče (F12)."
      toast.error("Odeslání se nepovedlo", {
        id: "lead-form-error",
        description,
        duration: 9000,
      })
    }
  }

  const requiredStar = <span className="text-red-600">*</span>

  const onInvalid = (errors: FieldErrors<LeadFormValues>) => {
    const phoneErr = errors.phoneDigits?.message
    const emailErr = errors.email?.message
    if (typeof phoneErr === "string") {
      toast.error("Telefonní číslo", { id: "lead-invalid-phone", description: phoneErr, duration: 6500 })
    } else if (typeof emailErr === "string") {
      toast.error("E-mail", { id: "lead-invalid-email", description: emailErr, duration: 6500 })
    } else {
      toast.error("Zkontrolujte formulář", {
        id: "lead-invalid-generic",
        description: "Některá povinná pole nejsou vyplněna správně.",
        duration: 6500,
      })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="mx-auto w-full space-y-6">
      <div className="space-y-2">
        <p className="text-body font-medium text-[var(--color-muted)]">Typ poptávky</p>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => switchMode("nemovitosti")}
            className={cn(
              "flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all active:scale-[0.98] sm:text-base",
              assetMode === "nemovitosti"
                ? "border-[var(--color-primary)] bg-[var(--color-surface-cream)] text-[var(--color-primary)]"
                : "border-black/20 bg-white text-[var(--color-muted)] hover:border-[var(--color-primary)]/40",
            )}
          >
            <Building2 className="h-4 w-4 shrink-0" aria-hidden />
            Nemovitost
          </button>
          <button
            type="button"
            onClick={() => switchMode("vozidlo")}
            className={cn(
              "flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all active:scale-[0.98] sm:text-base",
              assetMode === "vozidlo"
                ? "border-[var(--color-primary)] bg-[var(--color-surface-cream)] text-[var(--color-primary)]"
                : "border-black/20 bg-white text-[var(--color-muted)] hover:border-[var(--color-primary)]/40",
            )}
          >
            <Car className="h-4 w-4 shrink-0" aria-hidden />
            Vozidlo
          </button>
        </div>
      </div>

      {assetMode === "nemovitosti" ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-surface-cream)] px-3 py-1.5 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary)]/45 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-primary)] ring-2 ring-white/70" />
              </span>
              <span className="text-xs font-semibold text-[var(--color-foreground)]">
                Konzultanti k dispozici • Ozveme se brzy
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-body font-medium text-[var(--color-muted)]" id="lead-service-label">
              Typ služby
            </p>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="lead-service-label">
              {realEstateServices.map((service) => (
                <button
                  key={service.value}
                  type="button"
                  role="radio"
                  aria-checked={serviceType === service.value}
                  onClick={() => form.setValue("serviceType", service.value)}
                  className={cn(
                    "min-w-0 flex-1 px-2 py-2.5 text-center text-xs font-medium leading-tight transition-all sm:min-w-[calc(50%-0.25rem)] sm:px-3 sm:text-sm lg:flex-1",
                    "rounded-xl border-2",
                    serviceType === service.value
                      ? "border-[var(--color-primary)] bg-[var(--color-surface-cream)] text-[var(--color-primary)]"
                      : "border-transparent bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:border-[var(--color-primary)]/30",
                  )}
                >
                  {service.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="lead-amount-slider" className="text-body font-medium text-[var(--color-muted)]">
                Požadovaná částka
              </label>
              <span className="text-base font-semibold text-[var(--color-primary)]">
                {formatAmountKc(snapToRealEstateValue(amountCzk))}
              </span>
            </div>
            <SliderTouchLock
              minIndex={0}
              maxIndex={maxIdx}
              valueIndex={valueIndex}
              onValueChange={(i) => form.setValue("amountCzk", REAL_ESTATE_AMOUNT_VALUES[i])}
            >
              <Slider
                id="lead-amount-slider"
                value={[valueIndex]}
                onValueChange={([i]) =>
                  form.setValue("amountCzk", REAL_ESTATE_AMOUNT_VALUES[i])
                }
                min={0}
                max={maxIdx}
                step={1}
                className="w-full"
                aria-label="Požadovaná částka"
              />
            </SliderTouchLock>
            <div className="flex justify-between text-xs text-[var(--color-muted)]">
              <span>{formatRangeLabelKc(REAL_ESTATE_RANGE.min)}</span>
              <span>{formatRangeLabelKc(REAL_ESTATE_RANGE.max)}</span>
            </div>
            <Controller
              name="amountCzk"
              control={form.control}
              render={({ field }) => <input type="hidden" {...field} value={field.value} readOnly />}
            />
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-[var(--color-primary)]/22 bg-[var(--color-accent-warm)] px-2.5 py-1.5">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary)]/12"
              aria-hidden
            >
              <TrendingUp className="h-3.5 w-3.5 text-[var(--color-primary)]" strokeWidth={2.25} />
            </div>
            <p className="text-xs font-medium leading-snug text-[var(--color-foreground)]">{socialProofText}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div>
              <label htmlFor="lead-name" className="mb-1.5 block text-body font-medium text-[var(--color-foreground)]">
                Jméno a příjmení {requiredStar}
              </label>
              <input
                id="lead-name"
                autoComplete="name"
                className={inputClass}
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="lead-phone-nem" className="mb-1.5 block text-body font-medium text-[var(--color-foreground)]">
                Telefon {requiredStar}
              </label>
              <Controller
                name="phoneDigits"
                control={form.control}
                render={({ field }) => (
                  <PhoneDigitsInput
                    id="lead-phone-nem"
                    className={phoneInputWrapperClass}
                    inputClassName="placeholder:text-[var(--color-muted)]"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
              {form.formState.errors.phoneDigits && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.phoneDigits.message}</p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="lead-email-nem" className="mb-1.5 block text-body font-medium text-[var(--color-foreground)]">
              E-mail {requiredStar}
            </label>
            <input
              id="lead-email-nem"
              type="email"
              autoComplete="email"
              className={inputClass}
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.email.message}</p>
            )}
          </div>

          <p className="text-center text-xs leading-snug text-[var(--color-muted)]">
            Odesláním souhlasíte se zpracováním osobních údajů dle{" "}
            <Link
              href="/ochrana-osobnich-udaju"
              className="italic text-[var(--color-primary)] underline-offset-2 hover:underline"
            >
              zásad ochrany osobních údajů
            </Link>
            .
          </p>
        </>
      ) : (
        <div className="space-y-4 md:space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-surface-cream)] px-3 py-1.5 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary)]/45 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-primary)] ring-2 ring-white/70" />
              </span>
              <span className="text-xs font-semibold text-[var(--color-foreground)]">
                Konzultanti k dispozici • Ozveme se brzy
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="lead-model" className="mb-1.5 block text-body font-medium text-[var(--color-foreground)]">
              Značka a model vozu {requiredStar}
            </label>
            <input id="lead-model" className={inputClass} {...form.register("vehicleModel")} />
            <p className="mt-1 text-xs text-[var(--color-muted)]">Např. Škoda Fabia</p>
            {form.formState.errors.vehicleModel && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.vehicleModel.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            <div>
              <label htmlFor="lead-year" className="mb-1.5 block text-body font-medium text-[var(--color-foreground)]">
                Rok výroby {requiredStar}
              </label>
              <input id="lead-year" inputMode="numeric" className={inputClass} {...form.register("year")} />
              <p className="mt-1 text-xs text-[var(--color-muted)]">Např. 2019</p>
              {form.formState.errors.year && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.year.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="lead-km" className="mb-1.5 block text-body font-medium text-[var(--color-foreground)]">
                Počet najetých kilometrů {requiredStar}
              </label>
              <input id="lead-km" inputMode="numeric" className={inputClass} {...form.register("mileage")} />
              <p className="mt-1 text-xs text-[var(--color-muted)]">Např. 142 000 km</p>
              {form.formState.errors.mileage && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.mileage.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="lead-vin" className="mb-1.5 block text-body font-medium text-[var(--color-foreground)]">
              VIN (nepovinné)
            </label>
            <input id="lead-vin" className={inputClass} {...form.register("vin")} />
            <p className="mt-1 text-xs text-[var(--color-muted)]">Např. TMBJF7CN0S123456</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="lead-vehicle-amount-slider" className="text-body font-medium text-[var(--color-muted)]">
                Požadovaná částka
              </label>
              <span className="text-base font-semibold text-[var(--color-primary)]">
                {formatAmountKc(snapToCarValue(vehicleAmountCzk))}
              </span>
            </div>
            <SliderTouchLock
              minIndex={0}
              maxIndex={maxIdxCar}
              valueIndex={valueIndexCar}
              onValueChange={(i) =>
                form.setValue("vehicleAmountCzk", CAR_AMOUNT_VALUES[i])
              }
            >
              <Slider
                id="lead-vehicle-amount-slider"
                value={[valueIndexCar]}
                onValueChange={([i]) =>
                  form.setValue("vehicleAmountCzk", CAR_AMOUNT_VALUES[i])
                }
                min={0}
                max={maxIdxCar}
                step={1}
                className="w-full"
                aria-label="Požadovaná částka"
              />
            </SliderTouchLock>
            <div className="flex justify-between text-xs text-[var(--color-muted)]">
              <span>{formatRangeLabelKc(CAR_RANGE.min)}</span>
              <span>{formatRangeLabelKc(CAR_RANGE.max)}</span>
            </div>
            <Controller
              name="vehicleAmountCzk"
              control={form.control}
              render={({ field }) => <input type="hidden" {...field} value={field.value} readOnly />}
            />
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-[var(--color-primary)]/22 bg-[var(--color-accent-warm)] px-2.5 py-1.5">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary)]/12"
              aria-hidden
            >
              <TrendingUp className="h-3.5 w-3.5 text-[var(--color-primary)]" strokeWidth={2.25} />
            </div>
            <p className="text-xs font-medium leading-snug text-[var(--color-foreground)]">{socialProofText}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            <div>
              <label htmlFor="lead-fn" className="mb-1.5 block text-body font-medium text-[var(--color-foreground)]">
                Jméno {requiredStar}
              </label>
              <input id="lead-fn" autoComplete="given-name" className={inputClass} {...form.register("firstName")} />
              {form.formState.errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="lead-ln" className="mb-1.5 block text-body font-medium text-[var(--color-foreground)]">
                Příjmení {requiredStar}
              </label>
              <input id="lead-ln" autoComplete="family-name" className={inputClass} {...form.register("lastName")} />
              {form.formState.errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            <div>
              <label htmlFor="lead-phone-voz" className="mb-1.5 block text-body font-medium text-[var(--color-foreground)]">
                Telefonní číslo {requiredStar}
              </label>
              <Controller
                name="phoneDigits"
                control={form.control}
                render={({ field }) => (
                  <PhoneDigitsInput
                    id="lead-phone-voz"
                    className={phoneInputWrapperClass}
                    inputClassName="placeholder:text-[var(--color-muted)]"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
              {form.formState.errors.phoneDigits && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.phoneDigits.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="lead-email-voz" className="mb-1.5 block text-body font-medium text-[var(--color-foreground)]">
                E-mail {requiredStar}
              </label>
              <input
                id="lead-email-voz"
                type="email"
                autoComplete="email"
                className={inputClass}
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>

          <p className="text-center text-xs leading-snug text-[var(--color-muted)]">
            Odesláním souhlasíte se zpracováním osobních údajů dle{" "}
            <Link
              href="/ochrana-osobnich-udaju"
              className="italic text-[var(--color-primary)] underline-offset-2 hover:underline"
            >
              zásad ochrany osobních údajů
            </Link>
            .
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending" || status === "success"}
        aria-busy={status === "sending"}
        className={cn(
          "flex h-12 min-h-[48px] w-full items-center justify-center gap-2 rounded-xl text-base font-semibold transition-all disabled:pointer-events-none",
          status === "success"
            ? "border-2 border-[var(--color-primary)]/20 bg-[var(--color-primary)]/[0.07] text-[var(--color-primary)] shadow-none"
            : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-[0.65]",
        )}
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-5 w-5 shrink-0 animate-spin" aria-hidden />
            Odesílám…
          </>
        ) : status === "success" ? (
          <>
            <Check className="h-5 w-5 shrink-0 stroke-[2.5]" aria-hidden />
            Poptávka odeslána
          </>
        ) : (
          "Odeslat nezávaznou poptávku"
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-center text-xs text-[var(--color-muted)]">
        <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>Vaše data jsou v bezpečí. Diskrétně. Odpovídáme obratem.</span>
      </div>
    </form>
  )
}
