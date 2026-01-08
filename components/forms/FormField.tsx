'use client';

import React from 'react';
import { Box, Typography, FormHelperText } from '@mui/material';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  children,
}: FormFieldProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.75, sm: 1 } }}>
      {/* Label row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography
          component="label"
          htmlFor={htmlFor}
          sx={{
            fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            fontWeight: 500,
            color: error ? 'error.main' : 'text.primary',
            cursor: 'pointer',
          }}
        >
          {label}
          {required && (
            <Typography component="span" sx={{ color: 'error.main', ml: 0.5 }}>
              *
            </Typography>
          )}
        </Typography>
        {hint && (
          <Typography
            variant="caption"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.8125rem' },
              color: 'text.secondary',
            }}
          >
            {hint}
          </Typography>
        )}
      </Box>

      {/* Input */}
      {children}

      {/* Error message */}
      {error && (
        <FormHelperText error sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' }, m: 0 }}>
          {error}
        </FormHelperText>
      )}
    </Box>
  );
}
