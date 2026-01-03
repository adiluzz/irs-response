'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  const errorMessages: Record<string, string> = {
    InvalidToken: 'Invalid verification token.',
    InvalidOrExpiredToken: 'The verification link is invalid or has expired.',
    VerificationFailed: 'Email verification failed. Please try again.',
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Default: 'An error occurred during authentication.',
  };

  const message = errorMessages[error || ''] || errorMessages.Default;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--gray-50)',
        padding: 'var(--space-4)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          border: '1px solid var(--gray-200)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-8)',
          boxShadow: 'var(--shadow-paper)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '48px',
            color: 'var(--red-600)',
            marginBottom: 'var(--space-4)',
          }}
        >
          ⚠
        </div>
        <h1
          style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 700,
            color: 'var(--gray-900)',
            marginBottom: 'var(--space-4)',
          }}
        >
          Authentication Error
        </h1>
        <p
          style={{
            fontSize: 'var(--text-md)',
            color: 'var(--gray-600)',
            marginBottom: 'var(--space-6)',
            lineHeight: 'var(--leading-relaxed)',
          }}
        >
          {message}
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
          }}
        >
          <Link href="/auth/login" style={{ textDecoration: 'none' }}>
            <Button fullWidth>Go to Login</Button>
          </Link>
          <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
            <Button variant="outline" fullWidth>
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
