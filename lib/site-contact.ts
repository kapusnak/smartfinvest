export type SitePhone = {
  label: string
  display: string
  tel: string
  whatsappHref: string
}

export const SITE_PHONES: readonly SitePhone[] = [
  {
    label: "Pohledávky a vymáhání",
    display: "+420 776 680 720",
    tel: "+420776680720",
    whatsappHref: "https://wa.me/420776680720",
  },
  {
    label: "Refinancování a konsolidace",
    display: "+420 777 400 256",
    tel: "+420777400256",
    whatsappHref: "https://wa.me/420777400256",
  },
]
