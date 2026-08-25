import { SettingsHeader, previewText } from './SettingsUi.jsx'
import { useSettings } from '../../context/useSettings.js'
import Slider from '../ui/Slider.jsx'

function EspacoLinhas({ onBack }) {
  const { lineSpacing, updateSetting, fontFamily, fontSize, lineHeight } = useSettings()
  return <main className="screen-shell min-h-screen bg-white text-[#202020]"><SettingsHeader title="Espaço entre linhas" onBack={onBack} /><Slider className="mt-6" value={lineSpacing} min={0} max={2} step={1} onChange={(nextValue) => updateSetting('lineSpacing', nextValue)} /><div className="reading-preview preview-transition mt-6 h-[405px] overflow-hidden rounded-xl border border-[#eeeeee] p-3" style={{ fontFamily, fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px`, letterSpacing: '0px' }}>{previewText}</div></main>
}

export default EspacoLinhas