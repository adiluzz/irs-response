/**
 * General Correspondence family language
 * Used by: Form 843, LTR-L, T-11, and miscellaneous requests
 */

import { pickVariant } from '../../variation'
import type { LetterContext } from '../../blueprints/types'

export function generalCorrespondenceSections(seed: string, ctx: LetterContext): Array<{ heading?: string; body: string }> {
  const sections = []

  // Generic request framing
  sections.push({
    heading: 'Purpose of Correspondence',
    body: pickVariant(seed + '_purpose', [
      `This correspondence is submitted to formally request consideration of the matter described herein. The taxpayer provides supporting information and requests appropriate action by the Service.`,
      `The taxpayer submits this letter to request review and action on the matter outlined below. Relevant facts and supporting details are provided for the Service's consideration.`,
      `This letter presents a formal request for the Service to review and act upon the matter set forth in this correspondence. Supporting information is included for evaluation.`,
    ])
  })

  return sections
}

export function generalCorrespondenceRequestedActions(seed: string, ctx: LetterContext): { heading?: string; body: string } {
  return {
    heading: 'Requested Action',
    body: `The taxpayer respectfully requests that the Service:\n\n1. Review the information provided\n2. Process this request in accordance with applicable procedures\n3. Issue a written determination\n4. Provide confirmation once action is complete`
  }
}