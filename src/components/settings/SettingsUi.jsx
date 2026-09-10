import { ArrowLeft, Check, ChevronRight } from 'lucide-react'
import { useLocale } from '../../context/useLocale.js'

export function BackButton({ onBack }) {
  const { t, direction } = useLocale()
  return <button type="button" aria-label={t('settings.back')} onClick={onBack} className="top-control flex items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-text)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]"><ArrowLeft className={direction === 'rtl' ? 'icon-mirror' : ''} size={24} strokeWidth={2.2} /></button>
}

export function SettingsHeader({ title, onBack }) {
  return <><BackButton onBack={onBack} /><h1 className="type-title screen-header-gap m-0 font-bold leading-none">{title}</h1></>
}

export function OptionRow({ children, selected, onClick, preview }) {
  return <button type="button" onClick={onClick} className="flex min-h-[54px] w-full items-center justify-between border-b border-[var(--color-border)] text-start text-[14px] text-[var(--color-text)] last:border-b-0 focus:outline-none"><span className={preview ?? ''}>{children}</span>{selected && <Check className="selection-pop" size={19} strokeWidth={2} />}</button>
}

export function SettingsRow({ label, value, onClick }) {
  const { direction } = useLocale()
  return <button type="button" onClick={onClick} className="flex min-h-[60px] w-full items-center justify-between border-b border-[var(--color-border)] text-start text-[14px] text-[var(--color-text)] focus:outline-none"><span>{label}</span><span className="flex items-center gap-2 text-[var(--color-text-secondary)]">{value}<ChevronRight className={direction === 'rtl' ? 'icon-mirror' : ''} size={17} /></span></button>
}

export function SettingsToggleRow({ label, checked, onChange, switchLabel }) {
  return (
    <div className="flex min-h-[60px] w-full items-center justify-between border-b border-[var(--color-border)] text-start text-[14px] text-[var(--color-text)] last:border-b-0">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={switchLabel}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-text)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] ${checked ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border-hover)]'}`}
      >
        <span className={`absolute top-1 size-5 rounded-full bg-[var(--color-thumb)] shadow-sm transition-transform duration-150 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}
