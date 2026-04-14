import type { ReactNode } from 'react'
import './Background.css'

type BackgroundProps = {
  children: ReactNode
  className?: string
}

const Background = ({ children, className = '' }: BackgroundProps) => {
  return (
    <div className={`background ${className}`}>
      <div aria-hidden="true" className="bg-tennis-court-cinematic" />
      <div aria-hidden="true" className="court-overlay" />
      <div aria-hidden="true" className="court-surface">
        <div className="court-grid" />
        <div className="court-glow-lines" />
      </div>

      <main className="background__content">{children}</main>
    </div>
  )
}

export default Background