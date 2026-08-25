import { useLocale } from '../context/useLocale.js'

function Loading() {
  const { t } = useLocale()
  return (
    <main className="flex items-center justify-center bg-white" aria-label={t('loading.label')}>
      <span className="size-12 animate-spin rounded-full border-4 border-[#e5e5e5] border-t-[#171717] motion-reduce:animate-none" aria-hidden="true" />
    </main>
  )
}

export default Loading