/**
 * Lien family language
 * Used by: NFTL notices
 */

import { pickVariant } from '../../variation'
import type { LetterContext } from '../../blueprints/types'

export function lienFamilySections(seed: string, ctx: LetterContext): Array<{ heading?: string; body: string }> {
  const sections = []

  sections.push({
    heading: 'Lien Notice Background',
    body: `The notice reflects a filed Notice of Federal Tax Lien for tax year ${ctx.taxYear || '[year]'} in the amount of ${ctx.amount || '[amount]'}. This correspondence addresses the lien filing.`
  })

  return sections
}

export function lienRequestedActions(seed: string, ctx: LetterContext): { heading?: string; body: string } {
  return {
    heading: 'Requested Action',
    body: `The taxpayer requests:\n\n1. Review of the underlying liability\n2. Consideration of lien withdrawal or subordination\n3. Written confirmation of any action taken\n4. Updated account status upon resolution`
  }
}