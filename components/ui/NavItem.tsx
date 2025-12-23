'use client';

import React from 'react';
import Link from 'next/link';
import type { NavItemStatus } from '@/lib/constants/navigation';

interface NavItemProps {
  label: string;
  href?: string;
  status: NavItemStatus;
  isActive?: boolean;
}

export function NavItem({ label, href, status, isActive = false }: NavItemProps) {
  const isClickable = status === 'available' || status === 'active';
  
  const baseStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    fontSize: '13px',
    fontWeight: 500,
    borderRadius: 'var(--radius-sm)',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
    cursor: isClickable ? 'pointer' : 'default',
  };

  const stateStyles: React.CSSProperties = isActive
    ? {
        backgroundColor: 'var(--blue-50)',
        color: 'var(--blue-700)',
      }
    : isClickable
    ? {
        color: 'var(--gray-700)',
        backgroundColor: 'transparent',
      }
    : {
        color: 'var(--gray-400)',
        backgroundColor: 'transparent',
      };

  const combinedStyles = { ...baseStyles, ...stateStyles };

  const statusBadge =
    status === 'coming-soon' ? (
      <span
        style={{
          fontSize: '10px',
          fontWeight: 500,
          color: 'var(--gray-400)',
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
        }}
      >
        Soon
      </span>
    ) : status === 'disabled' ? (
      <span
        style={{
          fontSize: '10px',
          fontWeight: 500,
          color: 'var(--gray-400)',
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
        }}
      >
        N/A
      </span>
    ) : null;

  const content = (
    <>
      <span>{label}</span>
      {statusBadge}
    </>
  );

  if (isClickable && href) {
    return (
      <Link href={href} style={combinedStyles}>
        {content}
      </Link>
    );
  }

  return <div style={combinedStyles}>{content}</div>;
}