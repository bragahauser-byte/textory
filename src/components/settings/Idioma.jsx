import { SettingsHeader, OptionRow } from './SettingsUi.jsx'
import { useSettings } from '../../context/useSettings.js'
import { useLocale } from '../../context/useLocale.js'

const languages = [['portugues', '🇧🇷'], ['ingles', '🇺🇸'], ['espanhol', '🇪🇸'], ['frances', '🇫🇷'], ['arabe', '🇸🇦'], ['chines', '🇨🇳'], ['japones', '🇯🇵'], ['alemao', '🇩🇪'], ['coreano', '🇰🇷']]

function Idioma({ onBack }) {
  const { language, updateSetting } = useSettings()
  const { t } = useLocale()
  return <main className="bg-white text-[#202020]"><SettingsHeader title={t('settings.language')} onBack={onBack} /><div className="screen-header-gap">{languages.map(([key, flag]) => <OptionRow key={key} selected={language === key} onClick={() => updateSetting('language', key)}>{flag} {t(`settings.languages.${key}`)}</OptionRow>)}</div></main>
}

export default Idioma