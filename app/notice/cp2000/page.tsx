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
    'other': 'Other Discrepancy',
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
      proposedAmount: '',
      responseDeadline: '',
      discrepancyType: '',
      responsePosition: '',
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
    if (!formData.proposedAmount.trim()) missingFields.push('Proposed Amount');
    if (!formData.noticeDate) missingFields.push('Notice Date');
    if (!formData.responseDeadline) missingFields.push('Response Deadline');

    if (missingFields.length > 0) {
      setValidationError(`Required: ${missingFields.join(', ')}`);
      return;
    }

    const output = `${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}

CERTIFIED MAIL - RETURN RECEIPT REQUESTED

Internal Revenue Service
Notice Date: ${formData.noticeDate}

RE: Response to CP2000 Notice
    Tax Year: ${formData.taxYear}
    Proposed Additional Tax: ${formData.proposedAmount}
${formData.discrepancyType ? `    Discrepancy Type: ${getDiscrepancyLabel(formData.discrepancyType)}` : ''}
    Response Deadline: ${formData.responseDeadline}

Taxpayer: ${formData.taxpayerName}
SSN: ${formatSSN(formData.ssn)}
${formData.taxpayerAddress ? `Address:\n${formData.taxpayerAddress}` : ''}

Dear Sir or Madam:

I am writing in response to the CP2000 notice dated ${formData.noticeDate} proposing adjustments to my ${formData.taxYear} tax return in the amount of ${formData.proposedAmount}.

RESPONSE POSITION:
${formData.responsePosition ? getPositionLabel(formData.responsePosition) : 'See explanation below.'}
${formData.explanation ? `\nEXPLANATION AND SUPPORTING INFORMATION:\n${formData.explanation}` : ''}

I am submitting this response within the prescribed deadline of ${formData.responseDeadline} and request that you review the information provided.

If you require additional documentation or clarification, please contact me at the address above.

Respectfully submitted,


_______________________________
${formData.taxpayerName}
Date: ${new Date().toLocaleDateString('en-US')}

Enclosures: As referenced`;

    setGeneratedOutput(output);
    setHasGenerated(true);
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
    link.download = `cp2000-response-${formData.taxYear}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [generatedOutput, formData.taxYear]);

  const canGenerate = Boolean(
    formData.taxpayerName.trim() &&
      formData.taxYear &&
      formData.proposedAmount.trim() &&
      formData.noticeDate &&
      formData.responseDeadline
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
          description="Enter the specific information from your CP2000 notice."
        >
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

        <FormSection
          title="Response Position"
          description="Indicate your position and provide supporting information."
        >
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

          <FormField
            label="Explanation and Supporting Information"
            htmlFor="explanation"
            hint="Recommended"
          >
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

