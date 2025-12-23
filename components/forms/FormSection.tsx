import React from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div
      style={{
        paddingBottom: '24px',
        marginBottom: '24px',
        borderBottom: '1px solid var(--gray-200)',
      }}
    >
      {/* Section header */}
      <div style={{ marginBottom: '20px' }}>
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--gray-900)',
            marginBottom: '4px',
          }}
        >
          {title}
        </h3>
        {description && (
          <p
            style={{
              fontSize: '13px',
              color: 'var(--gray-500)',
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Section content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {children}
      </div>
    </div>
  );
}