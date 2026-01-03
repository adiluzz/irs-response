'use client'

import React from 'react'

type LetterPreviewProps = {
  noticeType: string
}

/**
 * NOTE:
 * This assumes your existing LetterPreview already renders the preview content.
 * We are only adding:
 * 1) A "Download PDF" button that triggers window.print()
 * 2) A wrapper class `print-letter-root` so globals.css can target print layout
 */
export function LetterPreview({ noticeType }: LetterPreviewProps) {
  const onPrint = React.useCallback(() => {
    // Give the browser a tick to finish any last React paint
    requestAnimationFrame(() => window.print())
  }, [])

  return (
    <div className="print-letter-root">
      {/* Toolbar (hidden in print via CSS) */}
      <div className="letter-toolbar no-print" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ fontWeight: 600 }}>Preview</div>
        <div style={{ opacity: 0.7 }}>{noticeType}</div>

        <div style={{ marginLeft: 'auto' }}>
          <button
            type="button"
            onClick={onPrint}
            className="btn btn-primary"
            aria-label="Download PDF"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Printable area */}
      <div className="print-letter">
        {/* ✅ Keep your existing preview render here.
            If your current file already renders a letter component, DO NOT remove it.
            Just make sure it sits inside this .print-letter wrapper. */}

        {/* Example placeholder: replace with your real preview content */}
        {/* <RenderedLetter noticeType={noticeType} /> */}
      </div>
    </div>
  )
}
