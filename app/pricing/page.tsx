'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { Box, Button, Card, CardContent, Container, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useState } from 'react';

export default function PricingPage() {
  const [processing, setProcessing] = useState(false);

  const handleSubscribe = async () => {
    // TODO: Integrate with payment processor (Stripe, PayPal, etc.)
    setProcessing(true);
    
    // Placeholder for payment integration
    alert('Payment integration coming soon! This will unlock unlimited documents without watermarks.');
    
    setTimeout(() => {
      setProcessing(false);
    }, 1000);
  };

  const features = [
    'Unlimited document generation',
    'No watermarks on documents',
    'Priority email support',
    'Advanced document templates',
    'Bulk document generation',
    'Export to multiple formats',
    'Document history & versioning',
    'Advanced customization options',
  ];

  return (
    <AuthGuard>
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <WorkspacePremiumIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Go Pro - Unlock Full Potential
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Upgrade to Pro for unlimited documents and professional features
          </Typography>
        </Box>

        <Card
          elevation={4}
          sx={{
            maxWidth: 600,
            mx: 'auto',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" component="div" gutterBottom sx={{ fontWeight: 700 }}>
                Pro Plan
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 1, mt: 2 }}>
                <Typography variant="h2" component="span" sx={{ fontWeight: 700 }}>
                  $29
                </Typography>
                <Typography variant="h6" component="span">
                  /month
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                Or $290/year (save $58)
              </Typography>
            </Box>

            <List sx={{ mb: 4 }}>
              {features.map((feature, index) => (
                <ListItem key={index} sx={{ px: 0, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircleIcon sx={{ color: 'white' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={feature}
                    primaryTypographyProps={{
                      sx: { color: 'white', fontSize: '1rem' },
                    }}
                  />
                </ListItem>
              ))}
            </List>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSubscribe}
              disabled={processing}
              sx={{
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              {processing ? 'Processing...' : 'Subscribe to Pro'}
            </Button>

            <Typography variant="caption" display="block" sx={{ textAlign: 'center', mt: 2, opacity: 0.9 }}>
              Cancel anytime. No commitment required.
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Questions?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Contact our support team at support@taxletters.com
          </Typography>
        </Box>
      </Container>
    </AuthGuard>
  );
}
