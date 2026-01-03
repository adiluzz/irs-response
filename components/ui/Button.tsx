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
      style,
      ...props
    },
    ref
  ) => {
    // Base styles using CSS variables
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      fontWeight: 500,
      borderRadius: 'var(--radius-md)',
      transition: 'all var(--transition-base)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      outline: 'none',
      border: '1px solid',
      ...style,
    }

    // Size styles
    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: {
        padding: '6px 12px',
        fontSize: 'var(--text-sm)',
      },
      md: {
        padding: '10px 16px',
        fontSize: 'var(--text-sm)',
      },
      lg: {
        padding: '12px 24px',
        fontSize: 'var(--text-base)',
      },
    }

    // Variant styles
    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        backgroundColor: 'var(--gray-900)',
        color: '#ffffff',
        borderColor: 'rgba(184, 155, 94, 0.55)', // brand gold
        boxShadow: 'var(--shadow-xs)',
      },
      secondary: {
        backgroundColor: 'var(--gray-200)',
        color: 'var(--gray-900)',
        borderColor: 'var(--gray-300)',
        boxShadow: 'var(--shadow-xs)',
      },
      outline: {
        backgroundColor: '#ffffff',
        color: 'var(--gray-900)',
        borderColor: 'var(--gray-900)',
        boxShadow: 'var(--shadow-xs)',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'var(--gray-600)',
        borderColor: 'transparent',
        boxShadow: 'none',
      },
      danger: {
        backgroundColor: 'var(--red-600)',
        color: '#ffffff',
        borderColor: 'var(--red-600)',
        boxShadow: 'var(--shadow-xs)',
      },
    }

    // Hover styles (applied via onMouseEnter/onMouseLeave)
    const hoverStyles: Record<string, React.CSSProperties> = {
      primary: {
        backgroundColor: 'var(--gray-800)',
        borderColor: 'rgba(184, 155, 94, 0.8)',
        boxShadow: 'var(--shadow-md)',
        transform: 'translateY(-1px)',
      },
      secondary: {
        backgroundColor: 'var(--gray-300)',
        borderColor: 'var(--gray-400)',
        boxShadow: 'var(--shadow-md)',
        transform: 'translateY(-1px)',
      },
      outline: {
        backgroundColor: 'var(--gray-900)',
        color: '#ffffff',
        boxShadow: 'var(--shadow-md)',
        transform: 'translateY(-1px)',
      },
      ghost: {
        backgroundColor: 'var(--gray-100)',
        boxShadow: 'none',
        transform: 'translateY(-1px)',
      },
      danger: {
        backgroundColor: '#b91c1c',
        borderColor: '#b91c1c',
        boxShadow: 'var(--shadow-md)',
        transform: 'translateY(-1px)',
      },
    }

    // Active styles
    const activeStyles: Record<string, React.CSSProperties> = {
      primary: {
        transform: 'translateY(0) scale(0.98)',
        boxShadow: 'var(--shadow-xs)',
      },
      secondary: {
        transform: 'translateY(0) scale(0.98)',
        boxShadow: 'var(--shadow-xs)',
      },
      outline: {
        transform: 'translateY(0) scale(0.98)',
        boxShadow: 'var(--shadow-xs)',
      },
      ghost: {
        transform: 'translateY(0) scale(0.98)',
      },
      danger: {
        transform: 'translateY(0) scale(0.98)',
        boxShadow: 'var(--shadow-xs)',
      },
    }

    const [isHovered, setIsHovered] = React.useState(false)
    const [isActive, setIsActive] = React.useState(false)

    const combinedStyle: React.CSSProperties = {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(isHovered && !disabled ? hoverStyles[variant] : {}),
      ...(isActive && !disabled ? activeStyles[variant] : {}),
      ...(disabled
        ? {
            opacity: 0.4,
            cursor: 'not-allowed',
            pointerEvents: 'none' as const,
          }
        : {}),
      ...(fullWidth ? { width: '100%' } : {}),
    }

    return (
      <button
        ref={ref}
        className={className}
        style={combinedStyle}
        disabled={disabled}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          setIsActive(false)
        }}
        onMouseDown={() => !disabled && setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        onFocus={(e) => {
          props.onFocus?.(e)
          if (!disabled) {
            e.currentTarget.style.outline = '2px solid var(--blue-500)'
            e.currentTarget.style.outlineOffset = '2px'
          }
        }}
        onBlur={(e) => {
          props.onBlur?.(e)
          e.currentTarget.style.outline = 'none'
        }}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
