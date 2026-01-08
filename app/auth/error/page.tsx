'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const dynamic = 'force-dynamic';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  const errorMessages: Record<string, string> = {
    InvalidToken: 'Invalid verification token.',
    InvalidOrExpiredToken: 'The verification link is invalid or has expired.',
    VerificationFailed: 'Email verification failed. Please try again.',
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Default: 'An error occurred during authentication.',
  };

  const message = errorMessages[error || ''] || errorMessages.Default;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.error.light} 0%, ${theme.palette.error.main} 100%)`,
        p: 3,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <Container maxWidth="sm">
        <Card
          sx={{
            position: 'relative',
            zIndex: 1,
            borderRadius: 4,
            boxShadow: 8,
            textAlign: 'center',
          }}
        >
          <CardContent sx={{ p: { xs: 4, sm: 6 } }}>
            <Box
              sx={{
                width: { xs: 64, sm: 80 },
                height: { xs: 64, sm: 80 },
                borderRadius: '50%',
                backgroundColor: 'error.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: 'error.main' }} />
            </Box>
            <Typography variant="h4" gutterBottom fontWeight={800} sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              Authentication Error
            </Typography>
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              {message}
            </Alert>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                justifyContent: 'center',
              }}
            >
              <Button
                component={Link}
                href="/auth/login"
                variant="contained"
                fullWidth={true}
                sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 150 } }}
              >
                Go to Login
              </Button>
              <Button
                component={Link}
                href="/auth/signup"
                variant="outlined"
                fullWidth={true}
                sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 150 } }}
              >
                Sign Up
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
