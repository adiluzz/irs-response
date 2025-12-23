'use client';

import React, { useState, useCallback } from 'react';
import { SplitView } from '@/components/layout/SplitView';
import { FormPanel } from '@/components/layout/FormPanel';
import {
  FormSection,
  FormField,
  FormRow,
  FormActions,
  Input,
  Select,
  Textarea,
} from '@/components/forms';
import { Button } from '@/components/ui/Button';
import { composeLetter, getBlueprint, type LetterContext } from '@/lib/letters';

function formatSSN(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length >= 4) {
    return `XXX-XX-${digits.slice(-4)}`;
  }
  return 'XXX-XX-XXXX';
}

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

  const [generatedOutput, setGeneratedOutput] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
      if (hasGenerated) {
        setHasGenerated(false);
        setGeneratedOutput('');
      }
    },
    [hasGenerated]
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
    setGeneratedOutput('');
    setHasGenerated(false);
    setValidationError('');
    setCopyState('idle');
  }, []);

  const handleGenerate = useCallback(() => {
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
        // CP501 UI currently does not capture a due-date/deadline field; keep deterministic placeholder.
        deadline: '',
        // CP501 UI does not capture a disputeReason field; map to a stable default.
        position: 'dispute',
        explanation: formData.explanation || '',
        priorActions: formData.priorPayments || '',
      };

      const blueprint = getBlueprint(ctx.noticeType);
      const letterData = blueprint.build(ctx);

      const result = composeLetter({
        ...letterData,
        todayISO: new Date().toISOString().split('T')[0],
      });

      const letterBody =
        typeof result === 'string'
          ? result
          : result && typeof result === 'object' && 'letterBody' in result
            ? typeof (result as { letterBody?: unknown }).letterBody === 'string'
              ? ((result as { letterBody?: unknown }).letterBody as string)
              : ''
            : '';

      setGeneratedOutput(letterBody);
      setHasGenerated(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Generation failed.';
      setGeneratedOutput('');
      setHasGenerated(false);
      setValidationError(msg);
    }
  }, [formData]);

  const handleCopy = useCallback(async () => {
    if (!generatedOutput) return;
    try {
      await navigator.clipboard.writeText(generatedOutput);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }, [generatedOutput]);

  const handleDownload = useCallback(() => {
    if (!generatedOutput) return;
    const blob = new Blob([generatedOutput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cp501-response-${formData.taxYear}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [generatedOutput, formData.taxYear]);

  const canGenerate = Boolean(
    formData.taxpayerName.trim() &&
    formData.taxYear &&
    formData.balanceDue.trim() &&
    formData.noticeDate
  );

  return (
    <SplitView>
      <FormPanel
        title="TAC Emergency IRS Responder"
        subtitle="Deterministic IRS Notice Response Engine"
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 12px',
            backgroundColor: 'var(--gray-900)',
            color: '#ffffff',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            marginBottom: '24px',
            letterSpacing: '0.025em',
          }}
        >
          CP501 — Reminder Notice
        </div>

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
              <Button variant="secondary" type="button" disabled>
                Save Draft
              </Button>
              <Button
                variant="primary"
                type="button"
                disabled={!canGenerate}
                onClick={handleGenerate}
              >
                Generate Letter
              </Button>
            </div>
          </div>
        </FormActions>
      </FormPanel>

      <aside
        style={{
          width: 'var(--preview-width)',
          flexShrink: 0,
          backgroundColor: 'var(--gray-100)',
          borderLeft: '1px solid var(--gray-200)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <header
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--gray-200)',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--gray-900)',
                marginBottom: '2px',
              }}
            >
              Document Preview
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>
              {hasGenerated ? 'Draft ready for review' : 'Complete fields and generate'}
            </p>
          </div>

          {hasGenerated && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copyState === 'copied' ? 'Copied' : 'Copy'}
              </Button>
              <Button variant="secondary" size="sm" onClick={handleDownload}>
                Download
              </Button>
            </div>
          )}
        </header>

        <div style={{ flex: 1, overflow: 'auto', padding: '24px 20px' }}>
          {hasGenerated ? (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--gray-200)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 4px 12px 0 rgb(0 0 0 / 0.03)',
                padding: '40px 36px',
                minHeight: '600px',
              }}
            >
              <pre
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  lineHeight: '1.7',
                  color: 'var(--gray-800)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  margin: 0,
                }}
              >
                {generatedOutput}
              </pre>
            </div>
          ) : (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'var(--gray-400)',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--gray-200)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <p style={{ fontWeight: 500, color: 'var(--gray-500)', marginBottom: '4px' }}>
                Awaiting Input
              </p>
              <p style={{ fontSize: '12px' }}>
                Complete required fields and click Generate
              </p>
            </div>
          )}
        </div>
      </aside>
    </SplitView>
  );
}
