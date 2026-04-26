import React from 'react'

interface BentoCardProps {
  children: React.ReactNode
  className?: string
  padding?: boolean
}

export function BentoCard({ children, className = '', padding = true }: BentoCardProps) {
  return (
    <div className={`bg-white rounded-[24px] shadow-[0_10px_30px_rgba(109,40,217,0.04)] ${padding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  )
}
