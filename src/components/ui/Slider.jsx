import { useEffect, useRef, useState } from 'react'
import { useLocale } from '../../context/useLocale.js'

function Slider({ value, onChange, min = 0, max = 100, step = 1, steps, className = '' }) {
  const trackRef = useRef(null)
  const pointerStartRef = useRef(0)
  const [dragging, setDragging] = useState(false)
  const [trackWidth, setTrackWidth] = useState(0)
  const { direction } = useLocale()
  const isRTL = direction === 'rtl'
  const values = steps ?? null
  const currentIndex = values ? Math.max(0, values.indexOf(value)) : null
  const percentage = values
    ? (values.length <= 1 ? 0 : (currentIndex / (values.length - 1)) * 100)
    : ((value - min) / (max - min)) * 100
  const visualPercentage = isRTL ? 100 - percentage : percentage
  const thumbX = (visualPercentage / 100) * Math.max(trackWidth - 56, 0)

  useEffect(() => {
    if (!trackRef.current) return undefined
    const observer = new ResizeObserver(([entry]) => setTrackWidth(entry.contentRect.width))
    observer.observe(trackRef.current)
    return () => observer.disconnect()
  }, [])

  function valueFromPointer(clientX) {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    const thumbWidth = 56
    const x = Math.min(Math.max(clientX - rect.left - thumbWidth / 2, 0), Math.max(rect.width - thumbWidth, 0))
    const visualPercent = rect.width <= thumbWidth ? 0 : x / (rect.width - thumbWidth)
    const percent = isRTL ? 1 - visualPercent : visualPercent
    if (values) {
      const index = Math.round(percent * (values.length - 1))
      onChange(values[index])
      return
    }
    const raw = min + percent * (max - min)
    onChange(Math.round(raw / step) * step + min - Math.round(min / step) * step)
  }

  function handlePointerDown(event) {
    event.preventDefault()
    pointerStartRef.current = event.clientX
    setDragging(false)
    event.currentTarget.setPointerCapture?.(event.pointerId)
    valueFromPointer(event.clientX)
  }

  function handlePointerMove(event) {
    if (Math.abs(event.clientX - pointerStartRef.current) > 2) {
      setDragging(true)
      valueFromPointer(event.clientX)
    }
  }

  useEffect(() => {
    function stopDragging() { setDragging(false) }
    window.addEventListener('pointerup', stopDragging)
    return () => window.removeEventListener('pointerup', stopDragging)
  }, [])

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex="0"
      aria-valuemin={values ? values[0] : min}
      aria-valuemax={values ? values[values.length - 1] : max}
      aria-valuenow={value}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onKeyDown={(event) => {
        const keyDirection = event.key === 'ArrowRight' || event.key === 'ArrowUp' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -1 : 0
        if (!keyDirection) return
        event.preventDefault()
        const logicalDirection = isRTL && (event.key === 'ArrowLeft' || event.key === 'ArrowRight') ? -keyDirection : keyDirection
        if (values) onChange(values[Math.max(0, Math.min(values.length - 1, currentIndex + logicalDirection))])
        else onChange(Math.max(min, Math.min(max, value + logicalDirection * step)))
      }}
      className={`relative h-10 w-full touch-none cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-bg)] ${className}`}
    >
      <span className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[var(--slider-track-empty)]" style={{ background: `linear-gradient(to right, var(--slider-track-fill) ${visualPercentage}%, var(--slider-track-empty) ${visualPercentage}%)` }} />
      <span className={`absolute left-0 top-1/2 h-10 w-14 rounded-full bg-[var(--slider-knob)] shadow-[0_2px_8px_rgba(0,0,0,0.15)] ${dragging ? '' : 'transition-transform duration-120 ease-out'}`} style={{ transform: `translateX(${thumbX}px) translateY(-50%)` }} />
    </div>
  )
}

export default Slider