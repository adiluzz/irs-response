// app/notice/cp503/page.tsx
'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { SplitView } from '@/components/layout/SplitView'
import { FormPanel } from '@/components/layout/FormPanel'
import {
  FormSection,
  FormField,
  FormRow,
  FormActions,
  Input,
  Select,
  Textarea,
} from '@/components/forms'
import { Button } from '@/components/ui/Button'

import { NoticeType } from '@/types'
import { generateLetter } from '@/lib/generators/router'

type CopyState = 'idle' | 'copied'

type ResponsePosition = 'agree' | 'partial' | 'disagree'

type BalanceDueReason =
  | 'unpaid_tax'
  | 'irs_adjustment'
  | 'penalty_interest'
  | 'payment_misapplied'
  | 'unknown'
  | 'other'

function onlyDigits(value: string) {
  return value.replace(/\D/g, '')
}

function safeCurrencyInput(value: string) {
  // permissive input; formatting handled downstream
  return value
}

function parseAddressLines(multiline: string) {
  const lines = multiline
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    return { address: '', city: '', state: '', zip: '' }
  }

  const last = lines[lines.length - 1]
  const street = lines.slice(0, -1).join('\n') || lines[0] || ''

  const m = last.match(/^(.+),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/i)
  if (!m) return { address: multiline.trim(), city: '', state: '', zip: '' }

  return {
    address: street,
    city: m[1] || '',
    state: (m[2] || '').toUpperCase(),
    zip: m[3] || '',
  }
}

export default function CP503Page() {
  const balanceDueReasonOptions = useMemo(
    () => [
      { value: 'unpaid_tax', label: 'Unpaid tax shown on return' },
      { value: 'irs_adjustment', label: 'IRS adjustment / assessment' },
      { value: 'penalty_interest', label: 'Penalties and interest' },
      { value: 'payment_misapplied', label: 'Payment misapplied / not credited' },
      { value: 'unknown', label: 'Unknown / unclear' },
      { value: 'other', label: 'Other' },
    ],
    []
  )

  const responsePositionOptions = useMemo(
    () => [
      { value: 'agree', label: 'I agree' },
      { value: 'partial', label: 'I partially agree' },
      { value: 'disagree', label: 'I disagree' },
    ],
    []
  )

  const discrepancyLabels: Record<string, string> = useMemo(
    () => ({
      'unreported-income': 'Unreported Income',
      '1099-mismatch': '1099 Mismatch',
      'w2-mismatch': 'W-2 Mismatch',
      'deduction-disallowed': 'Deduction Disallowed',
      'credit-adjustment': 'Credit Adjustment',
      other: 'Other',
    }),
    []
  )

  const [formData, setFormData] = useState({
    taxpayerName: '',
    taxpayerAddress: '',
    ssn: '',
    noticeDate: '',
    taxYear: '',
    amountDue: '',
    noticeNumber: 'CP503',
    discrepancyType: '',
    explanation: '',
  })

  // Required dropdowns (NOT optional)
  const [balanceDueReason, setBalanceDueReason] = useState<BalanceDueReason>('unknown')
  const [responsePosition, setResponsePosition] = useState<ResponsePosition>('disagree')

  const [includeReferences, setIncludeReferences] = useState(false)
  const [generatedOutput, setGeneratedOutput] = useState('')
  const [hasGenerated, setHasGenerated] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [copyState, setCopyState] = useState<CopyState>('idle')

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
      if (hasGenerated) {
        setHasGenerated(false)
        setGeneratedOutput('')
      }
    },
    [hasGenerated]
  )

  const handleClear = useCallback(() => {
    setFormData({
      taxpayerName: '',
      taxpayerAddress: '',
      ssn: '',
      noticeDate: '',
      taxYear: '',
      amountDue: '',
      noticeNumber: 'CP503',
      discrepancyType: '',
      explanation: '',
    })
    setBalanceDueReason('unknown')
    setResponsePosition('disagree')
    setIncludeReferences(false)
    setGeneratedOutput('')
    setHasGenerated(false)
    setValidationError('')
    setCopyState('idle')
  }, [])

  const handleGenerate = useCallback(() => {
    setValidationError('')

    const missing: string[] = []
    if (!formData.taxpayerName.trim()) missing.push('Full Legal Name')
    if (!formData.taxpayerAddress.trim()) missing.push('Mailing Address')
    if (!formData.noticeDate) missing.push('Notice Date')
    if (!formData.taxYear) missing.push('Tax Year')
    if (!formData.amountDue.trim()) missing.push('Amount Due')
    if (!formData.noticeNumber.trim()) missing.push('Notice Number')

    if (missing.length > 0) {
      setValidationError(`Required: ${missing.join(', ')}`)
      return
    }

    const parsedAddr = parseAddressLines(formData.taxpayerAddress)

    const discrepancyLine = formData.discrepancyType
      ? `Discrepancy Type: ${discrepancyLabels[formData.discrepancyType] || formData.discrepancyType}`
      : ''

    const explanationCombined = [discrepancyLine, formData.explanation].filter(Boolean).join('\n\n')

    // NOTE: if NoticeType enum is missing CP503 in your repo, this fallback avoids a hard crash.
    const NOTICE_CP503 = (NoticeType as any).CP503 ?? 'CP503'

    const data = {
      taxpayer: {
        name: formData.taxpayerName,
        address: parsedAddr.address,
        city: parsedAddr.city,
        state: parsedAddr.state,
        zip: parsedAddr.zip,
        ssn: formData.ssn ? onlyDigits(formData.ssn) : '',
      },
      taxYear: parseInt(formData.taxYear, 10),
      noticeDate: formData.noticeDate,
      noticeNumber: formData.noticeNumber,
      amountDue: safeCurrencyInput(formData.amountDue),
      explanation: explanationCombined,
      // keep these in data if your generator expects them there
      balanceDueReason,
      responsePosition,
    }

    const options = {
      balanceDueReason,
      responsePosition,
      appendReferences: includeReferences,
    }

    try {
      const result = generateLetter({ type: NOTICE_CP503, data, options } as any)
      const letterBody = typeof result === 'string' ? result : (result as any)?.letterBody || ''
      setGeneratedOutput(letterBody)
      setHasGenerated(true)
    } catch (e: any) {
      setGeneratedOutput('')
      setHasGenerated(false)
      setValidationError(e?.message || 'Generation failed.')
    }
  }, [
    formData,
    includeReferences,
    balanceDueReason,
    responsePosition,
    discrepancyLabels,
  ])

  const handleCopy = useCallback(async () => {
    if (!generatedOutput) return
    try {
      await navigator.clipboard.writeText(generatedOutput)
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 2000)
    } catch {
      setCopyState('idle')
    }
  }, [generatedOutput])

  const handleDownload = useCallback(() => {
    if (!generatedOutput) return
    const blob = new Blob([generatedOutput], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `cp503-response-${formData.taxYear || 'taxyear'}-${Date.now()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [generatedOutput, formData.taxYear])

  const canGenerate = Boolean(
    formData.taxpayerName.trim() &&
      formData.taxpayerAddress.trim() &&
      formData.taxYear &&
      formData.amountDue.trim() &&
      formData.noticeDate &&
      formData.noticeNumber.trim()
  )

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
          CP503 — Second Reminder Notice
        </div>

        <FormSection
          title="Response Context"
          description="Select the reason and your position for this CP503 response."
        >
          <FormRow columns={2}>
            <FormField label="Balance Due Reason" htmlFor="balanceDueReason" required>
              <Select
                id="balanceDueReason"
                name="balanceDueReason"
                value={balanceDueReason}
                onChange={(e) => {
                  setBalanceDueReason(e.target.value as BalanceDueReason)
                  if (hasGenerated) {
                    setHasGenerated(false)
                    setGeneratedOutput('')
                  }
                }}
              >
                {balanceDueReasonOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Response Position" htmlFor="responsePosition" required>
              <Select
                id="responsePosition"
                name="responsePosition"
                value={responsePosition}
                onChange={(e) => {
                  setResponsePosition(e.target.value as ResponsePosition)
                  if (hasGenerated) {
                    setHasGenerated(false)
                    setGeneratedOutput('')
                  }
                }}
              >
                {responsePositionOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </FormField>
          </FormRow>
        </FormSection>

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
            <FormField label="SSN / ITIN" htmlFor="ssn" hint="Optional: stored as digits">
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

        <FormSection title="Notice Details" description="Enter the specific information from your CP503 notice.">
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

            <FormField label="Notice Number" htmlFor="noticeNumber" required>
              <Input
                id="noticeNumber"
                name="noticeNumber"
                value={formData.noticeNumber}
                onChange={handleChange}
                placeholder="CP503"
              />
            </FormField>
          </FormRow>

          <FormRow columns={2}>
           <FormField label="Amount Due" htmlFor="amountDue" required>
  <input
    id="amountDue"
    name="amountDue"
    type="text"
    value={formData.amountDue}
    onChange={handleChange}
    placeholder="$1,234.56"
    inputMode="decimal"
    style={{
      width: '100%',
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--gray-200)',
      background: '#fff',
      fontSize: 'var(--text-sm)',
      outline: 'none',
    }}
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
          title="Explanation"
          description="Provide supporting information to include in the response letter."
        >
          <FormField label="Explanation and Supporting Information" htmlFor="explanation" required>
            <Textarea
              id="explanation"
              name="explanation"
              value={formData.explanation}
              onChange={handleChange}
              placeholder="Provide a detailed explanation of your position. Include any supporting documentation you are enclosing."
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
              onChange={(e) => setIncludeReferences(e.target.checked)}
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
              <p style={{ fontWeight: 500, color: 'var(--gray-500)', marginBottom: '4px' }}>
                Awaiting Input
              </p>
              <p style={{ fontSize: '12px' }}>Complete required fields and click Generate</p>
            </div>
          )}
        </div>
      </aside>
    </SplitView>
  )
}
