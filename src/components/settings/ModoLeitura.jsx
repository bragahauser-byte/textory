import { SettingsHeader, OptionRow } from './SettingsUi.jsx'
import { useSettings } from '../../context/useSettings.js'
import { READING_MODES } from '../../context/settingsData.js'
import { useLocale } from '../../context/useLocale.js'

const modes = ['claro', 'papel', 'suave', 'escuro']

function ModoLeitura({ onBack }) {
  const { readingMode, updateSetting, fontFamily, fontSize, lineHeight, letterSpacing } = useSettings()
  const colors = READING_MODES[readingMode]
  const { t } = useLocale()
  return <main className="bg-[var(--color-bg)] text-[var(--color-text)]"><SettingsHeader title={t('settings.readingMode')} onBack={onBack} /><div className="screen-header-gap">{modes.map((key) => <OptionRow key={key} selected={readingMode === key} onClick={() => updateSetting('readingMode', key)}>{t(`settings.modes.${key}`)}</OptionRow>)}</div><div key={readingMode} className="reading-preview content-enter title-subtitle-gap h-[250px] overflow-hidden rounded-xl p-3" style={{ background: colors.background, color: colors.primary, fontFamily, fontSize: `${Math.min(fontSize, 24)}px`, lineHeight: `${lineHeight}px`, letterSpacing }}>{t('preview')}</div></main>
}

export default ModoLeitura