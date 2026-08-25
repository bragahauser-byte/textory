import { SettingsHeader, OptionRow, previewText } from './SettingsUi.jsx'
import { useSettings } from '../../context/useSettings.js'
import { TEXT_FONTS } from '../../context/settingsData.js'

const styles = [['classico', 'Clássico — Aa'], ['moderno', 'Moderno — Aa'], ['editorial', 'Editorial — Aa'], ['confortavel', 'Confortável — Aa']]

function EstiloTexto({ onBack }) {
  const { textStyle, updateSetting, fontSize, lineHeight } = useSettings()
  return <main className="screen-shell min-h-screen bg-white text-[#202020]"><SettingsHeader title="Estilo de texto" onBack={onBack} /><div className="screen-header-gap">{styles.map(([key, label]) => <OptionRow key={key} selected={textStyle === key} onClick={() => updateSetting('textStyle', key)} preview={`font-${key}`}>{label}</OptionRow>)}</div><div key={textStyle} className="reading-preview content-enter title-subtitle-gap h-[250px] overflow-hidden rounded-xl border border-[#eeeeee] p-3" style={{ fontFamily: TEXT_FONTS[textStyle], fontSize: `${Math.min(fontSize, 24)}px`, lineHeight: `${Math.min(lineHeight, 32)}px`, letterSpacing: '0px' }}>{previewText}</div></main>
}

export default EstiloTexto