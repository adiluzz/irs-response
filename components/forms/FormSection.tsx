'use client';

import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <Box
      sx={{
        pb: { xs: 3, sm: 4 },
        mb: { xs: 3, sm: 4 },
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      {/* Section header */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1rem', sm: '1.125rem' },
            fontWeight: 600,
            color: 'text.primary',
            mb: description ? 0.5 : 0,
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
              color: 'text.secondary',
              lineHeight: 1.5,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {/* Section content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, sm: 2.5 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
