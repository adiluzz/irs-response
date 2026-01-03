'use client'

import React, { useCallback, useState } from 'react'
import { Button } from '@/components/ui/Button'

export default function PreviewPanel({
  value,
  isPaid = false,
}: {
  value: string
  isPaid?: boolean
}) {
  const hasGenerated = Boolean(value)
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle')

  const handleCopy = useCallback(async () => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 2000)
    } catch {}
  }, [value])

  const handleDownload = useCallback(() => {
    if (!value) return
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tac-letter-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [value])

  const handlePDF = useCallback(() => {
    if (!value) return

    const safeText = value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    const wmOpacity = isPaid ? 0.06 : 0.1

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>TAC Response PDF</title>
<style>
@page { margin: 0.75in; }
body {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  margin: 0;
  color: #111827;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.page {
  position: relative;
  min-height: 100vh;
}
.wm {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: ${wmOpacity};
  filter: grayscale(1) contrast(1.05);
}
.wm::before {
  content: "";
  width: 520px;
  height: 520px;
  background: url('/brand/f3-crest.png') center/contain no-repeat;
  transform: translateY(-40px);
}
pre {
  position: relative;
  z-index: 1;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 12px;
  line-height: 1.7;
}
</style>
</head>
<body>
<div class="page">
  <div class="wm"></div>
  <pre>${safeText}</pre>
</div>
<script>
  window.onload = () => {
    window.focus()
    window.print()
  }
</script>
</body>
</html>`

    const w = window.open('', '_blank', 'noopener,noreferrer')
    if (!w) return
    w.document.open()
    w.document.write(html)
    w.document.close()
  }, [value, isPaid])

  return (
    <aside
      style={{
        width: 'var(--preview-width)',
        background: 'var(--gray-100)',
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
          background: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Document Preview</div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>
            {hasGenerated ? 'Draft ready for review' : 'Complete fields and generate'}
          </div>
        </div>

        {hasGenerated && (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="sm" variant="ghost" onClick={handleCopy}>
              {copyState === 'copied' ? 'Copied' : 'Copy'}
            </Button>
            <Button size="sm" variant="ghost" onClick={handlePDF}>
              PDF
            </Button>
            <Button size="sm" variant="secondary" onClick={handleDownload}>
              Download
            </Button>
          </div>
        )}
      </header>

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: 24,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {hasGenerated ? (
          <div style={{ width: '100%', maxWidth: 860 }}>
            <div
              style={{
                background: '#fff',
                border: '1px solid var(--gray-200)',
                borderRadius: 8,
                padding: '40px 36px',
                minHeight: 600,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isPaid ? 0.06 : 0.1,
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    width: 420,
                    height: 420,
                    background: `url('/brand/f3-crest.png') center/contain no-repeat`,
                    transform: 'translateY(-24px)',
                  }}
                />
              </div>

              <pre
                style={{
                  position: 'relative',
                  zIndex: 1,
                  fontSize: 12,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {value}
              </pre>
            </div>
          </div>
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
            }}
          >
            Awaiting Input
          </div>
        )}
      </div>
    </aside>
  )
}
