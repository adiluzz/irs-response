// lib/cp14Generator.ts

import { formatReferencesBlock } from '@/lib/generators/GeneratorsReferenceExplainer'
import { formatMoney, formatDate, maskSSN } from '@/lib/validation/ValidationCommon'
import type { CP14Data } from '@/types'

/**
 * INTERNAL GENERATOR
 * Access only via lib/generators/router.ts
 *
 * IMPORTANT:
 * - Do NOT declare a local CP14Data type here (it will conflict with /types/index.ts).
 * - letterDate and irsAddress are derived internally (not required from UI).
 */

/** CP14 page uses these response positions */
export type ResponsePosition = 'dispute' | 'already_paid' | 'request_time_to_pay'

/** CP14 page uses these balance due reasons */
export type BalanceDueReason =
  | 'unpaid_tax'
  | 'irs_adjustment'
  | 'penalty_interest'
  | 'payment_misapplied'
  | 'unknown'
  | 'other'

export interface CP14Options {
  appendReferences?: boolean
  /** Optional override; if not provided, generator uses a safe default */
  letterDate?: string
  /** Optional override; if not provided, generator uses a safe default */
  irsAddress?: string
}

export interface CP14Result {
  letterBody: string
  attachmentsChecklist: string[]
  inputsUsed: Record<string, unknown>
}

function asAny(x: unknown): any {
  return x as any
}

function getTaxpayerName(data: CP14Data): string {
  const t = asAny(data).taxpayer ?? {}
  return (t.fullName ?? t.name ?? '').toString().trim()
}

function getTaxpayerSSN(data: CP14Data): string {
  const t = asAny(data).taxpayer ?? {}
  return (t.ssn ?? '').toString().trim()
}

function getTaxpayerAddressBlock(data: CP14Data): string {
  const t = asAny(data).taxpayer ?? {}

  const line1 = (t.address ?? '').toString().trim()

  const city = (t.city ?? '').toString().trim()
  const state = (t.state ?? '').toString().trim()
  const zip = (t.zip ?? t.zipCode ?? '').toString().trim()

  const cityStateZip =
    city || state || zip ? `${city}${city && state ? ', ' : ''}${state}${(city || state) && zip ? ' ' : ''}${zip}` : ''

  return [line1, cityStateZip].filter(Boolean).join('\n')
}

function getTaxYear(data: CP14Data): string {
  const v = asAny(data).taxYear
  if (typeof v === 'number' && Number.isFinite(v)) return String(v)
  return (v ?? '').toString().trim()
}

/** permissive parse for display only */
function parseCurrencyToNumber(input: unknown): number | null {
  if (typeof input === 'number' && Number.isFinite(input)) return input
  const s = (input ?? '').toString().trim()
  if (!s) return null
  const cleaned = s.replace(/[^0-9.-]/g, '')
  if (!cleaned || cleaned === '-' || cleaned === '.' || cleaned === '-.') return null
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

function formatAmount(input: unknown): string {
  const n = parseCurrencyToNumber(input)
  return n === null ? (input ?? '').toString() : formatMoney(n)
}

function getBalanceDueReasonLabel(reason: unknown): string {
  const r = (reason ?? '').toString()

  const labels: Record<string, string> = {
    unpaid_tax: 'unpaid tax shown on return',
    irs_adjustment: 'IRS adjustment / assessment',
    penalty_interest: 'penalties and interest',
    payment_misapplied: 'payment misapplied / not credited',
    unknown: 'balance due',
    other: 'balance due',
  }

  return labels[r] ?? 'balance due'
}

function getResponsePositionLabel(pos: unknown): string {
  const p = (pos ?? '').toString()
  const labels: Record<string, string> = {
    dispute: 'I dispute the balance due',
    already_paid: 'I already paid this balance',
    request_time_to_pay: 'I need time to pay',
  }
  return labels[p] ?? 'Response'
}

function getLetterDate(data: CP14Data, options?: CP14Options): string {
  const fromOptions = (options?.letterDate ?? '').toString().trim()
  if (fromOptions) return fromOptions

  // Prefer noticeDate if present; otherwise today (YYYY-MM-DD)
  const noticeDate = (asAny(data).noticeDate ?? '').toString().trim()
  if (noticeDate) return noticeDate

  return new Date().toISOString().slice(0, 10)
}

function getIRSAddress(options?: CP14Options): string {
  const fromOptions = (options?.irsAddress ?? '').toString().trim()
  if (fromOptions) return fromOptions

  // Safe default (can be refined later without breaking typing)
  return `Internal Revenue Service`
}

function buildLetterHeader(data: CP14Data, options?: CP14Options): string {
  const name = getTaxpayerName(data)
  const addr = getTaxpayerAddressBlock(data)
  const letterDate = getLetterDate(data, options)

  const taxYear = getTaxYear(data)
  const noticeNumber = (asAny(data).noticeNumber ?? '').toString().trim()
  const ssn = getTaxpayerSSN(data)

  const irsAddress = getIRSAddress(options)

  return `${name}
${addr}

${formatDate(letterDate)}

${irsAddress}

Re: CP14 Notice Response
Tax Year: ${taxYear}
Notice Number: ${noticeNumber}
SSN: ${maskSSN(ssn)}

Dear Sir or Madam:`
}

function buildLetterClosing(data: CP14Data): string {
  const name = getTaxpayerName(data)
  const ssn = getTaxpayerSSN(data)

  return `Thank you for your attention to this matter.

Sincerely,


${name}
${maskSSN(ssn)}

Enclosures: See attached checklist`
}

function buildBody(data: CP14Data): string {
  const noticeDate = (asAny(data).noticeDate ?? '').toString().trim()
  const noticeDateText = noticeDate ? ` dated ${formatDate(noticeDate)}` : ''

  const noticeNumber = (asAny(data).noticeNumber ?? '').toString().trim()
  const taxYear = getTaxYear(data)

  const amountDue = formatAmount(asAny(data).amountDue ?? asAny(data).balanceDue)
  const balanceReason = getBalanceDueReasonLabel(asAny(data).balanceDueReason)
  const position = getResponsePositionLabel(asAny(data).responsePosition)

  const explanation = (asAny(data).explanation ?? '').toString().trim()

  // Keep it deterministic and non-empty even if explanation is blank.
  const explanationBlock = explanation ? `\n\n${explanation}\n` : '\n'

  // Position-specific paragraph (CP14-specific positions)
  const pos = (asAny(data).responsePosition ?? '').toString()

  let positionPara = ''
  if (pos === 'already_paid') {
    positionPara =
      'My records indicate this balance has already been paid and/or payments may not be properly applied or credited.'
  } else if (pos === 'request_time_to_pay') {
    positionPara =
      'I am requesting additional time to pay and/or to arrange an appropriate payment plan based on my current circumstances.'
  } else {
    // dispute (default)
    positionPara =
      'I dispute the stated balance due and request that the IRS review and correct the account based on the information provided.'
  }

  return `I am writing in response to the CP14 notice${noticeDateText}, Notice Number ${noticeNumber}, concerning my ${taxYear} federal income tax liability.

The notice reflects a balance due of ${amountDue} for ${balanceReason}. ${positionPara}

${position}${explanationBlock}

Please review the enclosed information and update the account accordingly.`
}

function getAttachments(data: CP14Data): string[] {
  const base = ['Copy of CP14 Notice']

  const pos = (asAny(data).responsePosition ?? '').toString()

  if (pos === 'already_paid') {
    return [...base, 'Payment confirmations / transcripts', 'Supporting documentation']
  }

  if (pos === 'request_time_to_pay') {
    return [...base, 'Financial information (if applicable)', 'Supporting documentation']
  }

  // dispute (default)
  return [...base, 'Supporting documentation']
}

function getReferences(data: CP14Data): string[] {
  const refs = [
    'IRC § 6151 - Time and place for paying tax',
    'IRC § 6601 - Interest on underpayment',
    'IRS Publication 594 - The IRS Collection Process',
  ]

  const pos = (asAny(data).responsePosition ?? '').toString()
  if (pos !== 'already_paid') {
    refs.push('IRC § 7491 - Burden of proof')
  }

  return [...new Set(refs)]
}

export function generateCP14Letter(data: CP14Data, options: CP14Options = {}): CP14Result {
  const body = buildBody(data)

  const references = options.appendReferences
    ? formatReferencesBlock(getReferences(data))
    : ''

  const letterBody = `${buildLetterHeader(data, options)}

${body}
${references}

${buildLetterClosing(data)}`

  return {
    letterBody,
    attachmentsChecklist: getAttachments(data),
    inputsUsed: {
      taxYear: getTaxYear(data),
      noticeNumber: (asAny(data).noticeNumber ?? '').toString(),
      responsePosition: (asAny(data).responsePosition ?? '').toString(),
      balanceDueReason: (asAny(data).balanceDueReason ?? '').toString(),
      appendReferences: Boolean(options.appendReferences),
    },
  }
}

