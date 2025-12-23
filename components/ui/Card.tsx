import React from 'react';

interface CardProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

const paddingMap: Record<NonNullable<CardProps['padding']>, string> = {
  none: '0',
  sm: '16px',
  md: '24px',
  lg: '32px',
};

export function Card({ children, padding = 'md', style }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--gray-200)',
        padding: paddingMap[padding],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
