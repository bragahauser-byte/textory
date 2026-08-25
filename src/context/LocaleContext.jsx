import { useEffect, useMemo } from 'react'
import { useSettings } from './useSettings.js'
import pt from '../locales/pt.json'
import en from '../locales/en.json'
import es from '../locales/es.json'
import fr from '../locales/fr.json'
import ar from '../locales/ar.json'
import zh from '../locales/zh.json'
import ja from '../locales/ja.json'
import de from '../locales/de.json'
import ko from '../locales/ko.json'
import { LocaleContext } from './localeContext.js'

const translations = { portugues: pt, ingles: en, espanhol: es, frances: fr, arabe: ar, chines: zh, japones: ja, alemao: de, coreano: ko }
const LOCALE_CODES = { portugues: 'pt-BR', ingles: 'en', espanhol: 'es', frances: 'fr', arabe: 'ar', chines: 'zh-CN', japones: 'ja', alemao: 'de', coreano: 'ko' }

function getValue(source, path) {
  return path.split('.').reduce((current, key) => current?.[key], source)
}

export function LocaleProvider({ children }) {
  const { language } = useSettings()
  const locale = translations[language] ?? translations.portugues
  const direction = language === 'arabe' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = LOCALE_CODES[language] ?? 'pt-BR'
    document.documentElement.dir = direction
  }, [language, direction])

  const value = useMemo(() => ({
    language,
    direction,
    t(path, variables = {}) {
      const template = getValue(locale, path) ?? getValue(translations.portugues, path) ?? path
      return Object.entries(variables).reduce((result, [key, replacement]) => result.replace(`{${key}}`, replacement), template)
    },
    locale,
  }), [language, direction, locale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

