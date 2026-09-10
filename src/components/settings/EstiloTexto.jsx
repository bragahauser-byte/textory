import { SettingsHeader, OptionRow } from './SettingsUi.jsx'
import { useSettings } from '../../context/useSettings.js'
import { FONT_GROUPS } from '../../context/settingsData.js'
import { useLocale } from '../../context/useLocale.js'
import ReadingPreview from './ReadingPreview.jsx'

function EstiloTexto({ onBack }) {
  const { textStyle, updateSetting, fontSize, lineHeight, fontFamily, fontGroup, letterSpacing } = useSettings()
  const { t } = useLocale()
  const styles = FONT_GROUPS[fontGroup].styles
  return <main className="bg-[var(--color-bg)] text-[var(--color-text)]"><SettingsHeader title={t('settings.textStyle')} onBack={onBack} /><div className="screen-header-gap">{styles.map((key) => <OptionRow key={key} selected={textStyle === key} onClick={() => updateSetting('textStyle', key)} preview={`font-${key}`}>{t(`settings.styles.${key}`)} — Aa</OptionRow>)}</div><ReadingPreview key={textStyle} height={250} className="reading-preview content-enter title-subtitle-gap rounded-xl border border-[var(--color-border)] p-3" style={{ fontFamily, fontSize: `${Math.min(fontSize, 24)}px`, lineHeight: `${lineHeight}px`, letterSpacing }}>{t('preview')}</ReadingPreview></main>
}

export default EstiloTexto