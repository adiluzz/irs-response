// lib/cp501Generator.ts

import { formatReferencesBlock } from '@/lib/generators/GeneratorsReferenceExplainer'
import { formatMoney, formatDate, maskSSN } from '@/lib/validation/ValidationCommon'
import type { CP501Data } from '@/types'

export interface CP501Options {
  appendReferences?: boolean
  letterDate?: string
  irsAddress?: string
}

export interface CP501Result {
  letterBody: string
  attachmentsChecklist: string[]
  inputsUsed: Record<string, unknown>
}

function asAny(x: unknown): any {
  return x as any
}

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

function getTaxpayerName(data: CP501Data): string {
  const t = asAny(data).taxpayer ?? {}
  return (t.fullName ?? t.name ?? '').toString().trim()
}

function getTaxpayerSSN(data: CP501Data): string {
  const t = asAny(data).taxpayer ?? {}
  return (t.ssn ?? '').toString().trim()
}

function getTaxpayerAddressBlock(data: CP501Data): string {
  const t = asAny(data).taxpayer ?? {}

  const line1 = (t.address ?? '').toString().trim()

  const city = (t.city ?? '').toString().trim()
  const state = (t.state ?? '').toString().trim()
  const zip = (t.zip ?? t.zipCode ?? '').toString().trim()

  const cityStateZip =
    city || state || zip
      ? `${city}${city && state ? ', ' : ''}${state}${(city || state) && zip ? ' ' : ''}${zip}`
      : ''

  return [line1, cityStateZip].filter(Boolean).join('\n')
}

function getTaxYear(data: CP501Data): string {
  const v = asAny(data).taxYear
  if (typeof v === 'number' && Number.isFinite(v)) return String(v)
  return (v ?? '').toString().trim()
}

function getLetterDate(data: CP501Data, options?: CP501Options): string {
  const fromOptions = (options?.letterDate ?? '').toString().trim()
  if (fromOptions) return fromOptions

  const noticeDate = (asAny(data).noticeDate ?? '').toString().trim()
  if (noticeDate) return noticeDate

  return new Date().toISOString().slice(0, 10)
}

function getIRSAddress(options?: CP501Options): string {
  const fromOptions = (options?.irsAddress ?? '').toString().trim()
  if (fromOptions) return fromOptions
  return `Internal Revenue Service`
}

function buildHeader(data: CP501Data, options?: CP501Options): string {
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

Re: CP501 Notice Response
Tax Year: ${taxYear}
Notice Number: ${noticeNumber}
SSN: ${maskSSN(ssn)}

Dear Sir or Madam:`
}

function buildBody(data: CP501Data): string {
  const noticeDate = (asAny(data).noticeDate ?? '').toString().trim()
  const noticeDateText = noticeDate ? ` dated ${formatDate(noticeDate)}` : ''

  const noticeNumber = (asAny(data).noticeNumber ?? '').toString().trim()
  const taxYear = getTaxYear(data)

  const amountDue = formatAmount(asAny(data).amountDue ?? asAny(data).balanceDue)
  const explanation = (asAny(data).explanation ?? '').toString().trim()

  const explanationBlock = explanation ? `\n\n${explanation}\n` : '\n'

  return `I am writing in response to the CP501 notice${noticeDateText}, Notice Number ${noticeNumber}, concerning my ${taxYear} federal income tax liability.

The notice reflects a balance due of ${amountDue}. Please advise if additional information is required or if there are any corrections needed to my account.${explanationBlock}

Please confirm receipt of this response and update the account accordingly.`
}

function getAttachments(_: CP501Data): string[] {
  return ['Copy of CP501 Notice', 'Supporting documentation (if applicable)']
}

function getReferences(_: CP501Data): string[] {
  return [
    'IRS Publication 594 - The IRS Collection Process',
    'IRC § 6151 - Time and place for paying tax',
    'IRC § 6601 - Interest on underpayment',
  ]
}

function buildClosing(data: CP501Data): string {
  const name = getTaxpayerName(data)
  const ssn = getTaxpayerSSN(data)

  return `Thank you for your attention to this matter.

Sincerely,


${name}
${maskSSN(ssn)}

Enclosures: See attached checklist`
}

export function generateCP501Letter(data: CP501Data, options: CP501Options = {}): CP501Result {
  const body = buildBody(data)
  const references = options.appendReferences ? formatReferencesBlock(getReferences(data)) : ''

  const letterBody = `${buildHeader(data, options)}

${body}
${references}

${buildClosing(data)}`

  return {
    letterBody,
    attachmentsChecklist: getAttachments(data),
    inputsUsed: {
      taxYear: getTaxYear(data),
      noticeNumber: (asAny(data).noticeNumber ?? '').toString(),
      appendReferences: Boolean(options.appendReferences),
    },
  }
}

