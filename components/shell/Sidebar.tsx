'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { navigation } from '@/lib/constants/navigation';
import { NavItem } from '@/components/ui/NavItem';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        position: 'fixed',
        top: 'var(--topbar-height)',
        left: 0,
        bottom: 0,
        width: 'var(--sidebar-width)',
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--gray-200)',
        overflowY: 'auto',
        padding: '16px 12px',
        zIndex: 50,
      }}
    >
      {/* Navigation categories */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {navigation.map((category) => (
          <div key={category.id}>
            {/* Category title */}
            <h3
              style={{
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--gray-500)',
                padding: '0 12px',
                marginBottom: '8px',
              }}
            >
              {category.title}
            </h3>

            {/* Nav items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {category.items.map((item) => (
                <NavItem
                  key={item.id}
                  label={item.label}
                  href={item.href}
                  status={item.status}
                  isActive={item.href === pathname}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer area */}
      <div
        style={{
          marginTop: '32px',
          padding: '16px 12px',
          borderTop: '1px solid var(--gray-200)',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            color: 'var(--gray-500)',
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: 'var(--gray-700)', fontWeight: 600 }}>
            Need help?
          </strong>
          <br />
          Access documentation and support resources.
        </div>
      </div>
    </aside>
  );
}