'use client';
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Chip,
} from '@mui/material';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth/AuthGuard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const availableNotices = [
  {
    id: 'cp14',
    title: 'CP14',
    subtitle: 'Balance Due Notice',
    description:
      'Initial notice informing taxpayer of unpaid tax balance. Typically the first notice in the collection sequence.',
    href: '/notice/cp14',
    status: 'active',
    color: 'primary',
    icon: '📄',
  },
  {
    id: 'cp501',
    title: 'CP501',
    subtitle: 'Reminder Notice',
    description:
      'First reminder of unpaid balance. Follows CP14 if no response or payment received.',
    href: '/notice/cp501',
    status: 'active',
    color: 'warning',
    icon: '⚠️',
  },
  {
    id: 'cp503',
    title: 'CP503',
    subtitle: 'Second Reminder Notice',
    description:
      'Second reminder of unpaid balance. Issued after CP501 when no response or payment has been received.',
    href: '/notice/cp503',
    status: 'active',
    color: 'error',
    icon: '🔔',
  },
  {
    id: 'cp504',
    title: 'CP504',
    subtitle: 'Final Notice / Intent to Levy',
    description:
      'Final notice indicating intent to levy state tax refunds or other property if the balance remains unresolved.',
    href: '/notice/cp504',
    status: 'active',
    color: 'error',
    icon: '🚨',
  },
  {
    id: 'cp2000',
    title: 'CP2000',
    subtitle: 'Underreporter Inquiry',
    description:
      'Proposed adjustment notice for unreported income identified through IRS matching programs.',
    href: '/notice/cp2000',
    status: 'active',
    color: 'secondary',
    icon: '📊',
  },
];

export default function NoticeIndexPage() {
  return (
    <AuthGuard>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 5, md: 6 } }}>
          <Chip
            label="IRS Notice Response Generator"
            color="primary"
            sx={{ mb: 2 }}
          />
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Select a Notice Type
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ 
              maxWidth: 600, 
              mx: 'auto',
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
              px: { xs: 2, sm: 0 },
            }}
          >
            Generate deterministic, IRS-compliant response letters. Each generator
            produces consistent output based on taxpayer inputs.
          </Typography>
        </Box>

        {/* Notice Cards Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: { xs: 2, sm: 3 },
            mb: { xs: 4, sm: 5, md: 6 },
          }}
        >
          {availableNotices.map((notice, index) => (
            <Box key={notice.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'visible',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                {/* Accent Bar */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: (theme) => {
                      const colorPalette = theme.palette[notice.color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'];
                      if (colorPalette && typeof colorPalette === 'object' && 'main' in colorPalette) {
                        return `linear-gradient(90deg, ${colorPalette.main} 0%, ${colorPalette.light} 100%)`;
                      }
                      return theme.palette.primary.main;
                    },
                  }}
                />
                <CardActionArea component={Link} href={notice.href} sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    {/* Icon */}
                    <Box
                      sx={(theme) => {
                        const colorPalette = theme.palette[notice.color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'];
                        return {
                          width: { xs: 48, sm: 56 },
                          height: { xs: 48, sm: 56 },
                          borderRadius: 2,
                          backgroundColor: colorPalette?.light || theme.palette.primary.light,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: { xs: '1.5rem', sm: '2rem' },
                          mb: 2,
                          border: `2px solid ${colorPalette?.main || theme.palette.primary.main}20`,
                        };
                      }}
                    >
                      {notice.icon}
                    </Box>

                    {/* Notice ID Badge */}
                    <Chip
                      label={notice.title}
                      color={notice.color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'}
                      size="small"
                      sx={{ mb: 2, fontWeight: 700 }}
                    />

                    {/* Notice Subtitle */}
                    <Typography 
                      variant="h5" 
                      gutterBottom 
                      fontWeight={700}
                      sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' } }}
                    >
                      {notice.subtitle}
                    </Typography>

                    {/* Notice Description */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: { xs: 2, sm: 3 },
                        fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                      }}
                    >
                      {notice.description}
                    </Typography>

                    {/* Arrow indicator */}
                    <Box
                      sx={(theme) => {
                        const colorPalette = theme.palette[notice.color as 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'];
                        return {
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: colorPalette?.main || theme.palette.primary.main,
                          fontWeight: 600,
                          fontSize: '0.875rem',
                        };
                      }}
                    >
                      <span>Open Generator</span>
                      <ArrowForwardIcon fontSize="small" />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Footer note */}
        <Card
          sx={{
            p: { xs: 3, sm: 4 },
            textAlign: 'center',
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.success.light}15 0%, ${theme.palette.success.main}15 100%)`,
          }}
        >
          <Box
            sx={{
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              borderRadius: '50%',
              backgroundColor: 'success.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <CheckCircleIcon color="success" sx={{ fontSize: { xs: 24, sm: 32 } }} />
          </Box>
          <Typography 
            variant="body1" 
            sx={{ 
              maxWidth: 700, 
              mx: 'auto',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              px: { xs: 2, sm: 0 },
            }}
          >
            <strong>Deterministic Output:</strong> All generators produce identical
            letters for identical inputs. No AI interpretation, no variable language.
            Suitable for professional tax correspondence.
          </Typography>
        </Card>
      </Container>
    </AuthGuard>
  );
}
