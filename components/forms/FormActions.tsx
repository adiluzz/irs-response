'use client';

import React from 'react';
import { Box } from '@mui/material';

interface FormActionsProps {
  children: React.ReactNode;
  align?: 'left' | 'right' | 'between';
}

export function FormActions({ children, align = 'right' }: FormActionsProps) {
  const justifyMap = {
    left: 'flex-start',
    right: 'flex-end',
    between: 'space-between',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column-reverse', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: { xs: 'flex-start', sm: justifyMap[align] },
        gap: { xs: 2, sm: 1.5 },
        pt: { xs: 3, sm: 4 },
        mt: { xs: 2, sm: 1 },
        borderTop: 1,
        borderColor: 'divider',
        '& > *': {
          width: { xs: '100%', sm: 'auto' },
        },
      }}
    >
      {children}
    </Box>
  );
}
