/**
 * Underreporter / Examination family language
 * Used by: CP2000, CP2501, Letter 2030, Letter 2531
 */

import { pickVariant } from '../../variation'
import type { LetterContext } from '../../blueprints/types'

function normalizeDiscrepancy(type?: string): string {
  const raw = (type || '').trim()
  if (!raw) return ''

  const map: Record<string, string> = {
    'unreported-income': 'unreported income',
    '1099-mismatch': 'information return mismatch (Form 1099)',
    'w2-mismatch': 'information return mismatch (Form W-2)',
    'deduction-disallowed': 'disallowed deduction(s)',
    'credit-adjustment': 'credit adjustment(s)',
    other: 'other discrepancy',
  }

  return map[raw] || raw
}

function normalizePosition(position?: string): string {
  const raw = (position || '').trim()
  if (!raw) return ''

  const map: Record<string, string> = {
    agree: 'The taxpayer agrees with the proposed changes as stated in the notice.',
    partial: 'The taxpayer partially agrees with the proposed changes and disputes specific items described below.',
    disagree: 'The taxpayer disagrees with the proposed changes and submits the following information for the Service’s review.',
  }

  return map[raw] || raw
}

export function underreporterFamilySections(
  seed: string,
  ctx: LetterContext
): Array<{ heading?: string; body: string }> {
  const sections: Array<{ heading?: string; body: string }> = []

  sections.push({
    heading: 'Notice Summary',
    body: pickVariant(seed + '_summary', [
      `This submission responds to the underreporter notice for tax year ${ctx.taxYear || '[year]'}. The notice proposes changes totaling ${ctx.amount || '[amount]'}.`,
      `The notice proposes an adjustment for tax year ${ctx.taxYear || '[year]'} totaling ${ctx.amount || '[amount]'} based on information return matching.`,
      `For tax year ${ctx.taxYear || '[year]'}, the notice proposes changes in the amount of ${ctx.amount || '[amount]'}. This response is submitted for the Service’s review.`,
    ]),
  })

  if (ctx.deadline && ctx.deadline.trim()) {
    sections.push({
      heading: 'Urgency and Timing',
      body: `This response is submitted in advance of the stated deadline: ${ctx.deadline.trim()}.`,
    })
  }

  const pos = normalizePosition(ctx.position)
  if (pos) {
    sections.push({
      heading: 'Taxpayer Position',
      body: pos,
    })
  }

  const disc = normalizeDiscrepancy(ctx.discrepancyType)
  if (disc) {
    sections.push({
      heading: 'Response to Proposed Changes',
      body: `The proposed adjustment relates to ${disc}.`,
    })
  }

  if (ctx.explanation && ctx.explanation.trim()) {
    sections.push({
      heading: 'Reconciliation / Explanation',
      body: ctx.explanation.trim(),
    })
  }

  return sections
}

export function underreporterRequestedActions(
  seed: string,
  ctx: LetterContext
): { heading?: string; body: string } {
  const actions: string[] = [
    'Withdraw the proposed assessment in its entirety',
    'Issue a formal closure letter confirming the final determination',
    'Provide written confirmation of any changes (or no changes) to the return',
    'Update records to reflect the correct tax liability',
  ]

  if (ctx.deadline && ctx.deadline.trim()) {
    actions.push('Suspend any assessment deadline pending review of this response')
  }

  const formatted = actions.map((a, i) => `${i + 1}. ${a}`).join('\n')

  return {
    heading: 'Requested Action',
    body: `Based on the information provided, the taxpayer requests:\n\n${formatted}`,
  }
}
