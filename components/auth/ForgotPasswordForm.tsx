'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Input } from '@/components/forms/Input';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/ui/Button';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
              color: 'var(--blue-600)',
              marginBottom: 'var(--space-4)',
            }}
          >
            ✉
          </div>
          <h2
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: 'var(--gray-900)',
              marginBottom: 'var(--space-4)',
            }}
          >
            Check Your Email
          </h2>
          <p
            style={{
              fontSize: 'var(--text-md)',
              color: 'var(--gray-600)',
              marginBottom: 'var(--space-4)',
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            If an account exists with <strong>{email}</strong>, we've sent a password reset link.
          </p>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--gray-500)',
              marginBottom: 'var(--space-4)',
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            Please check your email and click the link to reset your password.
          </p>
          <Link
            href="/auth/login"
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--blue-600)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

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
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: 'var(--space-8)',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 700,
              color: 'var(--gray-900)',
              marginBottom: 'var(--space-2)',
              letterSpacing: '-0.02em',
            }}
          >
            Forgot Password
          </h1>
          <p
            style={{
              fontSize: 'var(--text-md)',
              color: 'var(--gray-500)',
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              marginBottom: 'var(--space-6)',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--red-50)',
              border: '1px solid var(--red-600)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              color: 'var(--red-600)',
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <FormField label="Email Address" htmlFor="email" required>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                hasError={!!error}
                placeholder="your@email.com"
              />
            </FormField>

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
              style={{
                marginTop: 'var(--space-2)',
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
              <Link
                href="/auth/login"
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--blue-600)',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Back to Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
