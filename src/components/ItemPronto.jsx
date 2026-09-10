import { Pencil, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import ConfirmDelete from './ConfirmDelete.jsx'
import { useLocale } from '../context/useLocale.js'

function ItemPronto({ title, subtitle, onRead, onClose, onDelete, onEdit }) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { t } = useLocale()

  return (
    <main className="relative flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="flex items-start justify-between">
        <button
          type="button"
          aria-label={t('itemReady.close')}
          onClick={onClose}
          className="top-control flex items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-text)] transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--color-text)] focus:ring-offset-4 focus:ring-offset-[var(--color-bg)]"
        >
          <X size={24} strokeWidth={2.3} aria-hidden="true" />
        </button>
        <div className="flex gap-3"><button type="button" aria-label={t('itemReady.delete')} onClick={() => setDeleteOpen(true)} className="top-control flex items-center justify-center rounded-full bg-[var(--color-danger-soft-bg)] text-[var(--color-danger)] focus:outline-none focus:ring-2 focus:ring-[var(--color-danger)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]"><Trash2 size={24} strokeWidth={2.3} aria-hidden="true" /></button><button type="button" aria-label={t('itemReady.edit')} onClick={onEdit} className="top-control flex items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-text)] focus:ring-offset-4 focus:ring-offset-[var(--color-bg)]"><Pencil size={24} strokeWidth={2.3} aria-hidden="true" /></button></div>
      </header>

      <section className="screen-header-gap">
        <h1 className="type-title content-enter m-0 font-bold leading-none">{title}</h1>
        <p className="type-subtitle content-enter title-subtitle-gap text-[var(--color-text-secondary)]" style={{ animationDelay: '70ms' }}>{subtitle}</p>
      </section>

      <button
        type="button"
        onClick={onRead}
        className="primary-action mt-auto w-full rounded-full bg-[var(--color-accent)] text-[16px] text-[var(--color-accent-text)] transition-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-[var(--color-text)] focus:ring-offset-4 focus:ring-offset-[var(--color-bg)]"
      >
        {t('itemReady.read')}
      </button>
      {deleteOpen && <ConfirmDelete onCancel={() => setDeleteOpen(false)} onConfirm={() => { setDeleteOpen(false); onDelete?.() }} />}
    </main>
  )
}

export default ItemPronto
