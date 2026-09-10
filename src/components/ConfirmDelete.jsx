import { useLocale } from '../context/useLocale.js'

function ConfirmDelete({ onCancel, onConfirm }) {
  const { t } = useLocale()
  return (
    <div className="modal-overlay-enter fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-overlay)] px-4" role="presentation" onClick={onCancel}>
      <section role="dialog" aria-modal="true" aria-labelledby="delete-title" className="modal-card-enter w-full max-w-[280px] rounded-[24px] bg-[var(--color-bg)] p-4 text-start shadow-xl" onClick={(event) => event.stopPropagation()}>
        <h2 id="delete-title" className="type-title m-0 font-bold leading-tight text-[var(--color-text)]">{t('delete.title')}</h2>
        <p className="type-subtitle title-subtitle-gap leading-[1.2] text-[var(--color-text)]">{t('delete.description')}</p>
        <div className="mt-7 space-y-2">
          <button type="button" onClick={onCancel} className="primary-action w-full rounded-full bg-[var(--color-surface)] text-[16px] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-text)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]">{t('delete.cancel')}</button>
          <button type="button" onClick={onConfirm} className="primary-action w-full rounded-full bg-[var(--color-danger-solid)] text-[16px] text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-danger-solid)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]">{t('delete.confirm')}</button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmDelete