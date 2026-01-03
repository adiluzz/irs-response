/**
 * Levy Intent family language
 * Used by: CP90, CP91, Letter 1058, LT11
 */

import { pickVariant } from '../../variation'
import type { LetterContext } from '../../blueprints/types'

export function levyIntentFamilySections(seed: string, ctx: LetterContext): Array<{ heading?: string; body: string }> {
  const sections = []

  sections.push({
    heading: 'Notice Context',
    body: `The notice indicates intent to levy for an outstanding balance of ${ctx.amount || '[amount]'} for tax year ${ctx.taxYear || '[year]'}. This response addresses the proposed levy action.`
  })

  return sections
}

export function levyIntentRequestedActions(seed: string, ctx: LetterContext): { heading?: string; body: string } {
  return {
    heading: 'Requested Action',
    body: `The taxpayer requests:\n\n1. Suspension of all levy action pending resolution\n2. Review of the account status and payment history\n3. Consideration of alternative resolution options\n4. Written confirmation of any action taken`
  }
}