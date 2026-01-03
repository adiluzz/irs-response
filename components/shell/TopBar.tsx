import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { UserMenu } from '@/components/auth/UserMenu';

export function TopBar() {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--topbar-height)',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--gray-200)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 100,
      }}
    >
      {/* Left: Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Logo mark */}
        <div
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'var(--gray-900)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '14px',
          }}
        >
          TAC
        </div>

        {/* Product name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          <span
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--gray-900)',
              lineHeight: 1.2,
            }}
          >
            TAC Emergency IRS Responder
          </span>
          <span
            style={{
              fontSize: '12px',
              color: 'var(--gray-500)',
              lineHeight: 1.2,
            }}
          >
            Taxpayer Advocate Correspondence
          </span>
        </div>
      </div>

      {/* Right: Version + User menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Badge variant="muted">Preview v0.9</Badge>
        <UserMenu />
      </div>
    </header>
  );
}