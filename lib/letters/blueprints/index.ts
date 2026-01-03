import type { Blueprint, NoticeType } from './types'

import { cp14Blueprint } from './cp14'
import { cp501Blueprint } from './cp501'
import { cp503Blueprint } from './cp503'
import { cp504Blueprint } from './cp504'
import { cp2000Blueprint } from './cp2000'
import { form843Blueprint } from './form843'

import { letter1058Blueprint } from './letter1058.blueprint'
import { cp90Blueprint } from './cp90.blueprint'
import { cp91Blueprint } from './cp91.blueprint'

export const blueprintRegistry: Record<NoticeType, Blueprint> = {
  CP14: cp14Blueprint,
  CP501: cp501Blueprint,
  CP503: cp503Blueprint,
  CP504: cp504Blueprint,
  CP2000: cp2000Blueprint,
  FORM_843: form843Blueprint,

  LETTER_1058: letter1058Blueprint,
  CP90: cp90Blueprint,
  CP91: cp91Blueprint,
}

export function getBlueprint(noticeType: NoticeType) {
  const blueprint = blueprintRegistry[noticeType]
  if (!blueprint) {
    throw new Error(`No blueprint registered for notice type: ${noticeType}`)
  }
  return blueprint
}

export * from './types'
