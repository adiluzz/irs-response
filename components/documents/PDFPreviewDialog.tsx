'use client';

import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import { getDocumentPDF } from '@/lib/api/documents';

interface PDFPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  documentId: string | null;
}

export function PDFPreviewDialog({ open, onClose, documentId }: PDFPreviewDialogProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && documentId) {
      loadPDF();
    } else {
      // Clean up when dialog closes
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
    }

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [open, documentId]);

  const loadPDF = async () => {
    if (!documentId) return;

    try {
      setLoading(true);
      const pdfBlob = await getDocumentPDF(documentId);
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Failed to load PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
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
        <Typography variant="h6">Document Preview</Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, position: 'relative', height: '100%', overflow: 'hidden' }}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <CircularProgress />
          </Box>
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="PDF Viewer"
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
