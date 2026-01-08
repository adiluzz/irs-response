'use client';

import { useEffect } from 'react';
import { Box, Container, Typography, Button, Card, CardContent } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <Card>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <ErrorOutlineIcon
              sx={{ fontSize: 64, color: 'error.main', mb: 2 }}
            />
            <Typography variant="h4" gutterBottom fontWeight={700}>
              Something went wrong!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {error.message || 'An unexpected error occurred'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={reset}
                startIcon={<ErrorOutlineIcon />}
              >
                Try again
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/')}
                startIcon={<HomeIcon />}
              >
                Go home
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
