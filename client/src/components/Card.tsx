import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-lg border bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}

export default Card