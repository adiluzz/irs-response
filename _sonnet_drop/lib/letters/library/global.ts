/**
 * GLOBAL language library - used in EVERY letter
 */

import { stableSeed, pickVariant } from '../variation'
import type { LetterContext } from '../blueprints/types'

export function globalSections(seed: string, ctx: LetterContext): Array<{ heading?: string; body: string }> {
  const sections = []

  // Procedural framing
  sections.push({
    body: pickVariant(seed, [
      `This correspondence is submitted in response to the referenced notice dated ${ctx.noticeDate || '[date]'}. This response is provided timely and in accordance with applicable procedures.`,
      `This letter responds to the notice referenced above, dated ${ctx.noticeDate || '[date]'}. The response is submitted within the prescribed timeframe and follows proper procedures.`,
      `This correspondence addresses the notice dated ${ctx.noticeDate || '[date]'} as referenced above. It is submitted in a timely manner pursuant to applicable guidelines.`,
    ])
  })

  // Good-faith compliance posture
  sections.push({
    body: pickVariant(seed + '_compliance', [
      'This response is provided in good faith with full cooperation. The taxpayer has consistently sought to comply with all applicable tax obligations and reporting requirements.',
      'The taxpayer submits this response in good faith and maintains a posture of full cooperation with the Service. All tax obligations have been approached with diligence and care.',
      'This submission reflects the taxpayer\'s good-faith effort to address the matter and cooperate fully. The taxpayer remains committed to meeting all tax compliance obligations.',
    ])
  })

  return sections
}

export function globalClosing(seed: string, ctx: LetterContext): string {
  const recordKeeping = pickVariant(seed + '_records', [
    'Please review the information provided and update your records accordingly.',
    'Kindly review this submission and adjust your records as appropriate.',
    'We request that you review this information and update your files accordingly.',
  ])

  const writtenResponse = pickVariant(seed + '_response', [
    'If additional documentation or clarification is required, please specify the items needed in writing.',
    'Should further information be necessary, please provide a written request detailing the specific items required.',
    'If the Service requires additional documentation, please issue a written specification of the needed materials.',
  ])

  const contact = pickVariant(seed + '_contact', [
    'Please direct all correspondence regarding this matter to the undersigned.',
    'All future correspondence concerning this matter should be directed to the undersigned.',
    'Kindly address any further communications on this matter to the undersigned.',
  ])

  return `${recordKeeping}\n\n${writtenResponse}\n\n${contact}\n\nRespectfully submitted,\n\n[Authorized Representative Name]\n[Credentials]\n[Contact Information]`
}