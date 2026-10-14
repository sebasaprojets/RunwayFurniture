import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'es'
export const langs: Lang[] = ['en', 'es']

/** A piece of copy in every supported language. */
export type T = Record<Lang, string>

const STORAGE_KEY = 'runway-lang'

const meta = {
  title: {
    en: 'Runway Furniture International — Creating Extraordinary Spaces Worldwide',
    es: 'Runway Furniture International — Creamos espacios extraordinarios en todo el mundo',
  },
  description: {
    en: 'Runway Furniture International — luxury hospitality, residential and bespoke furniture since 2009. Montreal · Singapore · Worldwide.',
    es: 'Runway Furniture International — mobiliario hotelero de lujo, residencial y a medida desde 2009. Montreal · Singapur · Todo el mundo.',
  },
}

/** ?lang=es wins (shareable links), then the visitor's last choice, then the browser language. */
function initialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (fromUrl === 'en' || fromUrl === 'es') return fromUrl
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'es') return saved
  } catch {
    /* storage unavailable (private mode) */
  }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

type Ctx = {
  lang: Lang
  setLang: (l: Lang) => void
  /** Inline copy: t('Projects', 'Proyectos'). */
  t: (en: string, es: string) => string
  /** Copy stored in data as { en, es }. */
  tx: (v: T) => string
}

const LangContext = createContext<Ctx | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = meta.title[lang]
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description[lang])
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* storage unavailable */
    }
    const url = new URL(window.location.href)
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', lang)
      history.replaceState(history.state, '', url)
    }
  }, [lang])

  const setLang = useCallback((l: Lang) => setLangState(l), [])
  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (en, es) => (lang === 'es' ? es : en),
      tx: (v) => v[lang],
    }),
    [lang, setLang],
  )
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}
