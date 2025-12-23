import { NoticeType } from '../types'

export interface NoticeEntry {
  type: NoticeType
  label: string
}

export const supportedNotices: NoticeEntry[] = [
  { type: NoticeType.CP2000, label: 'CP2000 - Underreported Income' },
  { type: NoticeType.CP14, label: 'CP14 - Balance Due' },
  { type: NoticeType.CP501, label: 'CP501 - Reminder Notice' },
  { type: NoticeType.CP12, label: 'CP12 - Adjustment' },
  { type: NoticeType.CP05, label: 'CP05 - Review' },
]

