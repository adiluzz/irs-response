import React from 'react';

interface FormActionsProps {
  children: React.ReactNode;
  align?: 'left' | 'right' | 'between';
}

export function FormActions({ children, align = 'right' }: FormActionsProps) {
  const justifyMap = {
    left: 'flex-start',
    right: 'flex-end',
    between: 'space-between',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: justifyMap[align],
        gap: '12px',
        paddingTop: '24px',
        marginTop: '8px',
        borderTop: '1px solid var(--gray-200)',
      }}
    >
      {children}
    </div>
  );
}