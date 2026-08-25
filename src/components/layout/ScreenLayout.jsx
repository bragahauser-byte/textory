function ScreenLayout({ children, className = '', ...props }) {
  return <div className={`screen-layout ${className}`.trim()} {...props}>{children}</div>
}

export default ScreenLayout
