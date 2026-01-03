import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
  children: React.ReactNode;
}

export function Select({ hasError = false, children, style, ...props }: SelectProps) {
  return (
    <select
      style={{
        width: '100%',
        padding: '10px 12px',
        fontSize: '14px',
        lineHeight: 1.5,
        color: 'var(--gray-900)',
        backgroundColor: '#ffffff',
        border: `1px solid ${hasError ? 'var(--red-600)' : 'var(--gray-300)'}`,
        borderRadius: 'var(--radius-md)',
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 12px center',
        paddingRight: '40px',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        ...style,
      }}
      {...props}
    >
      {children}
    </select>
  );
}