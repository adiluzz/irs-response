'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/forms/Input';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/ui/Button';

export function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login?signup=success');
      }, 2000);
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
              color: 'var(--green-600)',
              marginBottom: 'var(--space-4)',
            }}
          >
            ✓
          </div>
          <h2
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: 'var(--gray-900)',
              marginBottom: 'var(--space-4)',
            }}
          >
            Account Created!
          </h2>
          <p
            style={{
              fontSize: 'var(--text-md)',
              color: 'var(--gray-600)',
              marginBottom: 'var(--space-4)',
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            We've sent a verification email to <strong>{formData.email}</strong>
          </p>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--gray-500)',
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            Please check your email and click the verification link to activate your account.
          </p>
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
            Sign Up
          </h1>
          <p
            style={{
              fontSize: 'var(--text-md)',
              color: 'var(--gray-500)',
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            Create an account to get started
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
            <FormField label="Name" htmlFor="name">
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={loading}
                placeholder="Your name (optional)"
              />
            </FormField>

            <FormField label="Email Address" htmlFor="email" required>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
                hasError={!!error}
                placeholder="your@email.com"
              />
            </FormField>

            <FormField label="Password" htmlFor="password" required>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
                hasError={!!error}
                placeholder="••••••••"
                minLength={6}
              />
              <p
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--gray-500)',
                  marginTop: 'var(--space-1)',
                }}
              >
                Minimum 6 characters
              </p>
            </FormField>

            <FormField label="Confirm Password" htmlFor="confirmPassword" required>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={loading}
                hasError={!!error}
                placeholder="••••••••"
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
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>

            <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--gray-500)',
                  margin: 0,
                }}
              >
                Already have an account?{' '}
                <Link
                  href="/auth/login"
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
                  Login
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
