import { ChevronRight, Plus, Settings } from 'lucide-react'
import { useLocale } from '../context/useLocale.js'

function Home({ items = [], onSettings, onAdd, onSelectReading }) {
  const hasItems = items.length > 0
  const { t, direction } = useLocale()

  return (
    <main className="screen-shell relative flex min-h-screen flex-col overflow-hidden bg-white text-[#111111]">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="type-title m-0 font-bold leading-[1.05]">
            {t('home.title')}
          </h1>
          <p className="type-subtitle title-subtitle-gap font-normal leading-none text-[#777777]">
            {t('home.subtitle')}
          </p>
        </div>

        <button
          type="button"
          aria-label={t('home.settings')}
          onClick={onSettings}
          className="top-control logical-end-4 absolute top-[var(--safe-top)] flex shrink-0 items-center justify-center rounded-full bg-[#f5f5f5] text-[#171717] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-4"
        >
          <Settings strokeWidth={2.5} size={24} aria-hidden="true" />
        </button>
      </header>

      {hasItems && (
        <ul className="mt-12 flex-1 space-y-3 overflow-y-auto pr-0">
          {items.map((item, index) => (
            <li key={item.id ?? item.title} className="list-item-enter" style={{ animationDelay: `${index * 35}ms` }}>
              <button type="button" onClick={() => onSelectReading?.(item)} className="flex min-h-[76px] w-full items-center gap-4 rounded-xl border border-[#F5F5F5] px-3 py-4 text-start transition-colors duration-120 hover:border-[#bdbdbd] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f3f3f3] text-[20px] text-[#202020]">{item.title?.charAt(0).toUpperCase()}</span>
                <span className="card-content min-w-0 flex-1"><strong className="type-card-title block overflow-hidden text-ellipsis whitespace-nowrap font-bold text-[#1A1A1A]">{item.title}</strong><span className="type-small card-subtitle-gap block font-medium text-[#787878]">{item.duration} · {item.sections} {item.sections === 1 ? t('home.sectionOne') : t('home.sectionMany')}</span></span>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full text-[#777777]" aria-hidden="true"><ChevronRight className={direction === 'rtl' ? 'icon-mirror' : ''} size={24} /></span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        aria-label={t('home.add')}
        onClick={onAdd}
        className="floating-add fixed bottom-10 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full bg-[#171717] text-white shadow-[0_8px_22px_rgba(0,0,0,0.08)] transition-transform duration-120 hover:scale-105 active:scale-[0.92] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-4"
      >
        <Plus size={28} strokeWidth={2.2} aria-hidden="true" />
      </button>
    </main>
  )
}

export default Home