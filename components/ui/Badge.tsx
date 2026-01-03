import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  default: { backgroundColor: 'var(--blue-50)', color: 'var(--blue-700)' },
  success: { backgroundColor: 'var(--green-50)', color: 'var(--green-600)' },
  warning: { backgroundColor: 'var(--amber-50)', color: 'var(--amber-600)' },
  error: { backgroundColor: 'var(--red-50)', color: 'var(--red-600)' },
  muted: { backgroundColor: 'var(--gray-100)', color: 'var(--gray-600)' },
};

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    fontWeight: 500,
    borderRadius: '9999px',
    whiteSpace: 'nowrap',
    ...(size === 'sm'
      ? { fontSize: '11px', padding: '2px 8px', letterSpacing: '0.01em' }
      : { fontSize: '12px', padding: '4px 10px' }),
    ...variantStyles[variant],
  };

  return <span style={baseStyle}>{children}</span>;
}
