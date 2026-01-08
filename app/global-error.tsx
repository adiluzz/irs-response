'use client';

import { useEffect } from 'react';
import { Box, Container, Typography, Button, Card, CardContent } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
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
                  Application Error
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  A critical error occurred. Please refresh the page or contact support.
                </Typography>
                <Button
                  variant="contained"
                  onClick={reset}
                  startIcon={<ErrorOutlineIcon />}
                >
                  Try again
                </Button>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </body>
    </html>
  );
}
