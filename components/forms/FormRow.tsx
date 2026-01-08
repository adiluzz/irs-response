'use client';

import React from 'react';
import { Box } from '@mui/material';

interface FormRowProps {
  columns?: 1 | 2 | 3;
  children: React.ReactNode;
}

export function FormRow({ columns = 2, children }: FormRowProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: columns === 1 ? '1fr' : columns === 2 ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
          md: `repeat(${columns}, 1fr)`,
        },
        gap: { xs: 2, sm: 2.5 },
      }}
    >
      {children}
    </Box>
  );
}
