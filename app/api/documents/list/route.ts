import { NextRequest, NextResponse } from 'next/server';
import { requireAuthApi } from '@/lib/utils/apiAuth';
import connectDB from '@/lib/db/mongodb';
import Document from '@/lib/models/Document';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuthApi();
    await connectDB();

    const documents = await Document.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .select('noticeType createdAt updatedAt _id')
      .lean();

    return NextResponse.json({
      success: true,
      documents: documents.map((doc) => ({
        id: doc._id.toString(),
        noticeType: doc.noticeType,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      })),
    });
  } catch (error: any) {
    console.error('Error listing documents:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list documents' },
      { status: 500 }
    );
  }
}
