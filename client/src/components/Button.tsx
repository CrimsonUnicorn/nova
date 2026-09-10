import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
}

function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'

  const variantStyles = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-500',
    secondary:
      'border border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white',
    danger:
      'bg-red-600 text-white hover:bg-red-500',
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button