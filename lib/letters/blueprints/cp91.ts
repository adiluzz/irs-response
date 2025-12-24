// lib/letters/blueprints/cp91.ts

import {
  LevyNoticeType,
  LevyIntentFamilyInput,
} from '../library/families/levy_intent/types'
import {
  composeLevyIntentLetter,
  ComposeResult,
} from '../library/families/levy_intent/compose'

export type CP91Input = Omit<LevyIntentFamilyInput, 'noticeType'>

export function composeCP91(input: CP91Input): ComposeResult {
  const fullInput: LevyIntentFamilyInput = {
    ...input,
    noticeType: LevyNoticeType.CP91,
  }

  return composeLevyIntentLetter(fullInput)
}
