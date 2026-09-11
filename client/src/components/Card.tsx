import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-800/80 bg-gray-900/80 p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}

export default Card