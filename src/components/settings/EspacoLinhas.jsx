import { SettingsHeader } from './SettingsUi.jsx'
import { useSettings } from '../../context/useSettings.js'
import { useLocale } from '../../context/useLocale.js'
import Slider from '../ui/Slider.jsx'

function EspacoLinhas({ onBack }) {
  const { lineSpacing, updateSetting, fontFamily, fontSize, lineHeight, letterSpacing } = useSettings()
  const { t } = useLocale()
  return <main className="bg-white text-[#202020]"><SettingsHeader title={t('settings.lineSpacing')} onBack={onBack} /><Slider className="mt-6" value={lineSpacing} min={0} max={2} step={1} onChange={(nextValue) => updateSetting('lineSpacing', nextValue)} /><div className="reading-preview preview-transition mt-6 h-[405px] overflow-hidden rounded-xl border border-[#eeeeee] p-3" style={{ fontFamily, fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px`, letterSpacing }}>{t('preview')}</div></main>
}

export default EspacoLinhas