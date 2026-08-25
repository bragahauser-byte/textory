import { ArrowLeft, Check, ChevronRight } from 'lucide-react'
import { useLocale } from '../../context/useLocale.js'

export function BackButton({ onBack }) {
  const { t, direction } = useLocale()
  return <button type="button" aria-label={t('settings.back')} onClick={onBack} className="top-control flex items-center justify-center rounded-full bg-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-black"><ArrowLeft className={direction === 'rtl' ? 'icon-mirror' : ''} size={24} strokeWidth={2.2} /></button>
}

export function SettingsHeader({ title, onBack }) {
  return <><BackButton onBack={onBack} /><h1 className="type-title screen-header-gap m-0 font-bold leading-none">{title}</h1></>
}

export function OptionRow({ children, selected, onClick, preview }) {
  return <button type="button" onClick={onClick} className="flex min-h-[54px] w-full items-center justify-between border-b border-[#eeeeee] text-start text-[14px] text-[#202020] last:border-b-0 focus:outline-none"><span className={preview ?? ''}>{children}</span>{selected && <Check className="selection-pop" size={19} strokeWidth={2} />}</button>
}

export function SettingsRow({ label, value, onClick }) {
  const { direction } = useLocale()
  return <button type="button" onClick={onClick} className="flex min-h-[60px] w-full items-center justify-between border-b border-[#eeeeee] text-start text-[14px] text-[#202020] focus:outline-none"><span>{label}</span><span className="flex items-center gap-2 text-[#777777]">{value}<ChevronRight className={direction === 'rtl' ? 'icon-mirror' : ''} size={17} /></span></button>
}
