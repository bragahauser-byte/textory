import { Pencil, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import ConfirmDelete from './ConfirmDelete.jsx'
import { useLocale } from '../context/useLocale.js'
import ScreenHeader from './layout/ScreenHeader.jsx'
import IconButton from './ui/IconButton.jsx'

function ItemPronto({ title, subtitle, onRead, onClose, onDelete, onEdit }) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const { t } = useLocale()

  return (
    <main className="relative flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <ScreenHeader
        left={<IconButton icon={<X size={24} strokeWidth={2.3} aria-hidden="true" />} label={t('itemReady.close')} onClick={onClose} />}
        right={(
          <div className="flex gap-3">
            <IconButton icon={<Trash2 size={24} strokeWidth={2.3} aria-hidden="true" />} label={t('itemReady.delete')} onClick={() => setDeleteOpen(true)} variant="danger" />
            <IconButton icon={<Pencil size={24} strokeWidth={2.3} aria-hidden="true" />} label={t('itemReady.edit')} onClick={onEdit} />
          </div>
        )}
        title={title}
        subtitle={subtitle}
        animate
      />

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
