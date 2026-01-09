import { NextRequest, NextResponse } from 'next/server';
import { requireAuthApi } from '@/lib/utils/apiAuth';
import connectDB from '@/lib/db/mongodb';
import Document from '@/lib/models/Document';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuthApi();
    await connectDB();

    const { id } = await params;
    const document = await Document.findById(id).select('letterText userId').lean();

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Check if user owns this document
    if (document.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      letterText: document.letterText,
    });
  } catch (error: any) {
    console.error('Error retrieving document text:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve document text' },
      { status: 500 }
    );
  }
}
