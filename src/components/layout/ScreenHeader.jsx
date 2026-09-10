function ScreenHeader({ left, right, title, subtitle, animate = false, titleClassName = '', subtitleClassName = '' }) {
  return (
    <>
      <header className="flex items-start justify-between">
        {left || <span aria-hidden="true" />}
        {right}
      </header>
      {title && (
        <section className="screen-header-gap">
          <h1 className={`type-title m-0 font-bold leading-none ${animate ? 'content-enter' : ''} ${titleClassName}`.trim()}>{title}</h1>
          {subtitle && (
            <p
              className={`type-subtitle title-subtitle-gap leading-[1.25] text-[var(--color-text-secondary)] ${animate ? 'content-enter' : ''} ${subtitleClassName}`.trim()}
              style={animate ? { animationDelay: '70ms' } : undefined}
            >
              {subtitle}
            </p>
          )}
        </section>
      )}
    </>
  )
}

export default ScreenHeader
