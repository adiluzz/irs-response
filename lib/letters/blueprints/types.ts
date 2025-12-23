/**
 * Shared types for letter blueprints
 */

export type NoticeFamily =
  | 'collection_balance_due'
  | 'underreporter_exam'
  | 'levy_intent'
  | 'lien'
  | 'general_correspondence'

export type NoticeType =
  | 'CP14'
  | 'CP501'
  | 'CP503'
  | 'CP504'
  | 'CP2000'
  | 'FORM_843'

export type LetterContext = {
  noticeType: NoticeType
  family: NoticeFamily
  taxpayerName: string
  taxpayerAddress?: string
  idValue?: string
  noticeDate?: string
  taxYear?: string
  amount?: string
  deadline?: string
  position?: string
  discrepancyType?: string
  explanation?: string
  priorActions?: string
  // Additional context fields as needed
  [key: string]: string | undefined
}

export type Blueprint = {
  noticeType: NoticeType
  family: NoticeFamily
  build(ctx: LetterContext): {
    reLine: string
    taxpayerBlock: string
    sections: Array<{ heading?: string; body: string }>
    closingBlock: string
    certifiedMail?: boolean
  }
}