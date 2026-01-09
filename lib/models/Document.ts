import mongoose, { Schema, Document as MongooseDocument, Model } from 'mongoose';
import { NoticeType, LetterContext } from '@/lib/letters/blueprints/types';

export interface IDocument extends MongooseDocument {
  userId: mongoose.Types.ObjectId;
  noticeType: NoticeType;
  letterContext: LetterContext;
  letterText: string;
  s3Key: string;
  s3Bucket: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    noticeType: {
      type: String,
      required: [true, 'Notice type is required'],
      enum: ['CP14', 'CP501', 'CP503', 'CP504', 'CP2000', 'FORM_843', 'LETTER_1058', 'CP90', 'CP91'],
    },
    letterContext: {
      type: Schema.Types.Mixed,
      required: [true, 'Letter context is required'],
    },
    letterText: {
      type: String,
      required: [true, 'Letter text is required'],
    },
    s3Key: {
      type: String,
      required: [true, 'S3 key is required'],
    },
    s3Bucket: {
      type: String,
      required: [true, 'S3 bucket is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
DocumentSchema.index({ userId: 1, createdAt: -1 });

const Document: Model<IDocument> = mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);

export default Document;
