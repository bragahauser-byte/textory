import { SettingsHeader } from './SettingsUi.jsx'
import { useSettings } from '../../context/useSettings.js'
import { useLocale } from '../../context/useLocale.js'
import { TEXT_SIZES } from '../../context/settingsData.js'
import Slider from '../ui/Slider.jsx'

function TamanhoTexto({ onBack }) {
  const { textSize, updateSetting, fontFamily, lineHeight, letterSpacing } = useSettings()
  const size = TEXT_SIZES[textSize]
  const { t } = useLocale()
  return <main className="screen-shell min-h-screen bg-white text-[#202020]"><SettingsHeader title={t('settings.textSize')} onBack={onBack} /><Slider className="mt-6" value={textSize} min={0} max={4} step={1} onChange={(nextValue) => updateSetting('textSize', nextValue)} /><div className="reading-preview preview-transition mt-6 h-[405px] overflow-hidden rounded-xl border border-[#eeeeee] p-3" style={{ fontFamily, fontSize: `${size.fontSize}px`, lineHeight: `${lineHeight}px`, letterSpacing }}>{t('preview')}</div></main>
}

export default TamanhoTexto