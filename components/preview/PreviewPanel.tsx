'use client'

import React, { useCallback, useState } from 'react'

export default function PreviewPanel({
  value,
  isPaid = false,
}: {
  value: string
  isPaid?: boolean
}) {
  const isEmpty = !value
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle')

  const watermarkOpacity = isPaid
    ? 'var(--wm-pane-opacity-paid)'
    : 'var(--wm-pane-opacity-free)'

  const handleCopy = useCallback(async () => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 2000)
    } catch {
      // noop
    }
  }, [value])

  const handleDownload = useCallback(() => {
    if (!value) return
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tac-response-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [value])

  return (
    <aside
      style={{
        width: 'var(--preview-width)',
        flexShrink: 0,
        backgroundColor: 'var(--gray-100)',
        borderLeft: '1px solid var(--gray-200)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* FREE: pane-wide watermark (PAID removes it via opacity token) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        <div
          style={{
            width: 'var(--wm-pane-size-free)',
            height: 'var(--wm-pane-size-free)',
            transform: `translateY(calc(var(--wm-pane-y) - 50%))`,
            backgroundImage: `url('/brand/f3-crest.png')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            opacity: watermarkOpacity,
            filter: 'grayscale(1) contrast(1.05)',
          }}
        />
      </div>

      {/* Header */}
      <header
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--gray-200)',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div>
          {/* Brand lockup */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <img
              src="/brand/f3-crest.png"
              alt="F3"
              style={{ width: 22, height: 22, objectFit: 'contain', opacity: 0.95 }}
            />
            <div style={{ lineHeight: 1.1 }}>
              <div
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  color: 'var(--gray-900)',
                }}
              >
                TAC Response Engine
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>
                IRS Notice Draft Preview
              </div>
            </div>
          </div>

          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>
            {isEmpty ? 'Generate a draft to preview it here.' : 'Draft generated and ready for review.'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={handleCopy}
            disabled={isEmpty}
            style={{
              border: '1px solid var(--gray-200)',
              background: '#fff',
              color: 'var(--gray-900)',
              padding: '8px 10px',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              opacity: isEmpty ? 0.5 : 1,
              cursor: isEmpty ? 'not-allowed' : 'pointer',
            }}
          >
            {copyState === 'copied' ? 'Copied' : 'Copy'}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isEmpty}
            style={{
              border: '1px solid var(--gray-900)',
              background: 'var(--gray-900)',
              color: '#fff',
              padding: '8px 10px',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              opacity: isEmpty ? 0.5 : 1,
              cursor: isEmpty ? 'not-allowed' : 'pointer',
            }}
          >
            Download
          </button>
        </div>
      </header>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px 20px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {isEmpty ? (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'var(--gray-500)',
              padding: 24,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--gray-200)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M8 13h8" />
                <path d="M8 17h8" />
              </svg>
            </div>
            <div style={{ fontWeight: 700, color: 'var(--gray-700)', marginBottom: 6 }}>
              No preview yet
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)', maxWidth: 280 }}>
              Fill the form, then click Generate.
            </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-paper)',
              padding: '40px 36px',
              minHeight: 640,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* PAID: small maker’s mark (optional provenance) */}
            {isPaid && (
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  right: 'var(--wm-mark-offset)',
                  bottom: 'var(--wm-mark-offset)',
                  width: 'var(--wm-mark-size)',
                  height: 'var(--wm-mark-size)',
                  backgroundImage: `url('/brand/f3-crest.png')`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundSize: 'contain',
                  opacity: 'var(--wm-mark-opacity)',
                  filter: 'grayscale(1) contrast(1.05)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              />
            )}

            <pre
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                margin: 0,
                fontSize: 12,
                lineHeight: 1.7,
                fontFamily: 'var(--font-mono)',
                color: 'var(--gray-800)',
              }}
            >
              {value}
            </pre>
          </div>
        )}
      </div>
    </aside>
  )
}
