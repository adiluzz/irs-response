import React from 'react'

interface FormPanelProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function FormPanel({ children }: FormPanelProps) {
  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'var(--space-8)',
        backgroundColor: 'var(--gray-50)',
      }}
    >
      {/* Brand header (LOGO + NAME ONLY) */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center', // ⬅ centers text with logo
            gap: '24px',
          }}
        >
          <img
            src="/brand/f3-crest.png"
            alt="F3"
            style={{
              width: '132px',
              height: '132px',
              objectFit: 'contain',
              opacity: 0.98,
            }}
          />

          <div
            style={{
              fontSize: 'calc(var(--text-xl) * 2)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--gray-900)',
              lineHeight: 1.1,
            }}
          >
            TAC Response Engine
          </div>
        </div>
      </div>

      {/* Descriptive line (MOVED HERE, ONCE) */}
      <div
        style={{
          marginBottom: 'var(--space-6)',
          fontSize: 'calc(var(--text-md) * 1.25)',
          fontStyle: 'italic',
          color: 'var(--gray-600)',
          maxWidth: '720px',
          lineHeight: 'var(--leading-relaxed)',
        }}
      >
        Deterministic IRS Notice Correspondence &amp; Resolution Platform
      </div>

      {/* Form card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--gray-200)',
          boxShadow: 'var(--shadow-xs)',
          padding: 'var(--space-8)',
          maxWidth: '720px',
        }}
      >
        {children}
      </div>
    </div>
  )
}
