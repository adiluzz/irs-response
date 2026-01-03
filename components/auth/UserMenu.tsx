'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function UserMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div
        style={{
          width: '32px',
          height: '32px',
          backgroundColor: 'var(--gray-200)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gray-500)',
          fontSize: '12px',
          fontWeight: 600,
        }}
      >
        ...
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/auth/login')}
        >
          Login
        </Button>
        <Button
          size="sm"
          onClick={() => router.push('/auth/signup')}
        >
          Sign Up
        </Button>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
    router.refresh();
  };

  const initials = session.user?.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : session.user?.email?.[0].toUpperCase() || 'U';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ fontSize: '14px', color: 'var(--gray-700)' }}>
        {session.user?.name || session.user?.email}
      </span>
      <div
        style={{
          width: '32px',
          height: '32px',
          backgroundColor: 'var(--tac-navy)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: 600,
        }}
        title={session.user?.email}
      >
        {initials}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
}
