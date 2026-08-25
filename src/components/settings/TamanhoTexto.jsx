import { SettingsHeader, previewText } from './SettingsUi.jsx'
import { useSettings } from '../../context/useSettings.js'
import { TEXT_SIZES } from '../../context/settingsData.js'
import Slider from '../ui/Slider.jsx'

function TamanhoTexto({ onBack }) {
  const { textSize, updateSetting, fontFamily, lineHeight } = useSettings()
  const size = TEXT_SIZES[textSize]
  return <main className="screen-shell min-h-screen bg-white text-[#202020]"><SettingsHeader title="Tamanho do texto" onBack={onBack} /><Slider className="mt-6" value={textSize} min={0} max={4} step={1} onChange={(nextValue) => updateSetting('textSize', nextValue)} /><div className="reading-preview preview-transition mt-6 h-[405px] overflow-hidden rounded-xl border border-[#eeeeee] p-3" style={{ fontFamily, fontSize: `${size.fontSize}px`, lineHeight: `${lineHeight}px`, letterSpacing: '0px' }}>{previewText}</div></main>
}

export default TamanhoTexto