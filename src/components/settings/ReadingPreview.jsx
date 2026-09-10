function ReadingPreview({ height, className = '', style = {}, children }) {
  const lineHeightPx = parseFloat(style.lineHeight) || height
  const maxLines = Math.max(1, Math.floor(height / lineHeightPx))
  return (
    <div
      className={className}
      style={{
        ...style,
        height,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: maxLines,
      }}
    >
      {children}
    </div>
  )
}

export default ReadingPreview
