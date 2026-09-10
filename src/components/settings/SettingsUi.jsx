import { ArrowLeft, Check, ChevronRight } from 'lucide-react'
import { useLocale } from '../../context/useLocale.js'
import ScreenHeader from '../layout/ScreenHeader.jsx'
import IconButton from '../ui/IconButton.jsx'

export function BackButton({ onBack }) {
  const { t, direction } = useLocale()
  return <IconButton icon={<ArrowLeft className={direction === 'rtl' ? 'icon-mirror' : ''} size={24} strokeWidth={2.2} aria-hidden="true" />} label={t('settings.back')} onClick={onBack} />
}

export function SettingsHeader({ title, onBack }) {
  return <ScreenHeader left={<BackButton onBack={onBack} />} title={title} />
}

export function OptionRow({ children, selected, onClick, preview }) {
  return <button type="button" onClick={onClick} className="flex min-h-[54px] w-full items-center justify-between border-b border-[var(--color-border)] text-start text-[14px] text-[var(--color-text)] last:border-b-0 focus:outline-none"><span className={preview ?? ''}>{children}</span>{selected && <Check className="selection-pop" size={19} strokeWidth={2} />}</button>
}

export function SettingsRow({ label, value, onClick }) {
  const { direction } = useLocale()
  return <button type="button" onClick={onClick} className="flex min-h-[60px] w-full items-center justify-between border-b border-[var(--color-border)] text-start text-[14px] text-[var(--color-text)] focus:outline-none"><span>{label}</span><span className="flex items-center gap-2 text-[var(--color-text-secondary)]">{value}<ChevronRight className={direction === 'rtl' ? 'icon-mirror' : ''} size={17} /></span></button>
}

export function SettingsToggleRow({ label, value, checked, onChange, switchLabel }) {
  return (
    <div className="flex min-h-[60px] w-full items-center justify-between border-b border-[var(--color-border)] text-start text-[14px] text-[var(--color-text)] last:border-b-0">
      <span>{label}</span>
      <span className="flex items-center gap-3">
        {value && <span className="text-[var(--color-text-secondary)]">{value}</span>}
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={switchLabel}
          onClick={() => onChange(!checked)}
          className={`relative h-7 w-16 shrink-0 rounded-full p-[2px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-text)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] ${checked ? 'bg-[#1A1A1A]' : 'bg-[#A3A3A3]'}`}
        >
          <span className={`block h-6 w-[39px] rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-[21px]' : 'translate-x-0'}`} />
        </button>
      </span>
    </div>
  )
}
