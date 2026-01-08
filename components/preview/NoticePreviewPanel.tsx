'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Button } from '@/components/ui/Button';
import { LetterPreview } from './LetterPreview';

type CopyState = 'idle' | 'copied';

interface NoticePreviewPanelProps {
  generatedOutput: string;
  noticeType?: string;
  showPdfButton?: boolean;
  isPaid?: boolean;
  useLetterPreview?: boolean; // If true, uses LetterPreview component instead of pre tag
  previewScrollRef?: React.RefObject<HTMLDivElement | null>;
}

export function NoticePreviewPanel({
  generatedOutput,
  noticeType,
  showPdfButton = false,
  isPaid = false,
  useLetterPreview = false,
  previewScrollRef: externalRef,
}: NoticePreviewPanelProps) {
  const hasGenerated = Boolean(generatedOutput);
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const internalRef = useRef<HTMLDivElement>(null);
  const scrollRef = externalRef || internalRef;

  // Scroll to top when new output is generated
  useEffect(() => {
    if (hasGenerated && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [hasGenerated, generatedOutput, scrollRef]);

  const handleCopy = useCallback(async () => {
    if (!generatedOutput) return;
    try {
      await navigator.clipboard.writeText(generatedOutput);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [generatedOutput]);

  const handleDownload = useCallback(() => {
    if (!generatedOutput) return;
    const blob = new Blob([generatedOutput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tac-letter-${noticeType || 'response'}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [generatedOutput, noticeType]);

  const handlePdf = useCallback(() => {
    if (!generatedOutput) return;

    const safeText = generatedOutput
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const wmOpacity = isPaid ? 0.06 : 0.1;

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
</html>`;

    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  }, [generatedOutput, isPaid]);

  return (
    <Box
      component="aside"
      sx={{
        width: 'var(--preview-width)',
        flexShrink: 0,
        backgroundColor: 'grey.100',
        borderLeft: { xs: 'none', lg: '1px solid' },
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          padding: { xs: '12px 16px', sm: '12px 16px' },
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: { xs: '14px', sm: '14px' },
              fontWeight: 600,
              color: 'text.primary',
              mb: 0.25,
            }}
          >
            Document Preview
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: '12px', sm: '12px' },
              color: 'text.secondary',
            }}
          >
            {hasGenerated ? 'Draft ready for review' : 'Complete fields and generate'}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={!hasGenerated}
          >
            {copyState === 'copied' ? 'Copied' : 'Copy'}
          </Button>
          {showPdfButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePdf}
              disabled={!hasGenerated}
            >
              PDF
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            disabled={!hasGenerated}
          >
            Download
          </Button>
        </Box>
      </Box>

      {/* Content Area */}
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: { xs: '12px', sm: '12px' },
          boxSizing: 'border-box',
        }}
      >
        {hasGenerated ? (
          <Box
            sx={{
              backgroundColor: 'background.paper',
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              boxShadow: 2,
              padding: { xs: '16px', sm: '16px', md: '20px' },
              minHeight: { xs: '400px', sm: '400px', md: '500px' },
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Watermark for CP90/CP91 */}
            {showPdfButton && (
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  opacity: isPaid ? 0.06 : 0.1,
                  filter: 'grayscale(1) contrast(1.05)',
                }}
              >
                <Box
                  sx={{
                    width: { xs: '100%', sm: '300px', md: '420px' },
                    maxWidth: '420px',
                    height: { xs: '200px', sm: '300px', md: '420px' },
                    backgroundImage: 'url(/brand/f3-crest.png)',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'contain',
                    transform: 'translateY(-24px)',
                  }}
                />
              </Box>
            )}

            {/* Content */}
            {useLetterPreview ? (
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <LetterPreview noticeType={noticeType || ''} content={generatedOutput} />
              </Box>
            ) : (
              <Box
                component="pre"
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  fontFamily: 'monospace',
                  fontSize: { xs: '11px', sm: '11px', md: '12px' },
                  lineHeight: 1.6,
                  color: 'text.primary',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  overflowX: 'hidden',
                  margin: 0,
                  padding: 0,
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                }}
              >
                {generatedOutput}
              </Box>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'text.disabled',
              minHeight: { xs: '300px', sm: '400px' },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: 'text.secondary',
                mb: 0.5,
                fontSize: { xs: '0.875rem', sm: '0.875rem' },
              }}
            >
              Awaiting Input
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontSize: { xs: '12px', sm: '12px' },
                color: 'text.disabled',
              }}
            >
              Complete required fields and click Generate
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
