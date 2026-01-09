import { NextRequest, NextResponse } from 'next/server';
import { requireAuthApi } from '@/lib/utils/apiAuth';
import connectDB from '@/lib/db/mongodb';
import Document from '@/lib/models/Document';
import { getFileFromS3 } from '@/lib/services/s3Service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuthApi();
    await connectDB();

    const { id } = await params;
    const document = await Document.findById(id).lean();

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

    // Get PDF from S3
    const pdfBuffer = await getFileFromS3(document.s3Key);

    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="document-${id}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error retrieving document:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve document' },
      { status: 500 }
    );
  }
}
