import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: 'var(--gray-900)',
    color: '#ffffff',
    border: '1px solid var(--gray-900)',
  },
  secondary: {
    backgroundColor: '#ffffff',
    color: 'var(--gray-700)',
    border: '1px solid var(--gray-300)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--gray-700)',
    border: '1px solid transparent',
  },
  danger: {
    backgroundColor: 'var(--red-600)',
    color: '#ffffff',
    border: '1px solid var(--red-600)',
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: '13px', borderRadius: 'var(--radius-sm)' },
  md: { padding: '10px 16px', fontSize: '14px', borderRadius: 'var(--radius-md)' },
  lg: { padding: '12px 24px', fontSize: '15px', borderRadius: 'var(--radius-md)' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s ease',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  return (
    <button style={baseStyle} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
