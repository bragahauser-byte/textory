import { useEffect, useMemo, useState } from 'react'
import { READING_MODES, TEXT_FONTS, TEXT_SIZES } from './settingsData.js'
import { SettingsContext } from './settingsContext.js'

const STORAGE_KEY = 'meu-app-leitura-settings'

const DEFAULT_SETTINGS = {
  language: 'portugues',
  textSize: 2,
  textStyle: 'classico',
  lineSpacing: 1,
  readingMode: 'claro',
}

function readSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') }
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

  const value = useMemo(() => {
    const size = TEXT_SIZES[settings.textSize] ?? TEXT_SIZES[2]
    const mode = READING_MODES[settings.readingMode] ?? READING_MODES.claro
    return {
      ...settings,
      ...size,
      fontFamily: TEXT_FONTS[settings.textStyle] ?? TEXT_FONTS.classico,
      letterSpacing: 0,
      lineHeight: size.lineHeight + (settings.lineSpacing - 1) * 4,
      colors: mode,
      updateSetting,
    }
  }, [settings])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

