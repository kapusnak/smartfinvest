"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller, useWatch, type FieldErrors } from "react-hook-form"
import { z } from "zod"
import { Check, Loader2, Lock, TrendingUp } from "lucide-react"
import { toast } from "sonner"

import { Slider } from "@/components/ui/slider"
import { SliderTouchLock } from "@/components/slider-touch-lock"
import { sendLead } from "@/lib/send-lead"
import {
  CAR_AMOUNT_VALUES,
  CAR_RANGE,
  DEFAULT_CAR_AMOUNT,
  DEFAULT_CLIENT_SERVICE,
  DEFAULT_REAL_ESTATE_AMOUNT,
  REAL_ESTATE_AMOUNT_VALUES,
  REAL_ESTATE_RANGE,
  SERVICES_WITH_ASSET,
  SOCIAL_PROOF_FALLBACK,
  assetTypeOptions,
  carAmountToIndex,
  clientServices,
  formatAmountKc,
  formatRangeLabelKc,
  isDocasnyVykupVozidlo,
  needsPropertyAddress,
  realEstateAmountToIndex,
  snapToCarValue,
  snapToRealEstateValue,
  type AssetTypeValue,
  type ClientServiceValue,
} from "@/lib/lead-form-scales"
import { PhoneDigitsInput } from "@/components/phone-digits-input"
import { toFullPhone } from "@/lib/phone-420"
import { cn } from "@/lib/utils"

const inputClass =
  "h-12 w-full rounded-xl border border-black/20 bg-white px-4 text-base text-[var(--color-foreground)] shadow-sm outline-none transition-[box-shadow] focus:ring-2 focus:ring-[var(--color-primary)]"

const phoneInputWrapperClass =
  "h-12 w-full rounded-xl border border-black/20 bg-white px-4 text-base text-[var(--color-foreground)] shadow-sm outline-none transition-[box-shadow] focus-within:ring-2 focus-within:ring-[var(--color-primary)]"

const serviceTypeEnum = z.enum([
  "refinancovani",
  "docasny-vykup",
  "zajistene-uvery",
  "financovani",
])

const assetTypeEnum = z.enum(["Nemovitost", "Vozidlo"])

const leadFormSchema = z
  .object({
    name: z.string(),
    email: z.string(),
    phoneDigits: z.string(),
    serviceType: serviceTypeEnum,
    assetType: assetTypeEnum,
    amountCzk: z.number(),
    propertyAddress: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    vehicleModel: z.string(),
    year: z.string(),
    mileage: z.string(),
    vin: z.string(),
    contractDurationMonths: z.string(),
    vehicleAmountCzk: z.number(),
  })
  .superRefine((data, ctx) => {
    if (!z.string().email().safeParse(data.email).success) {
      ctx.addIssue({ code: "custom", message: "Zadejte platný e-mail.", path: ["email"] })
    }
    if (toFullPhone(data.phoneDigits) === "") {
      ctx.addIssue({
        code: "custom",
        message: "Zadejte platné telefonní číslo (9 číslic).",
        path: ["phoneDigits"],
      })
    }

    const service = data.serviceType as ClientServiceValue
    const asset = data.assetType as AssetTypeValue
    const vehicleMode = isDocasnyVykupVozidlo(service, asset)

    if (vehicleMode) {
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
      const contractMonths = data.contractDurationMonths.trim()
      if (contractMonths.length > 0) {
        if (!/^\d+$/.test(contractMonths)) {
          ctx.addIssue({
            code: "custom",
            message: "Zadejte počet měsíců jako celé číslo.",
            path: ["contractDurationMonths"],
          })
        } else {
          const n = Number.parseInt(contractMonths, 10)
          if (n < 1 || n > 360) {
            ctx.addIssue({
              code: "custom",
              message: "Zadejte počet měsíců v rozmezí 1–360.",
              path: ["contractDurationMonths"],
            })
          }
        }
      }
      return
    }

    if (data.name.trim().length < 2) {
      ctx.addIssue({ code: "custom", message: "Zadejte jméno.", path: ["name"] })
    }
    if (needsPropertyAddress(service, asset) && data.propertyAddress.trim().length < 5) {
      ctx.addIssue({
        code: "custom",
        message: "Zadejte adresu nemovitosti (ulice, č.p., město).",
        path: ["propertyAddress"],
      })
    }
    if (data.amountCzk < REAL_ESTATE_RANGE.min || data.amountCzk > REAL_ESTATE_RANGE.max) {
      ctx.addIssue({ code: "custom", message: "Neplatná částka.", path: ["amountCzk"] })
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
    contractDurationMonths: "",
    vehicleAmountCzk: snapToCarValue(DEFAULT_CAR_AMOUNT),
  }
}

function defaultFormValues(overrides?: Partial<LeadFormValues>): LeadFormValues {
  return {
    name: "",
    email: "",
    phoneDigits: "",
    serviceType: DEFAULT_CLIENT_SERVICE,
    assetType: "Nemovitost",
    amountCzk: snapToRealEstateValue(DEFAULT_REAL_ESTATE_AMOUNT),
    propertyAddress: "",
    ...emptyVozidloFields(),
    ...overrides,
  }
}

export function LeadForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: defaultFormValues(),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  })

  const amountCzk = useWatch({ control: form.control, name: "amountCzk" })
  const vehicleAmountCzk = useWatch({ control: form.control, name: "vehicleAmountCzk" })
  const serviceType = useWatch({ control: form.control, name: "serviceType" })
  const assetType = useWatch({ control: form.control, name: "assetType" })

  const service = serviceType as ClientServiceValue
  const asset = assetType as AssetTypeValue
  const showAssetType = SERVICES_WITH_ASSET.has(service)
  const showPropertyAddress = needsPropertyAddress(service, asset)
  const vehicleMode = isDocasnyVykupVozidlo(service, asset)

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
      const needsAsset = SERVICES_WITH_ASSET.has(values.serviceType)
      const isVehicle = isDocasnyVykupVozidlo(values.serviceType, values.assetType)
      const serviceLabel =
        clientServices.find((s) => s.value === values.serviceType)?.label ?? values.serviceType

      let name: string
      let amount: number
      let serviceTypePayload: string
      let propertyAddress: string | undefined
      let assetTypePayload: string | undefined

      if (isVehicle) {
        name = `${values.firstName.trim()} ${values.lastName.trim()}`.trim()
        amount = snapToCarValue(values.vehicleAmountCzk)
        assetTypePayload = "Vozidlo"
        const vinPart = values.vin.trim() ? `, VIN ${values.vin.trim()}` : ""
        const contractPart = values.contractDurationMonths.trim()
          ? `, trvání smlouvy ${values.contractDurationMonths.trim()} měs.`
          : ""
        serviceTypePayload = `${serviceLabel} — ${values.vehicleModel.trim()}, r.v. ${values.year.trim()}, ${values.mileage.trim()} km${vinPart}${contractPart}`
      } else {
        name = values.name.trim()
        amount = snapToRealEstateValue(values.amountCzk)
        serviceTypePayload = serviceLabel
        if (needsAsset) assetTypePayload = values.assetType
        if (needsPropertyAddress(values.serviceType, values.assetType)) {
          propertyAddress = values.propertyAddress.trim()
        }
      }

      await sendLead({
        source: "calculator",
        phone,
        email: values.email.trim() || undefined,
        name,
        amount,
        ...(assetTypePayload ? { assetType: assetTypePayload } : {}),
        serviceType: serviceTypePayload,
        ...(propertyAddress ? { propertyAddress } : {}),
      })
      setStatus("success")
      toast.success("Děkujeme za poptávku", {
        id: "lead-form-success",
        description: "Brzy vás budeme kontaktovat. Zkontrolujte prosím i složku s nevyžádanou poštou.",
        duration: 5000,
      })
      form.reset(
        defaultFormValues({
          email: values.email,
          phoneDigits: values.phoneDigits,
        }),
      )
    } catch (e) {
      setStatus("error")
      const hint = e instanceof Error ? e.message.trim() : ""
      toast.error("Odeslání se nepovedlo", {
        id: "lead-form-error",
        description:
          hint.length > 0 && hint.length <= 220
            ? hint
            : "Zkuste to prosím znovu nebo nás kontaktujte telefonicky. Podrobnosti jsou v konzoli prohlížeče (F12).",
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
        <p className="text-body font-medium text-[var(--color-muted)]" id="lead-service-label">
          Typ služby
        </p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="lead-service-label">
          {clientServices.map((svc) => (
            <button
              key={svc.value}
              type="button"
              role="radio"
              aria-checked={serviceType === svc.value}
              onClick={() => form.setValue("serviceType", svc.value)}
              className={cn(
                "min-w-0 flex-1 px-2 py-2.5 text-center text-xs font-medium leading-tight transition-all sm:min-w-[calc(50%-0.25rem)] sm:px-3 sm:text-sm lg:flex-1",
                "rounded-xl border-2",
                serviceType === svc.value
                  ? "border-[var(--color-primary)] bg-[var(--color-surface-cream)] text-[var(--color-primary)]"
                  : "border-transparent bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:border-[var(--color-primary)]/30",
              )}
            >
              {svc.label}
            </button>
          ))}
        </div>
      </div>

      {showAssetType ? (
        <div className="space-y-2">
          <p className="text-body font-medium text-[var(--color-muted)]" id="lead-asset-label">
            Typ zajištění
          </p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="lead-asset-label">
            {assetTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={assetType === option.value}
                onClick={() => form.setValue("assetType", option.value as AssetTypeValue)}
                className={cn(
                  "min-w-0 flex-1 px-3 py-2.5 text-center text-sm font-medium leading-tight transition-all",
                  "rounded-xl border-2",
                  assetType === option.value
                    ? "border-[var(--color-primary)] bg-[var(--color-surface-cream)] text-[var(--color-primary)]"
                    : "border-transparent bg-[var(--color-surface-muted)] text-[var(--color-muted)] hover:border-[var(--color-primary)]/30",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {vehicleMode ? (
        <>
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
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
                Částka
              </label>
              <span className="text-base font-semibold text-[var(--color-primary)]">
                {formatAmountKc(snapToCarValue(vehicleAmountCzk))}
              </span>
            </div>
            <SliderTouchLock
              minIndex={0}
              maxIndex={maxIdxCar}
              valueIndex={valueIndexCar}
              onValueChange={(i) => form.setValue("vehicleAmountCzk", CAR_AMOUNT_VALUES[i])}
            >
              <Slider
                id="lead-vehicle-amount-slider"
                value={[valueIndexCar]}
                onValueChange={([i]) => form.setValue("vehicleAmountCzk", CAR_AMOUNT_VALUES[i])}
                min={0}
                max={maxIdxCar}
                step={1}
                className="w-full"
                aria-label="Částka"
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

          <div>
            <label
              htmlFor="lead-contract-months"
              className="mb-1.5 block text-body font-medium text-[var(--color-foreground)]"
            >
              Trvání smlouvy (měsíce)
            </label>
            <input
              id="lead-contract-months"
              inputMode="numeric"
              autoComplete="off"
              className={inputClass}
              aria-invalid={Boolean(form.formState.errors.contractDurationMonths)}
              aria-describedby={
                form.formState.errors.contractDurationMonths ? "lead-contract-months-error" : undefined
              }
              {...form.register("contractDurationMonths")}
            />
            <p className="mt-1 text-xs text-[var(--color-muted)]">Např. 24</p>
            {form.formState.errors.contractDurationMonths && (
              <p id="lead-contract-months-error" className="mt-1 text-sm text-red-600">
                {form.formState.errors.contractDurationMonths.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-[var(--color-primary)]/22 bg-[var(--color-accent-warm)] px-2.5 py-1.5">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary)]/12"
              aria-hidden
            >
              <TrendingUp className="h-3.5 w-3.5 text-[var(--color-primary)]" strokeWidth={2.25} />
            </div>
            <p className="text-xs font-medium leading-snug text-[var(--color-foreground)]">{SOCIAL_PROOF_FALLBACK}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div>
              <label htmlFor="lead-phone-voz" className="mb-1.5 block text-body font-medium text-[var(--color-foreground)]">
                Telefon {requiredStar}
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
        </>
      ) : (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="lead-amount-slider" className="text-body font-medium text-[var(--color-muted)]">
                Částka
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
                onValueChange={([i]) => form.setValue("amountCzk", REAL_ESTATE_AMOUNT_VALUES[i])}
                min={0}
                max={maxIdx}
                step={1}
                className="w-full"
                aria-label="Částka"
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
            <p className="text-xs font-medium leading-snug text-[var(--color-foreground)]">{SOCIAL_PROOF_FALLBACK}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <div>
              <label htmlFor="lead-name" className="mb-1.5 block text-body font-medium text-[var(--color-foreground)]">
                Jméno a příjmení {requiredStar}
              </label>
              <input id="lead-name" autoComplete="name" className={inputClass} {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="lead-phone" className="mb-1.5 block text-body font-medium text-[var(--color-foreground)]">
                Telefon {requiredStar}
              </label>
              <Controller
                name="phoneDigits"
                control={form.control}
                render={({ field }) => (
                  <PhoneDigitsInput
                    id="lead-phone"
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

          {showPropertyAddress ? (
            <div>
              <label
                htmlFor="lead-property-address"
                className="mb-1.5 block text-body font-medium text-[var(--color-foreground)]"
              >
                Adresa nemovitosti {requiredStar}
              </label>
              <input
                id="lead-property-address"
                autoComplete="street-address"
                placeholder="Ulice a č.p., město"
                className={cn(inputClass, "placeholder:text-[var(--color-muted)]")}
                {...form.register("propertyAddress")}
              />
              {form.formState.errors.propertyAddress && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.propertyAddress.message}</p>
              )}
            </div>
          ) : null}

          <div>
            <label htmlFor="lead-email" className="mb-1.5 block text-body font-medium text-[var(--color-foreground)]">
              E-mail {requiredStar}
            </label>
            <input
              id="lead-email"
              type="email"
              autoComplete="email"
              className={inputClass}
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.email.message}</p>
            )}
          </div>
        </>
      )}

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

      <button
        type="submit"
        disabled={status === "sending" || status === "success"}
        aria-busy={status === "sending"}
        className={cn(
          "flex h-12 min-h-[48px] w-full items-center justify-center gap-2 rounded-xl text-base font-semibold transition-all disabled:pointer-events-none",
          status === "success"
            ? "border-2 border-[var(--color-cta)]/20 bg-[var(--color-cta)]/[0.07] text-[var(--color-cta)] shadow-none"
            : "bg-[var(--color-cta)] text-white hover:bg-[var(--color-cta-hover)] disabled:opacity-[0.65]",
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
          "Odeslat nezávaznou žádost"
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-center text-xs text-[var(--color-muted)]">
        <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>Vaše data jsou v bezpečí. Diskrétně. Odpovídáme obratem.</span>
      </div>
    </form>
  )
}
