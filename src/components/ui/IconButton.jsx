const VARIANT_CLASSES = {
  default: 'bg-[var(--color-surface)] text-[var(--color-text)] hover:scale-105 focus:ring-[var(--color-text)] focus:ring-offset-4',
  danger: 'bg-[var(--color-danger-soft-bg)] text-[var(--color-danger)] focus:ring-[var(--color-danger)] focus:ring-offset-2',
}

function IconButton({ icon, label, onClick, variant = 'default', className = '' }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`top-control flex items-center justify-center rounded-full transition-transform focus:outline-none focus:ring-2 focus:ring-offset-[var(--color-bg)] ${VARIANT_CLASSES[variant]} ${className}`.trim()}
    >
      {icon}
    </button>
  )
}

export default IconButton
