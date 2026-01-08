import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';

function getBaseUrl(request: NextRequest): string {
  // Get base URL from environment or request headers
  const baseUrl = process.env.NEXTAUTH_URL || 
                  process.env.NEXT_PUBLIC_APP_URL ||
                  (process.env.NODE_ENV === 'production' ? 'https://viseething.com' : 'http://localhost:3001');
  
  // If we have a proper host header, use it (for production)
  const host = request.headers.get('host');
  if (host && !host.includes('localhost')) {
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    return `${protocol}://${host}`;
  }
  
  return baseUrl;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');
    const baseUrl = getBaseUrl(request);

    if (!token) {
      return NextResponse.redirect(new URL('/auth/error?error=InvalidToken', baseUrl));
    }

    await connectDB();

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.redirect(new URL('/auth/error?error=InvalidOrExpiredToken', baseUrl));
    }

    // Verify the email
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return NextResponse.redirect(new URL('/auth/login?verified=true', baseUrl));
  } catch (error: any) {
    console.error('Email verification error:', error);
    const baseUrl = getBaseUrl(request);
    return NextResponse.redirect(new URL('/auth/error?error=VerificationFailed', baseUrl));
  }
}
