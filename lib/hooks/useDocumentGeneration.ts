import { useState, useCallback } from 'react';
import { createDocument, CreateDocumentRequest } from '@/lib/api/documents';
import { LetterContext } from '@/lib/letters/blueprints/types';

interface UseDocumentGenerationReturn {
  generatedOutput: string;
  hasGenerated: boolean;
  validationError: string;
  documentId: string | null;
  pdfUrl: string | null;
  isGenerating: boolean;
  generateDocument: (request: CreateDocumentRequest) => Promise<void>;
  clearDocument: () => void;
  setValidationError: (error: string) => void;
}

export function useDocumentGeneration(): UseDocumentGenerationReturn {
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDocument = useCallback(async (request: CreateDocumentRequest) => {
    setIsGenerating(true);
    setValidationError('');
    
    try {
      const response = await createDocument(request);
      
      setGeneratedOutput(response.document.letterText);
      setDocumentId(response.document.id);
      setPdfUrl(response.document.pdfUrl);
      setHasGenerated(true);
      setValidationError('');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Generation failed.';
      setGeneratedOutput('');
      setHasGenerated(false);
      setDocumentId(null);
      setPdfUrl(null);
      setValidationError(msg);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearDocument = useCallback(() => {
    setGeneratedOutput('');
    setHasGenerated(false);
    setValidationError('');
    setDocumentId(null);
    setPdfUrl(null);
  }, []);

  return {
    generatedOutput,
    hasGenerated,
    validationError,
    documentId,
    pdfUrl,
    isGenerating,
    generateDocument,
    clearDocument,
    setValidationError,
  };
}
