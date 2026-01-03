import React from 'react';

interface FormRowProps {
  columns?: 1 | 2 | 3;
  children: React.ReactNode;
}

export function FormRow({ columns = 2, children }: FormRowProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '16px',
      }}
    >
      {children}
    </div>
  );
}