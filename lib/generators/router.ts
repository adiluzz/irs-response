// lib/generators/router.ts

import { NoticeType, NoticeDataOf } from '@/types'

import { generateCP14Letter } from '@/lib/cp14Generator'
import { generateCP2000Letter } from '@/lib/cp2000Generator'
import { generateCP501Letter } from '@/lib/cp501Generator'
import { generateCP503Letter } from '@/lib/cp503Generator'
import { generateCP504Letter } from '@/lib/cp504Generator'

export type GeneratorOptions = Record<string, unknown>

type GeneratorInput<T extends NoticeType> = {
  type: T
  data: NoticeDataOf<T>
  options?: GeneratorOptions
}

export function generateLetter<T extends NoticeType>(input: GeneratorInput<T>) {
  switch (input.type) {
    case NoticeType.CP14:
      return generateCP14Letter(
        input.data as NoticeDataOf<NoticeType.CP14>,
        input.options
      )

    case NoticeType.CP2000:
      return generateCP2000Letter(
        input.data as NoticeDataOf<NoticeType.CP2000>,
        input.options
      )

    case NoticeType.CP501:
      return generateCP501Letter(
        input.data as NoticeDataOf<NoticeType.CP501>,
        input.options
      )

    case NoticeType.CP503:
      return generateCP503Letter(
        input.data as NoticeDataOf<NoticeType.CP503>,
        input.options
      )

    case NoticeType.CP504:
      return generateCP504Letter(
        input.data as NoticeDataOf<NoticeType.CP504>,
        input.options
      )

    default:
      throw new Error(`Unknown notice type: ${input.type}`)
  }
}
