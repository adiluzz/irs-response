'use client'

import React, { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'

type CopyState = 'idle' | 'copied'

interface PreviewPaneProps {
  hasGenerated: boolean
  rendered: string
  copyState: CopyState
  onCopy: () => void
  onDownload: () => void
  onPrint: () => void
}

export function PreviewPane({
  hasGenerated,
  rendered,
  copyState,
  onCopy,
  onDownload,
  onPrint,
}: PreviewPaneProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // Contract: whenever new output arrives, preview starts at TOP.
  useEffect(() => {
    if (!hasGenerated) return
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = 0
  }, [hasGenerated, rendered])

  return (
    <aside
      style={{
        // Clamp width so the right edge never gets pushed off-screen.
        // This is the “buttons disappear” fix.
        width: 'min(var(--preview-width), 52vw)',
        flexShrink: 1,
        minWidth: 360,

        backgroundColor: 'var(--gray-100)',
        borderLeft: '1px solid var(--gray-200)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--gray-200)',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          gap: 12,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h2
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--gray-900)',
              marginBottom: '2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Document Preview
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>
            {hasGenerated ? 'Draft ready for review' : 'Complete fields and generate'}
          </p>
        </div>

        {hasGenerated && (
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <Button variant="ghost" size="sm" onClick={onCopy}>
              {copyState === 'copied' ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="secondary" size="sm" onClick={onDownload}>
              Download
            </Button>
            <Button variant="secondary" size="sm" onClick={onPrint}>
              Print
            </Button>
          </div>
        )}
      </header>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px 20px',
        }}
      >
        {hasGenerated ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 4px 12px 0 rgb(0 0 0 / 0.03)',
              padding: '40px 36px',
              minHeight: '600px',
              maxWidth: '100%',
              overflow: 'hidden',
            }}
          >
            <pre
              style={{
                maxWidth: '100%',
                whiteSpace: 'pre-wrap',
                overflowX: 'hidden',
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                lineHeight: '1.7',
                color: 'var(--gray-800)',
                margin: 0,
              }}
            >
              {rendered}
            </pre>
          </div>
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'var(--gray-400)',
            }}
          >
            <p style={{ fontWeight: 500, color: 'var(--gray-500)', marginBottom: '4px' }}>
              Awaiting Input
            </p>
            <p style={{ fontSize: '12px' }}>Complete required fields and click Generate</p>
          </div>
        )}
      </div>
    </aside>
  )
}

