// lib/letters/library/families/levy_intent/compose.ts

import { LevyIntentFamilyInput, LevyIntentLetterOutput } from './types'
import { validateLevyIntentInput, ValidationResult } from './validate'
import {
  getPurpose,
  getTaxpayerInformation,
  getNoticeIdentification,
  getResponsePosture,
  getRequestedActions,
  getEnclosuresChecklistFormatted,
  getClosing,
  getAuthority,
} from './templates'

export type ComposeResult =
  | {
      success: true
      output: LevyIntentLetterOutput
    }
  | {
      success: false
      errors: string[]
    }

export function composeLevyIntentLetter(
  input: LevyIntentFamilyInput
): ComposeResult {
  const validation: ValidationResult = validateLevyIntentInput(input)

  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors,
    }
  }

  const output: LevyIntentLetterOutput = {
    purpose: getPurpose(input),
    taxpayerInformation: getTaxpayerInformation(input),
    noticeIdentification: getNoticeIdentification(input),
    responsePosture: getResponsePosture(input),
    requestedActions: getRequestedActions(input),
    enclosuresChecklist: getEnclosuresChecklistFormatted(input),
    closing: getClosing(input),
  }

  if (input.includeAuthority === true) {
    output.authority = getAuthority()
  }

  return {
    success: true,
    output,
  }
}
