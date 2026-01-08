'use client';

import React from 'react';
import Link from 'next/link';
import type { NavItemStatus } from '@/lib/constants/navigation';

interface NavItemProps {
  label: string;
  href?: string;
  status: NavItemStatus;
  isActive?: boolean;
  onClick?: () => void;
}

export function NavItem({ label, href, status, isActive = false, onClick }: NavItemProps) {
  const isClickable = status === 'available' || status === 'active';
  
  const baseStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-3) var(--space-4)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    borderRadius: 'var(--radius-lg)',
    textDecoration: 'none',
    transition: 'all var(--transition-base)',
    cursor: isClickable ? 'pointer' : 'default',
    position: 'relative',
  };

  const stateStyles: React.CSSProperties = isActive
    ? {
        backgroundColor: 'var(--primary-50)',
        color: 'var(--primary-700)',
        fontWeight: 600,
        boxShadow: 'var(--shadow-sm)',
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
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          color: 'var(--gray-400)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          padding: '2px 6px',
          backgroundColor: 'var(--gray-100)',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        Soon
      </span>
    ) : status === 'disabled' ? (
      <span
        style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          color: 'var(--gray-400)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
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

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  if (isClickable && href) {
    return (
      <Link 
        href={href} 
        style={combinedStyles}
        onClick={handleClick}
        onMouseEnter={(e) => {
          if (isClickable && !isActive) {
            e.currentTarget.style.backgroundColor = 'var(--gray-50)';
            e.currentTarget.style.transform = 'translateX(4px)';
          }
        }}
        onMouseLeave={(e) => {
          if (isClickable && !isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'translateX(0)';
          }
        }}
      >
        {content}
      </Link>
    );
  }

  return <div style={combinedStyles}>{content}</div>;
}
