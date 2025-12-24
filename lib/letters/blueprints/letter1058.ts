// lib/letters/blueprints/letter1058.ts

import {
  LevyNoticeType,
  LevyIntentFamilyInput,
} from '../library/families/levy_intent/types'
import {
  composeLevyIntentLetter,
  ComposeResult,
} from '../library/families/levy_intent/compose'

export type Letter1058Input = Omit<LevyIntentFamilyInput, 'noticeType'>

export function composeLetter1058(
  input: Letter1058Input
): ComposeResult {
  const fullInput: LevyIntentFamilyInput = {
    ...input,
    noticeType: LevyNoticeType.LETTER_1058,
  }

  return composeLevyIntentLetter(fullInput)
}

