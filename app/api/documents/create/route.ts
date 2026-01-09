import { NextRequest, NextResponse } from 'next/server';
import { requireAuthApi } from '@/lib/utils/apiAuth';
import connectDB from '@/lib/db/mongodb';
import Document from '@/lib/models/Document';
import { getBlueprint, LetterContext } from '@/lib/letters';
import { composeLetter } from '@/lib/letters';
import { generatePDF } from '@/lib/services/pdfGenerator';
import { uploadFileToS3, BUCKET_NAME } from '@/lib/services/s3Service';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import os from 'os';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuthApi();
    await connectDB();

    const body = await request.json();
    const { noticeType, letterContext, includeReferences } = body;

    if (!noticeType || !letterContext) {
      return NextResponse.json(
        { error: 'Missing required fields: noticeType and letterContext' },
        { status: 400 }
      );
    }

    // Validate noticeType
    const validNoticeTypes = ['CP14', 'CP501', 'CP503', 'CP504', 'CP2000', 'FORM_843', 'LETTER_1058', 'CP90', 'CP91'];
    if (!validNoticeTypes.includes(noticeType)) {
      return NextResponse.json(
        { error: 'Invalid notice type' },
        { status: 400 }
      );
    }

    // Build letter using the blueprint system
    const blueprint = getBlueprint(noticeType as any);
    const letterData = blueprint.build(letterContext as LetterContext);

    // Append references if requested
    let sections = letterData.sections;
    if (includeReferences) {
      const { generateEducationalReferences } = await import('@/lib/letters/educationalReferences');
      sections = [
        ...letterData.sections,
        {
          heading: 'References',
          body: generateEducationalReferences().trim(),
        },
      ];
    }

    // Compose the full letter
    const letterText = composeLetter({
      ...letterData,
      sections,
      todayISO: new Date().toISOString().split('T')[0],
      includeReferences: includeReferences || false,
    });

    // Generate PDF
    const tempDir = os.tmpdir();
    const pdfFileName = `document-${uuidv4()}.pdf`;
    const pdfPath = path.join(tempDir, pdfFileName);

    // Get logo paths
    const appLogoPath = path.join(process.cwd(), 'public', 'brand', 'f3-crest.png');
    const watermarkPath = path.join(process.cwd(), 'public', 'watermarks', 'fast-form-filing-watermark.png');

    const pdfBuffer = await generatePDF({
      letterText,
      outputPath: pdfPath,
      appLogoPath: fs.existsSync(appLogoPath) ? appLogoPath : undefined,
      watermarkPath: fs.existsSync(watermarkPath) ? watermarkPath : undefined,
      appName: 'TAC Emergency IRS Responder',
    });

    // Upload PDF to S3
    const s3Key = `documents/${session.user.id}/${uuidv4()}.pdf`;
    
    // Write buffer to temp file for S3 upload
    fs.writeFileSync(pdfPath, pdfBuffer);
    
    await uploadFileToS3({
      filePath: pdfPath,
      key: s3Key,
      contentType: 'application/pdf',
    });

    // Clean up temporary file
    fs.unlinkSync(pdfPath);

    // Save document to database
    const document = new Document({
      userId: session.user.id,
      noticeType,
      letterContext,
      letterText,
      s3Key,
      s3Bucket: BUCKET_NAME,
    });

    await document.save();

    // Return PDF URL for preview
    const pdfUrl = `/api/documents/${document._id}`;

    return NextResponse.json({
      success: true,
      document: {
        id: document._id.toString(),
        noticeType: document.noticeType,
        letterText: document.letterText,
        pdfUrl: pdfUrl,
        createdAt: document.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create document' },
      { status: 500 }
    );
  }
}
