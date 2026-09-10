import { SettingsRow, SettingsToggleRow } from './SettingsUi.jsx'
import { BackButton } from './SettingsUi.jsx'
import { useSettings } from '../../context/useSettings.js'
import { useLocale } from '../../context/useLocale.js'
import { useTheme } from '../../context/useTheme.js'

function Configuracoes({ onBack, onOpen }) {
  const { language, textSize, textStyle, lineSpacing, readingMode } = useSettings()
  const { t } = useLocale()
  const { isDark, toggleTheme } = useTheme()
  const sizeLabel = t(`settings.sizes.${textSize}`)
  const styleLabel = t(`settings.styles.${textStyle}`)
  const spacingLabel = t(`settings.spacing.${lineSpacing}`)
  const modeLabel = t(`settings.modes.${readingMode}`)

  return <main className="bg-[var(--color-bg)] text-[var(--color-text)]"><BackButton onBack={onBack} /><div className="screen-header-gap"><SettingsRow label={t('settings.language')} value={t(`settings.languages.${language}`)} onClick={() => onOpen('idioma')} /><SettingsRow label={t('settings.textSize')} value={sizeLabel} onClick={() => onOpen('tamanho')} /><SettingsRow label={t('settings.textStyle')} value={styleLabel} onClick={() => onOpen('estilo')} /><SettingsRow label={t('settings.lineSpacing')} value={spacingLabel} onClick={() => onOpen('espaco')} /><SettingsRow label={t('settings.readingMode')} value={modeLabel} onClick={() => onOpen('modo')} /><SettingsToggleRow label={t('settings.appearanceDark')} switchLabel={t('settings.appearanceDark')} checked={isDark} onChange={toggleTheme} /></div></main>
}

export default Configuracoes