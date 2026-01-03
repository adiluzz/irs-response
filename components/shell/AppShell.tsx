'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  
  // Don't show sidebar or topbar on auth pages
  const isAuthPage = pathname?.startsWith('/auth');
  const showSidebar = !isAuthPage && status === 'authenticated';
  const showTopBar = !isAuthPage;

  // For auth pages, render children directly without shell
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--gray-50)',
      }}
    >
      {showTopBar && <TopBar />}
      {showSidebar && <Sidebar />}
      
      {/* Main content area */}
      <main
        style={{
          marginLeft: showSidebar ? 'var(--sidebar-width)' : '0',
          paddingTop: showTopBar ? 'var(--topbar-height)' : '0',
          minHeight: '100vh',
        }}
      >
        {children}
      </main>
    </div>
  );
}
