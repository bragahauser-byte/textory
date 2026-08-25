import { useEffect, useMemo, useState } from 'react'
import { FONT_GROUPS, LANGUAGE_FONT_GROUP, READING_MODES, TEXT_SIZES } from './settingsData.js'
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

  const fontGroupName = LANGUAGE_FONT_GROUP[settings.language] ?? 'latino'
  const fontGroup = FONT_GROUPS[fontGroupName]

  const value = useMemo(() => {
    const size = TEXT_SIZES[settings.textSize] ?? TEXT_SIZES[2]
    const mode = READING_MODES[settings.readingMode] ?? READING_MODES.claro
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
  }, [settings, fontGroup, fontGroupName])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

