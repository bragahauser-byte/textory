import { SettingsHeader, OptionRow } from './SettingsUi.jsx'
import { useSettings } from '../../context/useSettings.js'

const languages = [['portugues', '🇧🇷 Português'], ['ingles', '🇺🇸 Inglês'], ['espanhol', '🇪🇸 Espanhol'], ['frances', '🇫🇷 Francês'], ['arabe', '🇸🇦 Árabe'], ['chines', '🇨🇳 Chinês'], ['japones', '🇯🇵 Japonês'], ['alemao', '🇩🇪 Alemão']]

function Idioma({ onBack }) {
  const { language, updateSetting } = useSettings()
  return <main className="screen-shell min-h-screen bg-white text-[#202020]"><SettingsHeader title="Idioma" onBack={onBack} /><div className="screen-header-gap">{languages.map(([key, label]) => <OptionRow key={key} selected={language === key} onClick={() => updateSetting('language', key)}>{label}</OptionRow>)}</div></main>
}

export default Idioma