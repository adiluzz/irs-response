'use client';

import { Box, Container, Typography, Button, Card, CardContent } from '@mui/material';
import NotFoundIcon from '@mui/icons-material/FindInPage';
import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';

export default function NotFound() {
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
            <NotFoundIcon
              sx={{ fontSize: 64, color: 'primary.main', mb: 2 }}
            />
            <Typography variant="h4" gutterBottom fontWeight={700}>
              404 - Page Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              The page you're looking for doesn't exist or has been moved.
            </Typography>
            <Button
              component={Link}
              href="/"
              variant="contained"
              startIcon={<HomeIcon />}
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
