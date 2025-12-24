'use client'

interface LetterPreviewProps {
  payload: { rendered: string }
}

export function LetterPreview({ payload }: LetterPreviewProps) {
  return (
    <pre
      className="
        whitespace-pre-wrap
        font-serif
        text-sm
        leading-relaxed
        text-tac-text-primary
      "
    >
      {payload.rendered}
    </pre>
  )
}
