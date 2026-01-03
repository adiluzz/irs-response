// lib/letters/compose.ts

export type LetterSection = { heading?: string; body: string }

export type ComposeLetterInput = {
  reLine: string
  taxpayerBlock: string
  sections: LetterSection[]
  closingBlock: string
  todayISO: string
  certifiedMail?: boolean
  includeReferences?: boolean
}

function normalizeHeading(h?: string) {
  return (h || '').trim()
}

function stripDividerNoise(body: string): string {
  return body
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.trim() !== '---')
    .join('\n')
    .trim()
}

function defaultBodyForHeading(headingRaw?: string): string {
  const heading = (headingRaw || '').trim().toLowerCase()

  if (heading === 'purpose') {
    return `This submission is provided in response to the referenced IRS notice. The taxpayer requests that the Service associate this correspondence with the correct tax period and account module and review the information provided herein.`
  }

  if (heading === 'background') {
    return `The taxpayer is responding to the referenced notice and requests an account-level review to confirm the basis for the balance or proposed change, including the underlying assessment detail and any relevant posting history.`
  }

  if (heading === 'taxpayer information') {
    return `Taxpayer identifying information is provided above for proper association to the correct account and tax period.`
  }

  if (heading === 'notice summary') {
    return `This section summarizes the notice and the taxpayer’s understanding of the issue identified by the Service based on the information available at the time of submission.`
  }

  if (heading === 'notice stage and purpose') {
    return `This response addresses the current notice stage and is submitted to preserve the taxpayer’s rights and to request appropriate review and written clarification from the Service.`
  }

  if (heading === 'urgency and timing') {
    return `This response is submitted promptly upon receipt of the notice. If a specific response deadline applies, the taxpayer requests that the Service confirm the applicable deadline in writing and allow sufficient time for review and response.`
  }

  if (heading === 'taxpayer position') {
    return `The taxpayer provides the taxpayer’s position for the Service’s review and requests that the Service evaluate the account records and supporting information to determine the correct liability and appropriate next steps.`
  }

  if (heading === 'taxpayer position and balance due reason') {
    return `The taxpayer states the taxpayer’s position and requests that the Service review the account records, including assessment detail and payment/credit application, to confirm the correct status of the account.`
  }

  if (heading === 'account status and supporting information') {
    return `The taxpayer requests verification of the account’s current status, including pending adjustments, unapplied payments, offsets, and processing activity that may affect the balance reflected on the notice.`
  }

  if (heading === 'resolution and next steps') {
    return `The taxpayer requests a written response that (1) addresses the taxpayer’s position; (2) confirms the basis for the balance or proposed change; (3) itemizes components (tax, penalty, interest) where applicable; and (4) identifies any specific documentation the Service requires to complete review and finalize resolution.`
  }

  if (
    heading === 'reconciliation' ||
    heading === 'reconciliation / explanation' ||
    heading === 'explanation'
  ) {
    return `The taxpayer provides explanation and supporting information as available at the time of submission. If additional documentation is required to reconcile the issue, the taxpayer requests that the Service specify in writing what items are needed and the preferred method for submission.`
  }

  if (heading === 'documentation provided') {
    return `The taxpayer is providing documentation with this submission where available. If the Service requires additional documents, the taxpayer requests written guidance identifying the specific items needed.`
  }

  if (heading === 'prior actions') {
    return `No prior actions were provided in this submission. The taxpayer requests written confirmation of the account’s current status and the Service’s records regarding any prior correspondence or payments associated with this matter.`
  }

  if (heading === 'requested action') {
    return `The taxpayer respectfully requests that the Service review this submission, confirm receipt in writing, associate it with the correct tax period and account module, and provide a written response addressing the items raised herein.`
  }

  if (
    heading === 'references' ||
    heading === 'applicable authority' ||
    heading === 'legal and administrative authority'
  ) {
    return `No references were included in this submission.`
  }

  return `The taxpayer requests that the Service review this section as part of the overall submission and respond in writing as appropriate.`
}

function ensureSectionBody(heading?: string, body?: string): string {
  const cleaned = stripDividerNoise((body || '').trim())
  if (cleaned) return cleaned
  return defaultBodyForHeading(heading)
}

function extractTaxpayerName(taxpayerBlock: string): string {
  const lines = (taxpayerBlock || '').split('\n').map((l) => l.trim())
  const first = lines[0] || ''
  const m = first.match(/^Taxpayer:\s*(.+)$/i)
  if (m && m[1] && m[1].trim()) return m[1].trim()
  return ''
}

function injectNameOncePerSection(body: string, taxpayerName: string): string {
  if (!taxpayerName) return body

  // Replace only the first occurrence of the exact phrase "the taxpayer" (case-insensitive)
  const re = /\bthe taxpayer\b/i
  if (!re.test(body)) return body
  return body.replace(re, taxpayerName)
}

export function composeLetter(input: ComposeLetterInput): string {
  const { reLine, taxpayerBlock, sections, closingBlock, todayISO, certifiedMail } = input

  const taxpayerName = extractTaxpayerName(taxpayerBlock)

  const headerLines: string[] = []
  headerLines.push(todayISO)
  headerLines.push('')
  if (certifiedMail) {
    headerLines.push('VIA CERTIFIED MAIL')
    headerLines.push('')
  }
  headerLines.push('Internal Revenue Service')
  headerLines.push('')
  headerLines.push(`Re: ${reLine}`)
  headerLines.push('')
  headerLines.push(taxpayerBlock)
  headerLines.push('')
  headerLines.push('Dear Sir or Madam:')
  headerLines.push('')

  const bodyLines: string[] = []
  for (const s of sections || []) {
    const heading = normalizeHeading(s.heading)
    let body = ensureSectionBody(heading, s.body)

    // ✅ Use name once per section, then revert to "the taxpayer"
    body = injectNameOncePerSection(body, taxpayerName)

    if (heading) {
      bodyLines.push(heading.toUpperCase())
      bodyLines.push('')
    }
    bodyLines.push(body)
    bodyLines.push('')
  }

  const closingLines: string[] = []
  closingLines.push((closingBlock || '').trim())
  closingLines.push('')

  return [...headerLines, ...bodyLines, ...closingLines].join('\n')
}
