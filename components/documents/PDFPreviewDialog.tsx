'use client';

import { getDocumentPDF } from '@/lib/api/documents';
import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from '@mui/material';
import * as pdfjsLib from 'pdfjs-dist';
import { useEffect, useRef, useState } from 'react';

// Set up PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface PDFPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  documentId: string | null;
}


export function PDFPreviewDialog({ open, onClose, documentId }: PDFPreviewDialogProps) {
  const [pageData, setPageData] = useState<Array<{ pageNumber: number; imageUrl: string; width: number; height: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && documentId) {
      loadPDF();
    } else {
      cleanup();
    }

    return () => {
      cleanup();
    };
  }, [open, documentId]);

  const cleanup = () => {
    // Revoke object URLs to free memory
    setPageData((prevPages) => {
      prevPages.forEach((page) => {
        if (page.imageUrl) {
          URL.revokeObjectURL(page.imageUrl);
        }
      });
      return [];
    });
    setTotalPages(0);
  };

  const loadPDF = async () => {
    if (!documentId) return;

    try {
      setLoading(true);
      setError(null);
      cleanup();

      // Fetch PDF blob
      const pdfBlob = await getDocumentPDF(documentId);
      const arrayBuffer = await pdfBlob.arrayBuffer();

      // Load PDF document
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      setTotalPages(pdf.numPages);

      // Helper function to convert canvas to blob
      const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
        return new Promise((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to convert canvas to blob'));
              }
            },
            'image/png'
          );
        });
      };

      // Render all pages sequentially
      const renderedPages: Array<{ pageNumber: number; imageUrl: string; width: number; height: number }> = [];
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 }); // Scale for better quality

        // Create canvas for this page
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render page to canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        // Convert canvas to blob and create image URL
        const blob = await canvasToBlob(canvas);
        const imageUrl = URL.createObjectURL(blob);
        
        const pageInfo = {
          pageNumber: pageNum,
          imageUrl,
          width: viewport.width / 2, // Display at half scale
          height: viewport.height / 2,
        };
        
        renderedPages.push(pageInfo);

        // Update state incrementally so pages appear as they render
        setPageData([...renderedPages]);
      }

      setLoading(false);
    } catch (err) {
      console.error('Failed to load PDF:', err);
      setError('Failed to load PDF document. Please try again.');
      setLoading(false);
    }
  };

  const handleClose = () => {
    cleanup();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh',
          m: 2,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6">
          Document Preview {totalPages > 0 && `(${totalPages} page${totalPages > 1 ? 's' : ''})`}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          p: 2,
          position: 'relative',
          height: '100%',
          overflow: 'auto',
          backgroundColor: '#f5f5f5',
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              gap: 2,
            }}
          >
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
              Loading PDF...
            </Typography>
          </Box>
        ) : error ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              gap: 2,
            }}
          >
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </Box>
        ) : (
          <Box
            ref={containerRef}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              py: 3,
            }}
          >
            {pageData.map((page) => (
              <Box
                key={page.pageNumber}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    backgroundColor: '#fff',
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    width: 'fit-content',
                    maxWidth: '100%',
                  }}
                >
                  <Box
                    component="img"
                    src={page.imageUrl}
                    alt={`Page ${page.pageNumber}`}
                    sx={{
                      display: 'block',
                      width: '100%',
                      height: 'auto',
                      maxWidth: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </Box>
                {totalPages > 1 && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    Page {page.pageNumber} of {totalPages}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
