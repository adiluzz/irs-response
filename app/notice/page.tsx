'use client';
import React from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth/AuthGuard';

const availableNotices = [
  {
    id: 'cp14',
    title: 'CP14',
    subtitle: 'Balance Due Notice',
    description:
      'Initial notice informing taxpayer of unpaid tax balance. Typically the first notice in the collection sequence.',
    href: '/notice/cp14',
    status: 'active',
  },
  {
    id: 'cp501',
    title: 'CP501',
    subtitle: 'Reminder Notice',
    description:
      'First reminder of unpaid balance. Follows CP14 if no response or payment received.',
    href: '/notice/cp501',
    status: 'active',
  },
  {
    id: 'cp503',
    title: 'CP503',
    subtitle: 'Second Reminder Notice',
    description:
      'Second reminder of unpaid balance. Issued after CP501 when no response or payment has been received.',
    href: '/notice/cp503',
    status: 'active',
  },
  {
    id: 'cp504',
    title: 'CP504',
    subtitle: 'Final Notice / Intent to Levy',
    description:
      'Final notice indicating intent to levy state tax refunds or other property if the balance remains unresolved.',
    href: '/notice/cp504',
    status: 'active',
  },
  {
    id: 'cp2000',
    title: 'CP2000',
    subtitle: 'Underreporter Inquiry',
    description:
      'Proposed adjustment notice for unreported income identified through IRS matching programs.',
    href: '/notice/cp2000',
    status: 'active',
  },
];

export default function NoticeIndexPage() {
  return (
    <AuthGuard>
      <div
        style={{
          padding: 'var(--space-8)',
          maxWidth: '960px',
        }}
      >
      {/* Page Header */}
      <header style={{ marginBottom: 'var(--space-8)' }}>
        <h1
          style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 700,
            color: 'var(--gray-900)',
            marginBottom: 'var(--space-2)',
            letterSpacing: '-0.02em',
          }}
        >
          Notice Response Generator
        </h1>
        <p
          style={{
            fontSize: 'var(--text-md)',
            color: 'var(--gray-500)',
            lineHeight: 'var(--leading-relaxed)',
            maxWidth: '600px',
          }}
        >
          Select a notice type to generate a deterministic, IRS-compliant response
          letter. Each generator produces consistent output based on taxpayer inputs.
        </p>
      </header>

      {/* Notice Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-5)',
        }}
      >
        {availableNotices.map((notice) => (
          <Link
            key={notice.id}
            href={notice.href}
            style={{
              display: 'block',
              backgroundColor: '#ffffff',
              border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              textDecoration: 'none',
              transition: 'all var(--transition-base)',
              boxShadow: 'var(--shadow-xs)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--gray-300)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--gray-200)';
              e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Notice ID Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 10px',
                backgroundColor: 'var(--gray-900)',
                color: '#ffffff',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                marginBottom: 'var(--space-3)',
              }}
            >
              {notice.title}
            </div>

            {/* Notice Subtitle */}
            <h3
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 600,
                color: 'var(--gray-900)',
                marginBottom: 'var(--space-2)',
              }}
            >
              {notice.subtitle}
            </h3>

            {/* Notice Description */}
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--gray-500)',
                lineHeight: 'var(--leading-relaxed)',
                margin: 0,
              }}
            >
              {notice.description}
            </p>

            {/* Arrow indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: 'var(--space-4)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                color: 'var(--blue-600)',
              }}
            >
              <span>Open Generator</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer note */}
      <div
        style={{
          marginTop: 'var(--space-8)',
          padding: 'var(--space-4)',
          backgroundColor: 'var(--gray-50)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--gray-200)',
        }}
      >
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--gray-600)',
            margin: 0,
            lineHeight: 'var(--leading-relaxed)',
          }}
        >
          <strong style={{ color: 'var(--gray-700)' }}>
            Deterministic Output:
          </strong>{' '}
          All generators produce identical letters for identical inputs. No AI
          interpretation, no variable language. Suitable for professional tax
          correspondence.
        </p>
      </div>
    </div>
    </AuthGuard>
  );
}
