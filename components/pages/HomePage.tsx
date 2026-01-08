'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import StarIcon from '@mui/icons-material/Star';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Typography,
} from '@mui/material';
import Link from 'next/link';

export function HomePage() {
  return (
    <AuthGuard>
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: { xs: 2, sm: 3, md: 4 }, 
          px: { xs: 2, sm: 3 },
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            borderRadius: 4,
            p: { xs: 4, md: 8 },
            mb: 6,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 4,
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
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <Typography
              variant="h1"
              sx={{
                color: 'white',
                mb: 2,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                fontWeight: 800,
                lineHeight: 1.2,
                px: { xs: 1, sm: 0 },
              }}
            >
              Welcome to TAC Emergency IRS Responder
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                px: { xs: 2, sm: 0 },
              }}
            >
              Professional IRS notice response generation platform. Generate
              deterministic, compliant response letters with ease.
            </Typography>
            <Button
              component={Link}
              href="/notice"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
                px: { xs: 3, sm: 4 },
                py: { xs: 1.25, sm: 1.5 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                fontWeight: 600,
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>

        {/* Features Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
            mb: 6,
          }}
        >
          {[
            {
              title: 'Deterministic Output',
              description:
                'Every generator produces identical letters for identical inputs. No AI interpretation, no variable language.',
              Icon: CheckCircleIcon,
              color: 'success',
            },
            {
              title: 'IRS Compliant',
              description:
                'All response letters follow IRS guidelines and professional tax correspondence standards.',
              Icon: DescriptionIcon,
              color: 'primary',
            },
            {
              title: 'Professional Quality',
              description:
                'Suitable for professional tax correspondence with clients and the IRS.',
              Icon: StarIcon,
              color: 'warning',
            },
          ].map((feature, index) => {
            const IconComponent = feature.Icon;
            return (
            <Box key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                  <Box
                    sx={{
                      width: { xs: 64, sm: 80 },
                      height: { xs: 64, sm: 80 },
                      borderRadius: '50%',
                      backgroundColor: `${feature.color}.light`,
                      color: `${feature.color}.main`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: { xs: 2, sm: 3 },
                    }}
                  >
                    <IconComponent sx={{ fontSize: { xs: 36, sm: 48 } }} />
                  </Box>
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    fontWeight={700}
                    sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' } }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            );
          })}
        </Box>

        {/* Quick Actions */}
        <Card sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom 
            fontWeight={700}
            sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
          >
            Quick Actions
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
              },
              gap: 2,
              mt: 2,
            }}
          >
            <Button
              component={Link}
              href="/notice"
              variant="contained"
              fullWidth
              sx={{
                textDecoration: 'none',
                textTransform: 'none',
                py: { xs: 3, sm: 4 },
                px: { xs: 2, sm: 3 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
                borderRadius: 2,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Typography 
                variant="h3" 
                component="span"
                sx={{ 
                  fontSize: { xs: '2.5rem', sm: '3.5rem' },
                  lineHeight: 1,
                }}
              >
                📝
              </Typography>
              <Typography 
                variant="h6" 
                component="span"
                fontWeight={600}
                sx={{ 
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  color: 'inherit',
                }}
              >
                Generate Notice Response
              </Typography>
            </Button>
            <Button
              component={Link}
              href="/notice"
              variant="contained"
              fullWidth
              sx={{
                textDecoration: 'none',
                textTransform: 'none',
                py: { xs: 3, sm: 4 },
                px: { xs: 2, sm: 3 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
                borderRadius: 2,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Typography 
                variant="h3" 
                component="span"
                sx={{ 
                  fontSize: { xs: '2.5rem', sm: '3.5rem' },
                  lineHeight: 1,
                }}
              >
                📚
              </Typography>
              <Typography 
                variant="h6" 
                component="span"
                fontWeight={600}
                sx={{ 
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  color: 'inherit',
                }}
              >
                View All Notices
              </Typography>
            </Button>
          </Box>
        </Card>
      </Container>
    </AuthGuard>
  );
}
