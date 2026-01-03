import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/auth/error?error=InvalidToken', request.url));
    }

    await connectDB();

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.redirect(new URL('/auth/error?error=InvalidOrExpiredToken', request.url));
    }

    // Verify the email
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return NextResponse.redirect(new URL('/auth/login?verified=true', request.url));
  } catch (error: any) {
    console.error('Email verification error:', error);
    return NextResponse.redirect(new URL('/auth/error?error=VerificationFailed', request.url));
  }
}
