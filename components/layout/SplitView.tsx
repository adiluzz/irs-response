import React from 'react';

interface SplitViewProps {
  children: React.ReactNode;
}

export function SplitView({ children }: SplitViewProps) {
  const [left, right] = React.Children.toArray(children);

  return (
    <div
      style={{
        display: 'flex',
        height: `calc(100vh - var(--topbar-height))`,
        overflow: 'hidden',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
      }}
    >
      <div
        className="panel-surface gold-frame"
        style={{
          flex: 1,
          minWidth: 0,
          overflowY: 'auto',
          paddingRight: 'var(--space-2)',
        }}
      >
        {left}
      </div>

      <div
        className="panel-surface gold-frame"
        style={{
          width: 'var(--preview-width)',
          flexShrink: 0,
        }}
      >
        {right}
      </div>
    </div>
  );
}
