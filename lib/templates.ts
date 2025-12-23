// lib/templates.ts

import { NoticeType } from '../types'
import type { NoticeData, CP14Data, CP2000Data, CP501Data, CP503Data, CP504Data } from '../types'

import { generateCP14Letter } from './cp14Generator'
import { generateCP2000Letter } from './cp2000Generator'
import { generateCP501Letter } from './cp501Generator'
import { generateCP503Letter } from './cp503Generator'
import { generateCP504Letter } from './cp504Generator'

type AnyOptions = Record<string, unknown> | undefined

export function generateTemplate(type: NoticeType, data: NoticeData, options?: AnyOptions) {
  switch (type) {
    case NoticeType.CP14:
      return generateCP14Letter(data as CP14Data, options as any)

    case NoticeType.CP2000:
      return generateCP2000Letter(data as CP2000Data, options as any)

    case NoticeType.CP501:
      return generateCP501Letter(data as CP501Data, options as any)

    case NoticeType.CP503:
      return generateCP503Letter(data as CP503Data, options as any)

    case NoticeType.CP504:
      return generateCP504Letter(data as CP504Data, options as any)

    default:
      throw new Error(`Unknown notice type: ${type}`)
  }
}
