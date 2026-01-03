// lib/cp2000Generator.ts

import { formatReferencesBlock } from '@/lib/generators/GeneratorsReferenceExplainer'
import { formatMoney, formatDate, maskSSN } from '@/lib/validation/ValidationCommon'
import type { CP2000Data } from '@/types'

export interface CP2000Options {
  appendReferences?: boolean
  letterDate?: string
  irsAddress?: string
}

export interface CP2000Result {
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

function getLetterDate(data: CP2000Data, options?: CP2000Options): string {
  const fromOptions = (options?.letterDate ?? '').toString().trim()
  if (fromOptions) return fromOptions

  const noticeDate = (asAny(data).noticeDate ?? '').toString().trim()
  if (noticeDate) return noticeDate

  return new Date().toISOString().slice(0, 10)
}

function getIRSAddress(options?: CP2000Options): string {
  const fromOptions = (options?.irsAddress ?? '').toString().trim()
  if (fromOptions) return fromOptions
  return `Internal Revenue Service`
}

function buildHeader(data: CP2000Data, options?: CP2000Options): string {
  // CP2000Data in /types currently does not include taxpayer; keep header generic for now.
  const letterDate = getLetterDate(data, options)
  const irsAddress = getIRSAddress(options)

  const taxYear = (asAny(data).taxYear ?? '').toString().trim()
  const noticeNumber = (asAny(data).noticeNumber ?? '').toString().trim()

  return `${formatDate(letterDate)}

${irsAddress}

Re: CP2000 Notice Response
Tax Year: ${taxYear}
Notice Number: ${noticeNumber}

Dear Sir or Madam:`
}

function buildBody(data: CP2000Data): string {
  const noticeDate = (asAny(data).noticeDate ?? '').toString().trim()
  const noticeDateText = noticeDate ? ` dated ${formatDate(noticeDate)}` : ''
  const noticeNumber = (asAny(data).noticeNumber ?? '').toString().trim()
  const taxYear = (asAny(data).taxYear ?? '').toString().trim()

  const underreportedAmount = formatAmount(asAny(data).underreportedAmount)
  const proposedTaxDue = formatAmount(asAny(data).proposedTaxDue)

  const disagreementReason = (asAny(data).disagreementReason ?? '').toString()
  const disagreementExplanation = (asAny(data).disagreementExplanation ?? '').toString().trim()

  const reasonLine = disagreementReason ? `Disagreement reason: ${disagreementReason}` : ''
  const explBlock = disagreementExplanation ? `\n\n${disagreementExplanation}\n` : '\n'

  return `I am writing in response to the CP2000 notice${noticeDateText}, Notice Number ${noticeNumber}, regarding my ${taxYear} federal income tax return.

The notice indicates an underreported amount of ${underreportedAmount} and a proposed tax due of ${proposedTaxDue}.

${reasonLine}${explBlock}

Please review the enclosed information and update the proposed changes accordingly.`
}

function getAttachments(_: CP2000Data): string[] {
  return ['Copy of CP2000 Notice', 'Supporting documentation']
}

function getReferences(_: CP2000Data): string[] {
  return [
    'IRS CP2000 Notice instructions',
    'IRC § 6201 - Assessment authority',
    'IRC § 7491 - Burden of proof',
  ]
}

function buildClosing(): string {
  return `Thank you for your attention to this matter.

Sincerely,


____________________________

Enclosures: See attached checklist`
}

export function generateCP2000Letter(data: CP2000Data, options: CP2000Options = {}): CP2000Result {
  const body = buildBody(data)
  const references = options.appendReferences ? formatReferencesBlock(getReferences(data)) : ''

  const letterBody = `${buildHeader(data, options)}

${body}
${references}

${buildClosing()}`

  return {
    letterBody,
    attachmentsChecklist: getAttachments(data),
    inputsUsed: {
      taxYear: (asAny(data).taxYear ?? '').toString(),
      noticeNumber: (asAny(data).noticeNumber ?? '').toString(),
      disagreementReason: (asAny(data).disagreementReason ?? '').toString(),
      appendReferences: Boolean(options.appendReferences),
    },
  }
}

