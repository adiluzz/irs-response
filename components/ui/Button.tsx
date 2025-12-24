// components/ui/Button.tsx

import React, { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg ' +
      'transition-all duration-150 ' +
      'focus:outline-none focus:ring-2 focus:ring-offset-2 ' +
      'active:scale-[0.97] ' +
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none'

    const motionStyles =
      'hover:-translate-y-[1px] hover:shadow-lg active:translate-y-0'

    const variants: Record<string, string> = {
      primary:
        'bg-tac-navy text-white ' +
        'border border-[rgba(184,155,94,0.55)] ' +
        'hover:bg-tac-navy-light ' +
        'hover:border-[rgba(184,155,94,0.8)] ' +
        'hover:shadow-xl ' +
        'focus:ring-[rgba(184,155,94,0.6)] ' +
        'focus:ring-offset-white',

      secondary:
        'bg-slate-200 text-tac-text-primary border border-slate-300 ' +
        'hover:bg-slate-300 hover:border-slate-400 ' +
        'focus:ring-slate-400 focus:ring-offset-white',

      outline:
        'bg-white text-tac-navy border border-tac-navy ' +
        'hover:bg-tac-navy hover:text-white ' +
        'focus:ring-tac-navy focus:ring-offset-white',

      ghost:
        'bg-transparent text-tac-text-secondary ' +
        'hover:bg-slate-100 ' +
        'focus:ring-slate-400 focus:ring-offset-white',

      danger:
        'bg-red-600 text-white border border-red-600 ' +
        'hover:bg-red-700 hover:border-red-700 ' +
        'focus:ring-red-600 focus:ring-offset-white',
    }

    const sizes: Record<string, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    const widthClass = fullWidth ? 'w-full' : ''

    const combinedClassName =
      baseStyles +
      ' ' +
      motionStyles +
      ' ' +
      variants[variant] +
      ' ' +
      sizes[size] +
      ' ' +
      widthClass +
      ' ' +
      className

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }

