// lib/letters/blueprints/cp90.ts

import {
  LevyNoticeType,
  LevyIntentFamilyInput,
} from '../library/families/levy_intent/types'
import {
  composeLevyIntentLetter,
  ComposeResult,
} from '../library/families/levy_intent/compose'

export type CP90Input = Omit<LevyIntentFamilyInput, 'noticeType'>

export function composeCP90(input: CP90Input): ComposeResult {
  const fullInput: LevyIntentFamilyInput = {
    ...input,
    noticeType: LevyNoticeType.CP90,
  }

  return composeLevyIntentLetter(fullInput)
}
