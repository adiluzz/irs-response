'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/forms/Input';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const verified = searchParams?.get('verified');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        let errorMessage = result.error;
        if (result.error === 'CredentialsSignin') {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (result.error.includes('verify')) {
          errorMessage = 'Please verify your email address before logging in.';
        }
        setError(errorMessage);
      } else if (result?.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            Sign In
          </h1>
          <p
            style={{
              fontSize: 'var(--text-md)',
              color: 'var(--gray-500)',
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            Sign in to your account to continue
          </p>
        </div>

        {/* Success message */}
        {verified && (
          <div
            style={{
              marginBottom: 'var(--space-6)',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--green-50)',
              border: '1px solid var(--green-600)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              color: 'var(--green-600)',
            }}
          >
            Email verified successfully! You can now login.
          </div>
        )}

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
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                hasError={!!error}
                placeholder="Enter your email"
              />
            </FormField>

            <FormField label="Password" htmlFor="password" required>
              <div style={{ position: 'relative' }}>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  hasError={!!error}
                  placeholder="Enter your password"
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: 'var(--gray-500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--gray-700)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--gray-500)';
                  }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </FormField>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link
                href="/auth/forgot-password"
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--blue-600)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
              style={{
                marginTop: 'var(--space-2)',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--gray-500)',
                  margin: 0,
                }}
              >
                Don't have an account?{' '}
                <Link
                  href="/auth/signup"
                  style={{
                    color: 'var(--blue-600)',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
