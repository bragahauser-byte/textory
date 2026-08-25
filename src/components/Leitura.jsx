import { Settings, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSettings } from '../context/useSettings.js'
import { normalizeContent, paginateContent } from '../utils/pagination.js'
import ConfirmDelete from './ConfirmDelete.jsx'
import { useLocale } from '../context/useLocale.js'

function Leitura({ content, title, isRTL = false, onClose, onSettings, onDelete }) {
  const settings = useSettings()
  const { t } = useLocale()
  const readingStyle = {
    fontFamily: settings.fontFamily,
    fontSize: `${settings.fontSize}px`,
    fontWeight: 500,
    lineHeight: `${settings.lineHeight}px`,
    letterSpacing: settings.letterSpacing,
  }
  const rtl = isRTL || settings.language === 'arabe'
  const paragraphs = useMemo(() => normalizeContent(content), [content])
  const [pages, setPages] = useState([])
  const [page, setPage] = useState(0)
  const [controlsVisible, setControlsVisible] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    function paginate() {
      const safeTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safe-top')) || 64
      const result = paginateContent(paragraphs, {
        title,
        fontFamily: settings.fontFamily,
        fontSize: settings.fontSize,
        lineHeight: settings.lineHeight,
        letterSpacing: settings.letterSpacing,
        width: window.innerWidth - 32,
        contentTop: safeTop + 68,
      })
      setPages(result.length ? result : [[]])
      setPage((currentPage) => Math.min(currentPage, Math.max(result.length - 1, 0)))
    }

    document.fonts?.ready.then(paginate)
    window.addEventListener('resize', paginate)
    paginate()
    return () => window.removeEventListener('resize', paginate)
  }, [paragraphs, title, settings.fontFamily, settings.fontSize, settings.lineHeight, settings.letterSpacing])

  function handleTap(event) {
    const position = event.clientX / window.innerWidth
    if (position > 1 / 3 && position < 2 / 3) {
      setControlsVisible((visible) => !visible)
      return
    }

    const movesForward = rtl ? position < 1 / 3 : position > 2 / 3
    setPage((currentPage) => Math.max(0, Math.min(pages.length - 1, currentPage + (movesForward ? 1 : -1))))
  }

  const currentPage = pages[page] ?? []

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: settings.colors.background, color: settings.colors.primary }}
      dir={rtl ? 'rtl' : 'ltr'}
      onClick={handleTap}
    >
      <div key={page} className="page-crossfade chapter-content absolute inset-x-4" style={readingStyle}>
        {page === 0 && title && <h1 className="m-0 uppercase" style={{ ...readingStyle, color: '#1A1A1A' }}>{title}</h1>}
        <div className={page === 0 && title ? 'chapter-paragraph-gap' : ''}>
          {currentPage.map((paragraphIndex) => (
            <p key={`${page}-${paragraphIndex}`} className={`crossfade ${paragraphIndex !== currentPage[0] ? 'mt-6' : ''}`}>{paragraphs[paragraphIndex]}</p>
          ))}
        </div>
      </div>

      <span className={`page-indicator logical-end-4 absolute top-[var(--safe-top)] leading-none ${controlsVisible ? 'is-hidden' : ''}`} style={{ color: settings.colors.secondary }}>
        {String(page + 1).padStart(2, '0')}
      </span>

      <div className={`controls-transition absolute inset-x-0 top-[var(--safe-top)] flex items-center justify-between px-4 ${controlsVisible ? 'translate-y-0 opacity-100' : 'is-hidden pointer-events-none -translate-y-2 opacity-0'}`}>
        <button type="button" aria-label={t('reading.close')} onClick={(event) => { event.stopPropagation(); onClose?.() }} className="top-control flex items-center justify-center rounded-full bg-white text-[#292929] shadow-sm focus:outline-none focus:ring-2 focus:ring-black">
          <X size={24} strokeWidth={2.2} aria-hidden="true" />
        </button>
        <div className="flex gap-3"><button type="button" aria-label={t('reading.delete')} onClick={(event) => { event.stopPropagation(); setDeleteOpen(true) }} className="top-control flex items-center justify-center rounded-full bg-[#FFC3C4] text-[#ef233c] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ef233c]"><Trash2 size={24} strokeWidth={2.2} aria-hidden="true" /></button><button type="button" aria-label={t('reading.settings')} onClick={(event) => { event.stopPropagation(); onSettings?.() }} className="top-control flex items-center justify-center rounded-full bg-white text-[#292929] shadow-sm focus:outline-none focus:ring-2 focus:ring-black"><Settings size={24} strokeWidth={2.2} aria-hidden="true" /></button></div>
      </div>
      {deleteOpen && <ConfirmDelete onCancel={() => setDeleteOpen(false)} onConfirm={() => { setDeleteOpen(false); onDelete?.() }} />}
    </main>
  )
}

export default Leitura