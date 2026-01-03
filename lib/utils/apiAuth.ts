import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';

export async function requireAuthApi() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error('Unauthorized');
  }

  return session;
}
