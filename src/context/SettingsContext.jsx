import { useEffect, useMemo, useState } from 'react'
import { FONT_GROUPS, LANGUAGE_FONT_GROUP, READING_MODES, TEXT_SIZES } from './settingsData.js'
import { SettingsContext } from './settingsContext.js'

const STORAGE_KEY = 'meu-app-leitura-settings'

const DEFAULT_SETTINGS = {
  language: 'ingles',
  textSize: 2,
  textStyle: 'classico',
  lineSpacing: 1,
  readingMode: 'claro',
}

const LANGUAGE_KEYS = { pt: 'portugues', en: 'ingles', es: 'espanhol', fr: 'frances', ar: 'arabe', zh: 'chines', ja: 'japones', de: 'alemao', ko: 'coreano' }

function detectLanguage() {
  if (typeof navigator === 'undefined') return DEFAULT_SETTINGS.language
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const candidate of candidates) {
    const languageCode = String(candidate ?? '').toLowerCase().split('-')[0]
    if (LANGUAGE_KEYS[languageCode]) return LANGUAGE_KEYS[languageCode]
  }
  return DEFAULT_SETTINGS.language
}

function readSettings() {
  try {
    const storedValue = localStorage.getItem(STORAGE_KEY)
    if (!storedValue) return { ...DEFAULT_SETTINGS, language: detectLanguage() }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(storedValue) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(readSettings)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  function updateSetting(key, value) {
    setSettings((current) => ({ ...current, [key]: value }))
  }

  const fontGroupName = LANGUAGE_FONT_GROUP[settings.language] ?? 'latino'
  const fontGroup = FONT_GROUPS[fontGroupName]
  const mode = READING_MODES[settings.readingMode] ?? READING_MODES.claro

  useEffect(() => {
    document.documentElement.style.backgroundColor = mode.background
    document.body.style.backgroundColor = mode.background
    document.getElementById('root').style.backgroundColor = mode.background
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode.background)
  }, [mode])

  const value = useMemo(() => {
    const size = TEXT_SIZES[settings.textSize] ?? TEXT_SIZES[2]
    const baseLineHeight = size.lineHeight + (settings.lineSpacing - 1) * 4
    const textStyle = fontGroup.styles.includes(settings.textStyle) ? settings.textStyle : fontGroup.styles[0]
    return {
      ...settings,
      textStyle,
      ...size,
      fontGroup: fontGroupName,
      textStyles: fontGroup.styles,
      fontFamily: fontGroup.fonts[textStyle],
      letterSpacing: fontGroup.letterSpacing,
      lineHeight: Math.round(baseLineHeight * fontGroup.lineHeightMultiplier),
      colors: mode,
      updateSetting,
    }
  }, [settings, fontGroup, fontGroupName, mode])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

