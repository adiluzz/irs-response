'use client';

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

type LetterPreviewProps = {
  noticeType: string;
  content?: string;
};

/**
 * LetterPreview component with responsive design
 */
export function LetterPreview({ noticeType, content }: LetterPreviewProps) {
  const onPrint = React.useCallback(() => {
    requestAnimationFrame(() => window.print());
  }, []);

  return (
    <Box
      className="print-letter-root"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      {/* Toolbar (hidden in print via CSS) */}
      <Box
        className="letter-toolbar no-print"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 2 },
          alignItems: { xs: 'stretch', sm: 'center' },
          p: { xs: 1.5, sm: 2, md: 3 },
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1, minWidth: 0 }}>
          <Typography 
            variant="subtitle1" 
            fontWeight={600}
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Preview
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
            noWrap
          >
            {noticeType}
          </Typography>
        </Box>

        <Box sx={{ ml: { xs: 0, sm: 'auto' }, width: { xs: '100%', sm: 'auto' }, flexShrink: 0 }}>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={onPrint}
            fullWidth={true}
            size="medium"
            sx={{
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: 140 },
              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            }}
            aria-label="Download PDF"
          >
            Download PDF
          </Button>
        </Box>
      </Box>

      {/* Printable area */}
      <Box
        className="print-letter"
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          p: { xs: 1.5, sm: 2, md: 3, lg: 4 },
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4, lg: 5 },
            backgroundColor: 'white',
            minHeight: '100%',
            width: '100%',
            maxWidth: { xs: '100%', sm: '100%', md: '8.5in' },
            mx: 'auto',
            boxSizing: 'border-box',
          }}
        >
          {content ? (
            <Box
              sx={{
                width: '100%',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                '& p': {
                  mb: 2,
                  lineHeight: 1.6,
                  fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '1rem' },
                  width: '100%',
                },
                '& h1, & h2, & h3': {
                  mb: 2,
                  mt: 3,
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                  width: '100%',
                },
                '& *': {
                  maxWidth: '100%',
                },
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                fontStyle: 'italic',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                textAlign: 'center',
                py: 4,
              }}
            >
              Generate a letter to see the preview here.
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
