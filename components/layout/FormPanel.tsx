'use client';

import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import React from 'react';

interface FormPanelProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  noticeBadge?: string;
}

export function FormPanel({ title, subtitle, children, noticeBadge }: FormPanelProps) {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: 'background.default',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        minHeight: 0, // Allow flex shrinking
      }}
    >
      {/* Brand header */}
      <Box sx={{ mb: { xs: 3, md: 4 }, width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: { xs: 2, sm: 3 },
            mb: 2,
            width: '100%',
          }}
        >
          <Box
            component="img"
            src="/brand/f3-crest.png"
            alt="F3"
            sx={{
              width: { xs: 64, sm: 80, md: 100, lg: 132 },
              height: { xs: 64, sm: 80, md: 100, lg: 132 },
              objectFit: 'contain',
              opacity: 0.98,
              flexShrink: 0,
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'text.primary',
                lineHeight: 1.1,
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem', lg: '2.5rem' },
                wordBreak: 'break-word',
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '1rem' },
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Notice badge */}
        {noticeBadge && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={noticeBadge}
              sx={{
                backgroundColor: 'grey.900',
                color: 'white',
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                height: { xs: 28, sm: 32 },
              }}
            />
          </Box>
        )}

        {/* Descriptive line */}
        <Typography
          variant="body2"
          sx={{
            fontStyle: 'italic',
            color: 'text.secondary',
            width: '100%',
            maxWidth: { xs: '100%', md: '720px' },
            fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '1rem' },
          }}
        >
          Deterministic IRS Notice Correspondence &amp; Resolution Platform
        </Typography>
      </Box>

      {/* Form card */}
      <Card
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', md: '720px' },
          boxShadow: 2,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4, lg: 5 }, width: '100%', boxSizing: 'border-box' }}>
          {children}
        </CardContent>
      </Card>
    </Box>
  );
}
