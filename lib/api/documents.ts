import { LetterContext } from '@/lib/letters/blueprints/types';

export interface CreateDocumentRequest {
  noticeType: string;
  letterContext: LetterContext;
  includeReferences?: boolean;
}

export interface CreateDocumentResponse {
  success: boolean;
  document: {
    id: string;
    noticeType: string;
    letterText: string;
    pdfUrl: string;
    createdAt: string;
  };
}

export interface DocumentListItem {
  id: string;
  noticeType: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListDocumentsResponse {
  success: boolean;
  documents: DocumentListItem[];
}

export async function createDocument(
  request: CreateDocumentRequest
): Promise<CreateDocumentResponse> {
  const response = await fetch('/api/documents/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create document');
  }

  return response.json();
}

export async function listDocuments(): Promise<ListDocumentsResponse> {
  const response = await fetch('/api/documents/list', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to list documents');
  }

  return response.json();
}

export async function getDocumentPDF(documentId: string): Promise<Blob> {
  const response = await fetch(`/api/documents/${documentId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to retrieve document');
  }

  return response.blob();
}

export async function getDocumentText(documentId: string): Promise<string> {
  const response = await fetch(`/api/documents/${documentId}/text`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to retrieve document text');
  }

  const data = await response.json();
  return data.letterText;
}
