import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';
import { redirect } from 'next/navigation';

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect('/auth/login');
  }
  return session;
}

export async function requireAuthApi() {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}
