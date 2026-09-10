import { useLocale } from '../context/useLocale.js'

function Loading() {
  const { t } = useLocale()
  return (
    <main className="flex items-center justify-center bg-[var(--color-bg)]" aria-label={t('loading.label')}>
      <span className="size-12 animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-accent)] motion-reduce:animate-none" aria-hidden="true" />
    </main>
  )
}

export default Loading