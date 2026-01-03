// /lib/schemas.ts

import { z } from 'zod'
import {
  CP2000Data,
  CP14Data,
  CP501Data,
  CP12Data,
  CP05Data,
  Form843Data,
  NoticeType,
  FormType,
} from '../types'

export const taxpayerInfoSchema = z.object({
  fullName: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  ssn: z.string(),
  phone: z.string(),
})

export const cp2000Schema = z.object({
  taxYear: z.string(),
  noticeDate: z.string(),
  noticeNumber: z.string(),
  underreportedAmount: z.string(),
  proposedTaxDue: z.string(),
  disagreementReason: z.enum([
    'already_reported',
    'incorrect_amount',
    'not_my_income',
    'other',
  ]),
  disagreementExplanation: z.string().optional(),
})

export const cp14Schema = z.object({
  taxYear: z.string(),
  noticeDate: z.string(),
  noticeNumber: z.string(),
  balanceDue: z.string(),
  paymentIntent: z.enum(['pay_now', 'installment_plan', 'dispute']),
  paymentDate: z.string().optional(),
  disputeExplanation: z.string().optional(),
})

export const cp501Schema = cp14Schema

export const cp12Schema = z.object({
  taxYear: z.string(),
  noticeDate: z.string(),
  noticeNumber: z.string(),
  adjustmentAmount: z.string(),
  agreement: z.enum(['agree', 'disagree']),
  explanation: z.string().optional(),
})

export const cp05Schema = z.object({
  taxYear: z.string(),
  noticeDate: z.string(),
  noticeNumber: z.string(),
  requestType: z.enum(['provide_documents', 'request_extension']),
  explanation: z.string().optional(),
})

export const form843Schema = z.object({
  taxYear: z.string(),
  reliefType: z.enum([
    'penalty_abatement',
    'interest_abatement',
    'erroneous_assessment',
    'irs_error_delay',
  ]),
  penaltyType: z.string(),
  penaltyAmount: z.string(),
  interestAmount: z.string(),
  totalRefundRequested: z.string(),
  paymentDates: z.string(),
  explanation: z.string(),
  includeCoverLetter: z.boolean(),
  irsServiceCenter: z.string(),
})