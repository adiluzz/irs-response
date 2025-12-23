import React from 'react';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--gray-50)',
      }}
    >
      <TopBar />
      <Sidebar />
      
      {/* Main content area */}
      <main
        style={{
          marginLeft: 'var(--sidebar-width)',
          paddingTop: 'var(--topbar-height)',
          minHeight: '100vh',
        }}
      >
        {children}
      </main>
    </div>
  );
}