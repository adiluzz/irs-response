'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { UserMenu } from '@/components/auth/UserMenu';

interface TopBarProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

export function TopBar({ onMobileMenuToggle, isMobileMenuOpen }: TopBarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 960); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1,
      }}
    >
      <Toolbar>
        {/* Mobile Menu Button */}
        {onMobileMenuToggle && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMobileMenuToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
            aria-label="toggle menu"
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo and Branding */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 0 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: '1.125rem',
              boxShadow: 2,
            }}
          >
            TAC
          </Box>
          {!isMobile && (
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                }}
              >
                TAC Emergency IRS Responder
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  lineHeight: 1.2,
                }}
              >
                Taxpayer Advocate Correspondence
              </Typography>
            </Box>
          )}
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Right side: Badge + User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!isMobile && (
            <Badge
              badgeContent="Preview"
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.625rem',
                  padding: '2px 6px',
                },
              }}
            />
          )}
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
