import { SettingsHeader, OptionRow } from './SettingsUi.jsx'
import { useSettings } from '../../context/useSettings.js'
import { FONT_GROUPS } from '../../context/settingsData.js'
import { useLocale } from '../../context/useLocale.js'

function EstiloTexto({ onBack }) {
  const { textStyle, updateSetting, fontSize, lineHeight, fontFamily, fontGroup, letterSpacing } = useSettings()
  const { t } = useLocale()
  const styles = FONT_GROUPS[fontGroup].styles
  return <main className="bg-white text-[#202020]"><SettingsHeader title={t('settings.textStyle')} onBack={onBack} /><div className="screen-header-gap">{styles.map((key) => <OptionRow key={key} selected={textStyle === key} onClick={() => updateSetting('textStyle', key)} preview={`font-${key}`}>{t(`settings.styles.${key}`)} — Aa</OptionRow>)}</div><div key={textStyle} className="reading-preview content-enter title-subtitle-gap h-[250px] overflow-hidden rounded-xl border border-[#eeeeee] p-3" style={{ fontFamily, fontSize: `${Math.min(fontSize, 24)}px`, lineHeight: `${lineHeight}px`, letterSpacing }}>{t('preview')}</div></main>
}

export default EstiloTexto