import { NextRequest, NextResponse } from 'next/server';
import { requireAuthApi } from '@/lib/utils/apiAuth';

/**
 * Example protected API route
 * This demonstrates how to protect API routes with authentication
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuthApi();
    
    return NextResponse.json({
      message: 'This is a protected API route',
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Unauthorized - Authentication required' },
      { status: 401 }
    );
  }
}
