'use client';

import React from 'react';
import { Box, useTheme } from '@mui/material';

interface SplitViewProps {
  children: React.ReactNode;
}

export function SplitView({ children }: SplitViewProps) {
  const theme = useTheme();
  const [left, right] = React.Children.toArray(children);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        height: { xs: 'auto', lg: 'calc(100vh - 64px)' },
        minHeight: { xs: '100vh', lg: 'auto' },
        overflow: { xs: 'visible', lg: 'hidden' },
        gap: { xs: 0, sm: 2, lg: 3 },
        p: { xs: 0, sm: 2, lg: 3 },
        backgroundColor: 'background.default',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      {/* Left Panel - Form */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          width: { xs: '100%', lg: '50%' },
          maxWidth: { xs: '100%', lg: 'none' },
          overflowY: { xs: 'visible', lg: 'auto' },
          maxHeight: { xs: 'none', lg: '100%' },
          pr: { xs: 0, lg: 1 },
        }}
      >
        {left}
      </Box>

      {/* Right Panel - Preview */}
      <Box
        sx={{
          width: { xs: '100%', lg: '50%' },
          maxWidth: { xs: '100%', lg: '600px' },
          flexShrink: 0,
          position: { xs: 'relative', lg: 'sticky' },
          top: { xs: 0, lg: 0 },
          height: { xs: 'auto', lg: '100%' },
          maxHeight: { xs: '70vh', sm: '80vh', lg: '100%' },
          overflowY: 'auto',
          borderLeft: { xs: 'none', lg: `1px solid ${theme.palette.divider}` },
          borderTop: { xs: `1px solid ${theme.palette.divider}`, lg: 'none' },
          pt: { xs: 2, lg: 0 },
          pl: { xs: 0, lg: 3 },
          backgroundColor: { xs: 'background.paper', lg: 'transparent' },
        }}
      >
        {right}
      </Box>
    </Box>
  );
}
