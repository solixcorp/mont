import { createContext, useContext } from "react"

export type Locale = "en" | "kr"

const LocaleContext = createContext<Locale>("en")

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>
}

export function useLocale(): Locale {
  return useContext(LocaleContext)
}
