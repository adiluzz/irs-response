'use client';

import { navigation } from '@/lib/constants/navigation';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const drawerWidth = 280;

export function Sidebar({ isMobile = false, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 960); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const drawerContent = (
    <Box sx={{ width: drawerWidth, height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        p: 3, 
        flexGrow: 1,
        pt: isMobileView ? { xs: 5, sm: 3 } : 3, // Add top padding on mobile to account for TopBar
      }}>
        {navigation.map((category, categoryIndex) => (
          <Box key={category.id} sx={{ mb: categoryIndex < navigation.length - 1 ? 4 : 0 }}>
            {/* Category Title */}
            <Typography
              variant="overline"
              sx={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                color: 'text.secondary',
                letterSpacing: '0.1em',
                px: 1.5,
                mb: 1,
                display: 'block',
              }}
            >
              {category.title}
            </Typography>

            {/* Nav Items */}
            <List disablePadding>
              {category.items.map((item) => {
                const isActive = item.href === pathname;
                const isClickable = item.status === 'available' || item.status === 'active';

                return (
                  <ListItem key={item.id} disablePadding>
                    <ListItemButton
                      component={isClickable ? Link : 'div'}
                      href={isClickable ? item.href : undefined}
                      onClick={isMobile && isClickable ? onClose : undefined}
                      disabled={!isClickable}
                      selected={isActive}
                      sx={{
                        borderRadius: 2,
                        mx: 0.75,
                        mb: 0.25,
                        '&.Mui-selected': {
                          backgroundColor: 'primary.main',
                          color: 'primary.contrastText',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          },
                        },
                        '&:hover': {
                          backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                        },
                      }}
                    >
                      <ListItemText
                        primary={item.label}
                        secondary={
                          item.status === 'coming-soon' ? (
                            <Typography variant="caption" sx={{ fontSize: '0.625rem' }}>
                              Soon
                            </Typography>
                          ) : item.status === 'disabled' ? (
                            <Typography variant="caption" sx={{ fontSize: '0.625rem' }}>
                              N/A
                            </Typography>
                          ) : null
                        }
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: isActive ? 600 : 500,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 'auto', p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.primary.main}15 100%)`,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Need help?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Access documentation and support resources.
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  if (isMobileView) {
    return (
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          zIndex: (theme) => theme.zIndex.drawer + 2,
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            zIndex: (theme) => theme.zIndex.drawer + 2,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
          top: 64, // AppBar height
          height: 'calc(100% - 64px)',
          borderRight: '1px solid',
          borderColor: 'divider',
          zIndex: 1, // Above main content but below TopBar
        },
      }}
      open
    >
      {drawerContent}
    </Drawer>
  );
}
