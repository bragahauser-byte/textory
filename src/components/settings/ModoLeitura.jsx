import { SettingsHeader, OptionRow, previewText } from './SettingsUi.jsx'
import { useSettings } from '../../context/useSettings.js'
import { READING_MODES } from '../../context/settingsData.js'

const modes = [['claro', 'Claro'], ['papel', 'Papel'], ['suave', 'Suave'], ['escuro', 'Escuro']]

function ModoLeitura({ onBack }) {
  const { readingMode, updateSetting, fontFamily, fontSize, lineHeight } = useSettings()
  const colors = READING_MODES[readingMode]
  return <main className="screen-shell min-h-screen bg-white text-[#202020]"><SettingsHeader title="Modo de leitura" onBack={onBack} /><div className="screen-header-gap">{modes.map(([key, label]) => <OptionRow key={key} selected={readingMode === key} onClick={() => updateSetting('readingMode', key)}>{label}</OptionRow>)}</div><div key={readingMode} className="reading-preview content-enter title-subtitle-gap h-[250px] overflow-hidden rounded-xl p-3" style={{ background: colors.background, color: colors.primary, fontFamily, fontSize: `${Math.min(fontSize, 24)}px`, lineHeight: `${Math.min(lineHeight, 32)}px`, letterSpacing: '0px' }}>{previewText}</div></main>
}

export default ModoLeitura