'use client';

import { Box, Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { PDFPreviewDialog } from './PDFPreviewDialog';
import { EmailDialog } from './EmailDialog';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DocumentActionButtonsProps {
  documentId: string | null;
  noticeType?: string;
}

export function DocumentActionButtons({ documentId, noticeType }: DocumentActionButtonsProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const router = useRouter();

  if (!documentId) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          p: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Button
          variant="outlined"
          size="large"
          startIcon={<VisibilityIcon />}
          onClick={() => setPreviewOpen(true)}
          sx={{
            flex: { xs: 1, sm: '0 1 auto' },
            py: 1.5,
            px: 3,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          }}
        >
          Preview Document
        </Button>

        <Button
          variant="outlined"
          size="large"
          startIcon={<EmailIcon />}
          onClick={() => setEmailOpen(true)}
          sx={{
            flex: { xs: 1, sm: '0 1 auto' },
            py: 1.5,
            px: 3,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          }}
        >
          Send PDF by Email
        </Button>

        <Button
          variant="contained"
          size="large"
          color="secondary"
          startIcon={<WorkspacePremiumIcon />}
          onClick={() => router.push('/pricing')}
          sx={{
            flex: { xs: 1, sm: '0 1 auto' },
            py: 1.5,
            px: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6a4190 100%)',
            },
          }}
        >
          Go Pro - Unlimited Documents
        </Button>
      </Box>

      <PDFPreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        documentId={documentId}
      />

      <EmailDialog
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        documentId={documentId}
        noticeType={noticeType}
      />
    </>
  );
}
