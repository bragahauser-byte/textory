import { useCallback, useEffect, useState } from 'react'
import Configuracoes from './components/settings/Configuracoes.jsx'
import EspacoLinhas from './components/settings/EspacoLinhas.jsx'
import EstiloTexto from './components/settings/EstiloTexto.jsx'
import Idioma from './components/settings/Idioma.jsx'
import ModoLeitura from './components/settings/ModoLeitura.jsx'
import TamanhoTexto from './components/settings/TamanhoTexto.jsx'
import Home from './components/Home.jsx'
import ItemPronto from './components/ItemPronto.jsx'
import Leitura from './components/Leitura.jsx'
import Loading from './components/Loading.jsx'
import NovoItem from './components/NovoItem.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { LibraryProvider } from './context/LibraryContext.jsx'
import { useLibrary } from './context/useLibrary.js'
import { useSettings } from './context/useSettings.js'
import { useLocale } from './context/useLocale.js'
import { normalizeContent, paginateContent } from './utils/pagination.js'
import { MOTION } from './utils/motion.js'
import ScreenLayout from './components/layout/ScreenLayout.jsx'
import { LocaleProvider } from './context/LocaleContext.jsx'

const readingContent = [
	'Naquela manhã, a cidade parecia ter acordado antes de todos nós. As ruas ainda estavam úmidas da chuva da noite anterior, e as primeiras pessoas caminhavam apressadas pelas calçadas, carregando cafés, mochilas e pensamentos que pareciam pesar mais do que deveriam.',
	'Do alto da janela, Lucas observava tudo em silêncio. Havia alguma coisa diferente naquele dia. Ele não saberia dizer exatamente o quê.',
	'Talvez fosse a luz atravessando as nuvens. Talvez fosse o silêncio incomum dentro do apartamento. Ou talvez fosse apenas aquela sensação estranha de que alguma coisa estava prestes a acontecer.',
	'Lucas se afastou da janela e olhou para o relógio. Sete e vinte e três. Ele havia acordado antes do despertador, o que quase nunca acontecia.',
]

function AppContent() {
	const [screen, setScreen] = useState('home')
	const [settingsReturn, setSettingsReturn] = useState('home')
	const [pendingReading, setPendingReading] = useState(null)
	const [editingReading, setEditingReading] = useState(null)
	const [activeReading, setActiveReading] = useState(null)
	const { readings, addReading, updateReading, removeReading } = useLibrary()
	const { fontFamily, fontSize, lineHeight, letterSpacing } = useSettings()
	const { t } = useLocale()

	const getTitle = useCallback((content, file) => {
		if (file && !String(content ?? '').trim()) return file.name.replace(/\.[^.]+$/, '')
		const text = normalizeContent(content).join('\n')
		const firstLine = text.split('\n')[0]?.trim()
		if (firstLine && firstLine.length <= 60 && (!/[.!?]$/.test(firstLine) || firstLine === firstLine.toUpperCase())) return firstLine
		const words = text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean)
		if (words.length) return `${words.slice(0, 8).join(' ')}${words.length > 8 ? '...' : ''}`
		return file?.name?.replace(/\.[^.]+$/, '') || t('itemReady.newReading')
	}, [t])

	function deleteReading(id) {
		if (!id) return
		removeReading(id)
		setActiveReading(null)
		setScreen('home')
	}

	useEffect(() => {
		if (screen !== 'loading') return undefined

		const timer = setTimeout(() => {
			const reading = pendingReading ?? {}
			const content = reading.text?.trim() ? reading.text : reading.file ? [t('newItem.importedContent', { name: reading.file.name })] : readingContent
			const title = getTitle(content, reading.file)
			const words = normalizeContent(content).join(' ').trim().split(/\s+/).filter(Boolean).length
			const safeTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safe-top')) || 64
			const sections = paginateContent(content, { title: t('reading.title'), fontFamily, fontSize, lineHeight, letterSpacing, width: window.innerWidth - 32, contentTop: safeTop + 68 }).length
			const readingData = { title, duration: `${Math.max(1, Math.ceil(words / 238))} ${t('common.minute')}`, sections, content }
			const savedReading = reading.id ? updateReading(reading.id, readingData) : addReading(readingData)
			setActiveReading(savedReading)
			setEditingReading(null)
			setScreen('item-pronto')
		}, 2000)
		return () => clearTimeout(timer)
	}, [screen, pendingReading, addReading, updateReading, getTitle, t, fontFamily, fontSize, lineHeight, letterSpacing])

	if (screen === 'novo-item') {
		return <ScreenTransition screen={screen}><NovoItem initialText={editingReading ? normalizeContent(editingReading.content).join('\n\n') : ''} onBack={() => { setEditingReading(null); setScreen(editingReading ? 'item-pronto' : 'home') }} onTransform={(reading) => { setPendingReading({ ...reading, id: editingReading?.id }); setScreen('loading') }} /></ScreenTransition>
	}

	if (screen === 'loading') return <ScreenTransition screen={screen}><Loading /></ScreenTransition>

	if (screen === 'item-pronto') {
		return <ScreenTransition screen={screen}>
			<ItemPronto
				title={activeReading?.title ?? t('itemReady.defaultTitle')}
				subtitle={`${activeReading?.duration ?? `1 ${t('common.minute')}`} · ${activeReading?.sections ?? 1} ${activeReading?.sections === 1 ? t('home.sectionOne') : t('home.sectionMany')}`}
				onClose={() => setScreen('home')}
				onDelete={() => deleteReading(activeReading?.id)}
				onEdit={() => { setEditingReading(activeReading); setScreen('novo-item') }}
				onRead={() => { setActiveReading(activeReading); setScreen('leitura') }}
			/>
		</ScreenTransition>
	}

	if (screen === 'leitura') {
		const reading = activeReading ?? readings[0]
		return <ScreenTransition screen={screen}><Leitura content={reading?.content ?? readingContent} title={t('reading.title')} onClose={() => setScreen('home')} onDelete={() => deleteReading(reading?.id)} onSettings={() => { setSettingsReturn('leitura'); setScreen('configuracoes') }} /></ScreenTransition>
	}

	if (screen === 'configuracoes') {
		return <ScreenTransition screen={screen}><Configuracoes onBack={() => setScreen(settingsReturn)} onOpen={(target) => setScreen(`settings-${target}`)} /></ScreenTransition>
	}

	const subScreens = {
		'idioma': Idioma,
		'tamanho': TamanhoTexto,
		'estilo': EstiloTexto,
		'espaco': EspacoLinhas,
		'modo': ModoLeitura,
	}
	const SettingsScreen = subScreens[screen.replace('settings-', '')]
	if (SettingsScreen) return <ScreenTransition screen={screen}><SettingsScreen onBack={() => setScreen('configuracoes')} /></ScreenTransition>

	return <ScreenTransition screen={screen}><Home items={readings} onSelectReading={(reading) => { setActiveReading(reading); setScreen('item-pronto') }} onAdd={() => { setEditingReading(null); setScreen('novo-item') }} onSettings={() => { setSettingsReturn('home'); setScreen('configuracoes') }} /></ScreenTransition>
}

function ScreenTransition({ screen, children }) {
	return <div key={screen} className="screen-transition" style={{ '--screen-duration': MOTION.screenDuration }}><ScreenLayout>{children}</ScreenLayout></div>
}

function App() {
	return <SettingsProvider><LocaleProvider><LibraryProvider><AppContent /></LibraryProvider></LocaleProvider></SettingsProvider>
}

export default App
