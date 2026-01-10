'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import {
    FormActions,
    FormField,
    FormRow,
    FormSection,
    Input,
    Select,
    Textarea,
} from '@/components/forms';
import { FormPanel } from '@/components/layout/FormPanel';
import { DocumentActionButtons } from '@/components/documents/DocumentActionButtons';
import { Button } from '@/components/ui/Button';
import { Box, CircularProgress, Typography } from '@mui/material';
import { type LetterContext } from '@/lib/letters';
import { useDocumentGeneration } from '@/lib/hooks/useDocumentGeneration';
import React, { useCallback, useState } from 'react';

export default function CP501Page() {
  const [formData, setFormData] = useState({
    taxpayerName: '',
    taxpayerAddress: '',
    ssn: '',
    noticeDate: '',
    taxYear: '',
    balanceDue: '',
    originalNoticeDate: '',
    priorPayments: '',
    explanation: '',
  });

  const {
    generatedOutput,
    hasGenerated,
    validationError,
    documentId,
    pdfUrl,
    isGenerating,
    generateDocument,
    clearDocument: clearGeneratedDocument,
    setValidationError,
  } = useDocumentGeneration();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
      if (hasGenerated) {
        clearGeneratedDocument();
      }
    },
    [hasGenerated, clearGeneratedDocument]
  );

  const handleClear = useCallback(() => {
    setFormData({
      taxpayerName: '',
      taxpayerAddress: '',
      ssn: '',
      noticeDate: '',
      taxYear: '',
      balanceDue: '',
      originalNoticeDate: '',
      priorPayments: '',
      explanation: '',
    });
    clearGeneratedDocument();
  }, [clearGeneratedDocument]);

  const handleGenerate = useCallback(async () => {
    setValidationError('');

    const missingFields: string[] = [];
    if (!formData.taxpayerName.trim()) missingFields.push('Full Legal Name');
    if (!formData.taxYear) missingFields.push('Tax Year');
    if (!formData.balanceDue.trim()) missingFields.push('Balance Due');
    if (!formData.noticeDate) missingFields.push('Notice Date');

    if (missingFields.length > 0) {
      setValidationError(`Required: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const ctx: LetterContext = {
        noticeType: 'CP501',
        family: 'collection_balance_due',
        taxpayerName: formData.taxpayerName,
        taxpayerAddress: formData.taxpayerAddress,
        idValue: formData.ssn ? formData.ssn.replace(/\D/g, '') : '',
        noticeDate: formData.noticeDate,
        taxYear: formData.taxYear,
        amount: formData.balanceDue,
        deadline: '',
        position: 'dispute',
        explanation: formData.explanation || '',
        priorActions: formData.priorPayments || '',
      };

      await generateDocument({
        noticeType: 'CP501',
        letterContext: ctx,
        includeReferences: false,
      });
    } catch (e: unknown) {
      // Error is handled by the hook
    }
  }, [formData, generateDocument, setValidationError]);


  const canGenerate = Boolean(
    formData.taxpayerName.trim() &&
    formData.taxYear &&
    formData.balanceDue.trim() &&
    formData.noticeDate
  );

  return (
    <AuthGuard>
      <FormPanel
        title="TAC Emergency IRS Responder"
        subtitle="Deterministic IRS Notice Response Engine"
        noticeBadge="CP501 — Reminder Notice"
      >

        <FormSection
          title="Taxpayer Information"
          description="Enter the taxpayer's identifying information exactly as shown on the IRS notice."
        >
          <FormField label="Full Legal Name" htmlFor="taxpayerName" required>
            <Input
              id="taxpayerName"
              name="taxpayerName"
              value={formData.taxpayerName}
              onChange={handleChange}
              placeholder="John A. Smith"
              autoComplete="name"
            />
          </FormField>

          <FormField label="Mailing Address" htmlFor="taxpayerAddress" required>
            <Textarea
              id="taxpayerAddress"
              name="taxpayerAddress"
              value={formData.taxpayerAddress}
              onChange={handleChange}
              placeholder={'123 Main Street\nApt 4B\nNew York, NY 10001'}
              rows={3}
              autoComplete="street-address"
            />
          </FormField>

          <FormRow columns={2}>
            <FormField label="SSN / ITIN" htmlFor="ssn" required hint="Last 4 displayed">
              <Input
                id="ssn"
                name="ssn"
                value={formData.ssn}
                onChange={handleChange}
                placeholder="000-00-0000"
                autoComplete="off"
              />
            </FormField>

            <FormField label="Tax Year" htmlFor="taxYear" required>
              <Select
                id="taxYear"
                name="taxYear"
                value={formData.taxYear}
                onChange={handleChange}
              >
                <option value="">Select year</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </Select>
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection
          title="Notice Details"
          description="Enter the information from your CP501 notice and original CP14 if available."
        >
          <FormRow columns={2}>
            <FormField label="CP501 Notice Date" htmlFor="noticeDate" required>
              <Input
                id="noticeDate"
                name="noticeDate"
                type="date"
                value={formData.noticeDate}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Original CP14 Date" htmlFor="originalNoticeDate" hint="If known">
              <Input
                id="originalNoticeDate"
                name="originalNoticeDate"
                type="date"
                value={formData.originalNoticeDate}
                onChange={handleChange}
              />
            </FormField>
          </FormRow>

          <FormField label="Current Balance Due" htmlFor="balanceDue" required hint="Amount owed">
            <Input
              id="balanceDue"
              name="balanceDue"
              value={formData.balanceDue}
              onChange={handleChange}
              placeholder="$1,234.56"
              inputMode="decimal"
            />
          </FormField>
        </FormSection>

        <FormSection
          title="Response Context"
          description="Provide details about any prior payments or correspondence."
        >
          <FormField label="Prior Payments or Actions" htmlFor="priorPayments" hint="Optional">
            <Textarea
              id="priorPayments"
              name="priorPayments"
              value={formData.priorPayments}
              onChange={handleChange}
              placeholder="List any payments made, correspondence sent, or actions taken since the original CP14..."
              rows={3}
            />
          </FormField>

          <FormField label="Additional Explanation" htmlFor="explanation" hint="Optional">
            <Textarea
              id="explanation"
              name="explanation"
              value={formData.explanation}
              onChange={handleChange}
              placeholder="Describe any relevant circumstances or provide additional context..."
              rows={3}
            />
          </FormField>
        </FormSection>

        <FormActions align="between">
          <Button variant="ghost" type="button" onClick={handleClear}>
            Clear Form
          </Button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
            {validationError && (
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--red-600)',
                  textAlign: 'right',
                }}
              >
                {validationError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="secondary" type="button" disabled={isGenerating}>
                Save Draft
              </Button>
              <Button
                variant="primary"
                type="button"
                disabled={!canGenerate || isGenerating}
                onClick={handleGenerate}
              >
                {isGenerating ? 'Generating...' : 'Generate Letter'}
              </Button>
            </div>
          </div>
        </FormActions>

        {isGenerating && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 6,
              gap: 2,
            }}
          >
            <CircularProgress size={48} />
            <Typography variant="body1" color="text.secondary">
              Generating your document...
            </Typography>
          </Box>
        )}

        {hasGenerated && documentId && !isGenerating && (
          <Box sx={{ mt: 3 }}>
            <DocumentActionButtons documentId={documentId} noticeType="CP501" />
          </Box>
        )}
      </FormPanel>
    </AuthGuard>
  );
}
