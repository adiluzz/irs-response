/**
 * Collection / Balance Due family language
 * Used by: CP14, CP501, CP503, CP504, CP161, CP215
 */

import { pickVariant } from '../../variation'
import type { LetterContext } from '../../blueprints/types'

export function collectionFamilySections(seed: string, ctx: LetterContext): Array<{ heading?: string; body: string }> {
  const sections = []

  // Payment context
  sections.push({
    heading: 'Background',
    body: pickVariant(seed + '_background', [
      `The notice indicates an outstanding balance of ${ctx.amount || '[amount]'} for tax year ${ctx.taxYear || '[year]'}. This correspondence addresses the assessment and provides relevant context regarding the taxpayer's position.`,
      `The referenced notice reflects a balance due of ${ctx.amount || '[amount]'} for the ${ctx.taxYear || '[year]'} tax year. This letter sets forth the taxpayer's position with respect to the assessment.`,
      `According to the notice, there is a reported balance of ${ctx.amount || '[amount]'} for tax year ${ctx.taxYear || '[year]'}. The following information addresses this assessment.`,
    ])
  })

  // Position statement
  if (ctx.position) {
    sections.push({
      heading: 'Taxpayer Position',
      body: ctx.position
    })
  }

  return sections
}

export function collectionRequestedActions(seed: string, ctx: LetterContext): { heading?: string; body: string } {
  const actions = [
    'Suspend collection activity pending resolution of this matter',
    'Provide written confirmation of receipt of this correspondence',
    'Issue a written response addressing the points raised herein',
  ]

  if (ctx.deadline) {
    actions.push(`Extend any applicable deadline to allow for proper review and response`)
  }

  const formatted = actions.map((action, i) => `${i + 1}. ${action}`).join('\n')

  return {
    heading: 'Requested Action',
    body: `The taxpayer respectfully requests that the Service take the following actions:\n\n${formatted}`
  }
}