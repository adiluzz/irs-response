/**
 * Underreporter / Examination family language
 * Used by: CP2000, CP2501, Letter 2030, Letter 2531
 */

import { pickVariant } from '../../variation'
import type { LetterContext } from '../../blueprints/types'

export function underreporterFamilySections(seed: string, ctx: LetterContext): Array<{ heading?: string; body: string }> {
  const sections = []

  // Discrepancy context
  sections.push({
    heading: 'Notice Summary',
    body: pickVariant(seed + '_summary', [
      `The notice proposes adjustments to the ${ctx.taxYear || '[year]'} tax return based on alleged discrepancies between reported income and third-party information returns. The proposed adjustment totals ${ctx.amount || '[amount]'}.`,
      `The Service has identified potential discrepancies for tax year ${ctx.taxYear || '[year]'} totaling ${ctx.amount || '[amount]'}. These differences reportedly stem from information return matching.`,
      `For tax year ${ctx.taxYear || '[year]'}, the notice proposes changes in the amount of ${ctx.amount || '[amount]'} due to reported inconsistencies with third-party documentation.`,
    ])
  })

  // Response to discrepancy
  if (ctx.discrepancyType) {
    sections.push({
      heading: 'Response to Proposed Changes',
      body: `The proposed adjustment relates to ${ctx.discrepancyType}. ${ctx.explanation || 'The taxpayer provides the following explanation and supporting documentation.'}`
    })
  }

  return sections
}

export function underreporterRequestedActions(seed: string, ctx: LetterContext): { heading?: string; body: string } {
  const actions = [
    'Withdraw the proposed assessment in its entirety',
    'Issue a formal closure letter confirming no changes to the return',
    'Provide written confirmation that no further action is required',
    'Update records to reflect the accurate tax liability',
  ]

  if (ctx.deadline) {
    actions.push('Suspend the assessment deadline pending review of this response')
  }

  const formatted = actions.map((action, i) => `${i + 1}. ${action}`).join('\n')

  return {
    heading: 'Requested Action',
    body: `Based on the information provided, the taxpayer requests:\n\n${formatted}`
  }
}