/**
 * Global shared sections for all letters
 */

import type { LetterContext } from '../blueprints/types'
import { pickVariant } from '../variation'
import { educationalReferences } from '../educationalReferences'

function safe(value: string | undefined, fallback: string) {
  return value && value.trim() ? value.trim() : fallback
}

export function globalSections(
  seed: string,
  ctx: LetterContext
): Array<{ heading?: string; body: string }> {
  const sections: Array<{ heading?: string; body: string }> = []

  // Header / purpose (deterministic, non-assertive)
  sections.push({
    heading: 'Purpose',
    body: pickVariant(seed + '_purpose', [
      `This correspondence is submitted regarding the referenced notice and tax period. The taxpayer requests that the Service review the account and respond in writing to the items raised in this submission.`,
      `This letter is provided in response to the referenced notice. The taxpayer requests review and written confirmation of the account status and any actions taken by the Service.`,
      `This submission addresses the referenced IRS notice and tax period. The taxpayer requests an account-level review and written response regarding the matters discussed below.`,
    ]),
  })

  // Identifiers (use only what is provided)
  sections.push({
    heading: 'Taxpayer Information',
    body: [
      `Taxpayer: ${safe(ctx.taxpayerName, '[name]')}`,
      ctx.idValue ? `ID: ${ctx.idValue}` : '',
      ctx.taxYear ? `Tax Year: ${ctx.taxYear}` : '',
      ctx.noticeDate ? `Notice Date: ${ctx.noticeDate}` : '',
      ctx.noticeNumber ? `Notice Number: ${ctx.noticeNumber}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
  })

  // OPTIONAL references appended as a real section (checkbox)
  // Triggered ONLY if ctx.includeReferences === true
  if (ctx.includeReferences === true) {
    sections.push({
      heading: 'Applicable Authority',
      body: educationalReferences().join('\n'),
    })
  }

  return sections
}

export function globalClosing(seed: string, ctx: LetterContext): string {
  const name = safe(ctx.taxpayerName, '[name]')

  return pickVariant(seed + '_closing', [
    `Respectfully submitted,\n\n______________________________\n${name}`,
    `Sincerely,\n\n______________________________\n${name}`,
    `Respectfully,\n\n______________________________\n${name}`,
  ])
}
