import React from 'react';

interface FormPanelProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function FormPanel({ title, subtitle, children }: FormPanelProps) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '32px',
        backgroundColor: 'var(--gray-50)',
      }}
    >
      {/* Page header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--gray-900)',
            marginBottom: '8px',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: '15px',
              color: 'var(--gray-500)',
              lineHeight: 1.5,
              maxWidth: '600px',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Form card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--gray-200)',
          padding: '32px',
          maxWidth: '720px',
        }}
      >
        {children}
      </div>
    </div>
  );
}