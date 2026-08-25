import { SettingsRow } from './SettingsUi.jsx'
import { BackButton } from './SettingsUi.jsx'
import { useSettings } from '../../context/useSettings.js'

function Configuracoes({ onBack, onOpen }) {
  const { language, textSize, textStyle, lineSpacing, readingMode } = useSettings()
  const labels = { portugues: 'Português', ingles: 'Inglês', espanhol: 'Espanhol', frances: 'Francês', arabe: 'Árabe', chines: 'Chinês', japones: 'Japonês', alemao: 'Alemão' }
  const sizeLabel = ['Pequeno', 'Médio', 'Normal', 'Grande', 'Muito grande'][textSize]
  const styleLabel = { classico: 'Clássico', moderno: 'Moderno', editorial: 'Editorial', confortavel: 'Confortável' }[textStyle]
  const spacingLabel = ['Compacto', 'Normal', 'Confortável'][lineSpacing]
  const modeLabel = { claro: 'Claro', papel: 'Papel', suave: 'Suave', escuro: 'Escuro' }[readingMode]

  return <main className="screen-shell min-h-screen bg-white text-[#202020]"><BackButton onBack={onBack} /><div className="screen-header-gap"><SettingsRow label="Idioma" value={labels[language]} onClick={() => onOpen('idioma')} /><SettingsRow label="Tamanho do texto" value={sizeLabel} onClick={() => onOpen('tamanho')} /><SettingsRow label="Estilo do texto" value={styleLabel} onClick={() => onOpen('estilo')} /><SettingsRow label="Espaço entre linhas" value={spacingLabel} onClick={() => onOpen('espaco')} /><SettingsRow label="Modo de leitura" value={modeLabel} onClick={() => onOpen('modo')} /></div></main>
}

export default Configuracoes