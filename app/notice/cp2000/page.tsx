// app/notice/cp2000/page.tsx
'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import { LetterPreview } from '@/components/preview/LetterPreview';

function formatSSN(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length >= 4) {
    return `XXX-XX-${digits.slice(-4)}`;
  }
  return 'XXX-XX-XXXX';
}

function getDiscrepancyLabel(type: string): string {
  const labels: Record<string, string> = {
    'unreported-income': 'Unreported Income',
    '1099-mismatch': '1099 Information Mismatch',
    'w2-mismatch': 'W-2 Information Mismatch',
    'deduction-disallowed': 'Deduction Disallowed',
    'credit-adjustment': 'Credit Adjustment',
    other: 'Other Discrepancy',
  };
  return labels[type] || type;
}

function getPositionLabel(position: string): string {
  const labels: Record<string, string> = {
    agree: 'I agree with the proposed changes',
    partial: 'I partially agree with the proposed changes',
    disagree: 'I disagree with the proposed changes',
  };
  return labels[position] || position;
}

function extractLetterBody(result: unknown): string {
  if (typeof result === 'string') return result;
  if (result && typeof result === 'object' && 'letterBody' in result) {
    const lb = (result as { letterBody?: unknown }).letterBody;
    return typeof lb === 'string' ? lb : '';
  }
  return '';
}

export default function CP2000Page() {
  const [formData, setFormData] = useState({
    taxpayerName: '',
    taxpayerAddress: '',
    ssn: '',
    noticeDate: '',
    taxYear: '',
    proposedAmount: '',
    responseDeadline: '',
    discrepancyType: '',
    responsePosition: '',
    explanation: '',
  });

  const [includeReferences, setIncludeReferences] = useState(false);

  const [generatedOutput, setGeneratedOutput] = useState('');
  const [hasGenerated, setHasGenerated] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  // Preview scroll container ref (used to force scrollTop=0 after generation)
  const previewScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasGenerated) return;

    requestAnimationFrame(() => {
      if (previewScrollRef.current) previewScrollRef.current.scrollTop = 0;
    });
  }, [hasGenerated, generatedOutput]);

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
      proposedAmount: '',
      responseDeadline: '',
      discrepancyType: '',
      responsePosition: '',
      explanation: '',
    });
    setIncludeReferences(false);
    setGeneratedOutput('');
    setHasGenerated(false);
    setValidationError('');
    setCopyState('idle');
  }, []);

  const handleGenerate = useCallback(() => {
    setValidationError('');

    const missingFields: string[] = [];
    if (!formData.taxpayerName.trim()) missingFields.push('Full Legal Name');
    if (!formData.taxpayerAddress.trim()) missingFields.push('Mailing Address');
    if (!formData.taxYear) missingFields.push('Tax Year');
    if (!formData.proposedAmount.trim()) missingFields.push('Proposed Amount');
    if (!formData.noticeDate) missingFields.push('Notice Date');
    if (!formData.responseDeadline) missingFields.push('Response Deadline');

    if (missingFields.length > 0) {
      setValidationError(`Required: ${missingFields.join(', ')}`);
      return;
    }

    // ✅ FIXED: remove bogus formData.differenceType usage (does not exist)
    const discrepancyLine = formData.discrepancyType
      ? `Discrepancy Type: ${getDiscrepancyLabel(formData.discrepancyType)}`
      : '';

    const positionLine = formData.responsePosition
      ? `Response Position: ${getPositionLabel(formData.responsePosition)}`
      : '';

    const explanationCombined = [positionLine, discrepancyLine, formData.explanation]
      .filter(Boolean)
      .join('\n\n');

    try {
      const ctx: LetterContext = {
        noticeType: 'CP2000',
        family: 'underreporter_exam',
        taxpayerName: formData.taxpayerName,
        taxpayerAddress: formData.taxpayerAddress,
        idValue: formData.ssn ? formData.ssn.replace(/\D/g, '') : '',
        noticeDate: formData.noticeDate,
        taxYear: formData.taxYear,
        amount: formData.proposedAmount,
        deadline: formData.responseDeadline,
        discrepancyType: formData.discrepancyType || '',
        explanation: explanationCombined || '',
        position: formData.responsePosition || '',
        includeReferences, // ✅ single source of truth
      };

      const blueprint = getBlueprint(ctx.noticeType);
      const letterData = blueprint.build(ctx);

      // ✅ DO NOT append/move/remove "References" here. Engine owns ordering.
      const result = composeLetter({
        ...letterData,
        todayISO: new Date().toISOString().split('T')[0],
        includeReferences,
      });

      const letterBody = extractLetterBody(result);
      setGeneratedOutput(letterBody);
      setHasGenerated(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Generation failed.';
      setGeneratedOutput('');
      setHasGenerated(false);
      setValidationError(msg);
    }
  }, [formData, includeReferences]);

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
    link.download = `cp2000-response-${formData.taxYear}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [generatedOutput, formData.taxYear]);

  const canGenerate = Boolean(
    formData.taxpayerName.trim() &&
      formData.taxpayerAddress.trim() &&
      formData.taxYear &&
      formData.proposedAmount.trim() &&
      formData.noticeDate &&
      formData.responseDeadline
  );

  return (
    <SplitView>
      <FormPanel title="TAC Emergency IRS Responder" subtitle="Deterministic IRS Notice Response Engine">
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
          CP2000 — Underreporter Inquiry
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
              <Select id="taxYear" name="taxYear" value={formData.taxYear} onChange={handleChange}>
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

        <FormSection title="Notice Details" description="Enter the specific information from your CP2000 notice.">
          <FormRow columns={2}>
            <FormField label="Notice Date" htmlFor="noticeDate" required>
              <Input
                id="noticeDate"
                name="noticeDate"
                type="date"
                value={formData.noticeDate}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Response Deadline" htmlFor="responseDeadline" required>
              <Input
                id="responseDeadline"
                name="responseDeadline"
                type="date"
                value={formData.responseDeadline}
                onChange={handleChange}
              />
            </FormField>
          </FormRow>

          <FormRow columns={2}>
            <FormField label="Proposed Additional Tax" htmlFor="proposedAmount" required>
              <Input
                id="proposedAmount"
                name="proposedAmount"
                value={formData.proposedAmount}
                onChange={handleChange}
                placeholder="$1,234.56"
                inputMode="decimal"
              />
            </FormField>

            <FormField label="Discrepancy Type" htmlFor="discrepancyType" hint="If identified">
              <Select
                id="discrepancyType"
                name="discrepancyType"
                value={formData.discrepancyType}
                onChange={handleChange}
              >
                <option value="">Select type</option>
                <option value="unreported-income">Unreported Income</option>
                <option value="1099-mismatch">1099 Mismatch</option>
                <option value="w2-mismatch">W-2 Mismatch</option>
                <option value="deduction-disallowed">Deduction Disallowed</option>
                <option value="credit-adjustment">Credit Adjustment</option>
                <option value="other">Other</option>
              </Select>
            </FormField>
          </FormRow>
        </FormSection>

        <FormSection title="Response Position" description="Indicate your position and provide supporting information.">
          <FormField label="Your Position" htmlFor="responsePosition" hint="Select one">
            <Select
              id="responsePosition"
              name="responsePosition"
              value={formData.responsePosition}
              onChange={handleChange}
            >
              <option value="">Select position</option>
              <option value="agree">I agree with the proposed changes</option>
              <option value="partial">I partially agree with the proposed changes</option>
              <option value="disagree">I disagree with the proposed changes</option>
            </Select>
          </FormField>

          <FormField label="Explanation and Supporting Information" htmlFor="explanation" hint="Recommended">
            <Textarea
              id="explanation"
              name="explanation"
              value={formData.explanation}
              onChange={handleChange}
              placeholder="Provide a detailed explanation of your position. Include references to any supporting documentation you are enclosing..."
              rows={5}
            />
          </FormField>
        </FormSection>

        <FormSection title="Output Options" description="Configure the generated document output.">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: 'var(--gray-50)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--gray-200)',
            }}
          >
            <input
              type="checkbox"
              id="includeReferences"
              checked={includeReferences}
              onChange={(e) => {
                setIncludeReferences(e.target.checked);
                if (hasGenerated) {
                  setHasGenerated(false);
                  setGeneratedOutput('');
                }
              }}
              style={{
                width: '18px',
                height: '18px',
                marginTop: '2px',
                accentColor: 'var(--gray-900)',
                cursor: 'pointer',
              }}
            />
            <label
              htmlFor="includeReferences"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  color: 'var(--gray-900)',
                }}
              >
                Append IRS case law references to the draft
              </span>
            </label>
          </div>
        </FormSection>

        <FormActions align="between">
          <Button variant="ghost" type="button" onClick={handleClear}>
            Clear Form
          </Button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
            {validationError && (
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--red-600)', textAlign: 'right' }}>
                {validationError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="secondary" type="button" disabled>
                Save Draft
              </Button>
              <Button variant="primary" type="button" disabled={!canGenerate} onClick={handleGenerate}>
                Generate Letter
              </Button>
            </div>
          </div>
        </FormActions>
      </FormPanel>

      <aside
        style={{
          width: '520px',
          minWidth: '520px',
          maxWidth: '520px',
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

          {/* ✅ always visible; disabled until output exists */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!generatedOutput}>
              {copyState === 'copied' ? 'Copied' : 'Copy'}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleDownload} disabled={!generatedOutput}>
              Download
            </Button>
          </div>
        </header>

        <div
          ref={previewScrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '24px 20px',
          }}
        >
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
              {/* ✅ same finished typography as other notices */}
              <LetterPreview payload={{ rendered: generatedOutput }} />
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
              <p style={{ fontWeight: 500, color: 'var(--gray-500)', marginBottom: '4px' }}>
                Awaiting Input
              </p>
              <p style={{ fontSize: '12px' }}>Complete required fields and click Generate</p>
            </div>
          )}
        </div>
      </aside>
    </SplitView>
  );
}
