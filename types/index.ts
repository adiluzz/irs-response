// /types/index.ts

export enum NoticeType {
  CP2000 = 'cp2000',
  CP14 = 'cp14',
  CP501 = 'cp501',
  CP503 = 'cp503',
  CP504 = 'cp504',
  CP12 = 'cp12',
  CP05 = 'cp05',
}

export enum FormType {
  FORM_843 = 'form843',
}

export interface TaxpayerInfo {
  fullName: string
  address: string
  city: string
  state: string
  zipCode: string
  ssn: string
  phone: string
}

export interface BaseNoticeData {
  taxpayer: TaxpayerInfo
  taxYear: string
  noticeDate: string
  noticeNumber: string
}

export type DiscrepancyType =
  | 'income'
  | 'deductions'
  | 'credits'
  | 'filing_status'
  | 'dependents'
  | 'withholding'
  | 'payments'
  | 'penalty_interest'
  | 'other'

export type BalanceDueReason =
  | 'unpaid_tax'
  | 'irs_adjustment'
  | 'penalty_interest'
  | 'payment_misapplied'
  | 'unknown'
  | 'other'

export type CP14ResponsePosition =
  | 'dispute'
  | 'already_paid'
  | 'request_time_to_pay'

export interface CP2000Data {
  taxYear: string
  noticeDate: string
  noticeNumber: string
  underreportedAmount: string
  proposedTaxDue: string
  disagreementReason:
    | 'already_reported'
    | 'incorrect_amount'
    | 'not_my_income'
    | 'other'
  disagreementExplanation?: string
}

export interface CP14Data extends BaseNoticeData {
  discrepancyType: DiscrepancyType
  balanceDueReason: BalanceDueReason
  responsePosition: CP14ResponsePosition
  amountDue: string
  explanation?: string
}

export interface CP501Data extends BaseNoticeData {
  discrepancyType: DiscrepancyType
  balanceDueReason: BalanceDueReason
  amountDue: string
  explanation?: string
}

export interface CP503Data extends BaseNoticeData {
  discrepancyType: DiscrepancyType
  balanceDueReason: BalanceDueReason
  amountDue: string
  explanation?: string
}

export interface CP504Data extends BaseNoticeData {
  discrepancyType: DiscrepancyType
  balanceDueReason: BalanceDueReason
  amountDue: string
  explanation?: string
}

export interface CP12Data {
  taxYear: string
  noticeDate: string
  noticeNumber: string
  adjustmentAmount: string
  agreement: 'agree' | 'disagree'
  explanation?: string
}

export interface CP05Data {
  taxYear: string
  noticeDate: string
  noticeNumber: string
  requestType: 'provide_documents' | 'request_extension'
  explanation?: string
}

export interface Form843Data {
  taxYear: string
  reliefType:
    | 'penalty_abatement'
    | 'interest_abatement'
    | 'erroneous_assessment'
    | 'irs_error_delay'
  penaltyType: string
  penaltyAmount: string
  interestAmount: string
  totalRefundRequested: string
  paymentDates: string
  explanation: string
  includeCoverLetter: boolean
  irsServiceCenter: string
}

export type NoticeDataMap = {
  [NoticeType.CP2000]: CP2000Data
  [NoticeType.CP14]: CP14Data
  [NoticeType.CP501]: CP501Data
  [NoticeType.CP503]: CP503Data
  [NoticeType.CP504]: CP504Data
  [NoticeType.CP12]: CP12Data
  [NoticeType.CP05]: CP05Data
}

export type NoticeDataOf<T extends NoticeType> = NoticeDataMap[T]
export type NoticeData = NoticeDataMap[NoticeType]

