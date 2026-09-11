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
    'rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50'

  const variantStyles = {
    primary:
      'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 active:bg-indigo-600',

    secondary:
      'border border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600 hover:bg-gray-800 hover:text-gray-100 active:bg-gray-700',

    danger:
      'bg-red-500 text-white shadow-sm hover:bg-red-400 active:bg-red-600',
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