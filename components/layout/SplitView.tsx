import React from 'react';

interface SplitViewProps {
  children: React.ReactNode;
}

export function SplitView({ children }: SplitViewProps) {
  return (
    <div
      style={{
        display: 'flex',
        height: `calc(100vh - var(--topbar-height))`,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}