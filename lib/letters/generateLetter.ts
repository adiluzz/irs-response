// lib/letters/generateLetter.ts

import { generateHeader, HeaderVars } from './wrappers/header';
import { generateSignature, SignatureVars } from './wrappers/signature';
import { generateEducationalReferences } from './educationalReferences';

import { generateBalanceDuePayNowLetter } from './generators/generateBalanceDuePayNowLetter';
import { generateBalanceDueInstallmentLetter } from './generators/generateBalanceDueInstallmentLetter';
import { generateBalanceDueDisputeLetter } from './generators/generateBalanceDueDisputeLetter';
import { generateCP2000AgreeLetter } from './generators/generateCP2000AgreeLetter';
import { generateCP2000PartialAgreeLetter } from './generators/generateCP2000PartialAgreeLetter';
import { generateCP2000DisagreeLetter } from './generators/generateCP2000DisagreeLetter';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type NoticeType = 'CP14' | 'CP501' | 'CP2000';

export type BalanceDueIntent = 'pay_now' | 'installment' | 'dispute';
export type CP2000Intent = 'agree' | 'partial_agree' | 'disagree';
export type Intent = BalanceDueIntent | CP2000Intent;

export interface LetterVars {
  // Header fields
  TAXPAYER_NAME: string;
  TAXPAYER_ADDRESS?: string;
  TAXPAYER_CITY_STATE_ZIP?: string;
  TAXPAYER_SSN?: string;
  TAXPAYER_PHONE?: string;
  TAXPAYER_EMAIL?: string;

  // Core fields
  TODAY_DATE: string;
  TAX_YEAR: string;
  BALANCE: string;

  // Notice fields
  NOTICE_DATE?: string;
  NOTICE_NUMBER?: string;

  // Optional fields
  MONTHLY_PAYMENT?: string;
  REASON_ID?: string;
  USER_NOTE?: string;

  // IRS address override
  IRS_ADDRESS?: string;
}

export interface GenerateLetterInput {
  noticeType: NoticeType;
  intent: Intent;
  vars: LetterVars;
  includeEducationalReferences: boolean;
}

export interface GenerateLetterOutput {
  fullLetter: string;
  header: string;
  body: string;
  signature: string;
  educationalReferences: string | null;
}

// ─────────────────────────────────────────────────────────────
// INTENT VALIDATION
// ─────────────────────────────────────────────────────────────

const BALANCE_DUE_INTENTS: BalanceDueIntent[] = ['pay_now', 'installment', 'dispute'];
const CP2000_INTENTS: CP2000Intent[] = ['agree', 'partial_agree', 'disagree'];

function isBalanceDueIntent(intent: Intent): intent is BalanceDueIntent {
  return BALANCE_DUE_INTENTS.includes(intent as BalanceDueIntent);
}

function isCP2000Intent(intent: Intent): intent is CP2000Intent {
  return CP2000_INTENTS.includes(intent as CP2000Intent);
}

function validateIntentForNotice(noticeType: NoticeType, intent: Intent): void {
  if (noticeType === 'CP2000') {
    if (!isCP2000Intent(intent)) {
      throw new Error(
        `Invalid intent "${intent}" for notice type CP2000. ` +
          `Valid intents: ${CP2000_INTENTS.join(', ')}`
      );
    }
  } else {
    if (!isBalanceDueIntent(intent)) {
      throw new Error(
        `Invalid intent "${intent}" for notice type ${noticeType}. ` +
          `Valid intents: ${BALANCE_DUE_INTENTS.join(', ')}`
      );
    }
  }
}

// ─────────────────────────────────────────────────────────────
// BODY GENERATION ROUTER
// ─────────────────────────────────────────────────────────────

function generateBody(
  noticeType: NoticeType,
  intent: Intent,
  vars: LetterVars
): string {
  // CP2000 routing
  if (noticeType === 'CP2000') {
    switch (intent as CP2000Intent) {
      case 'agree':
        return generateCP2000AgreeLetter({
          TODAY_DATE: vars.TODAY_DATE,
          TAX_YEAR: vars.TAX_YEAR,
          BALANCE: vars.BALANCE,
          NOTICE_DATE: vars.NOTICE_DATE,
          NOTICE_NUMBER: vars.NOTICE_NUMBER,
          USER_NOTE: vars.USER_NOTE,
        });

      case 'partial_agree':
        return generateCP2000PartialAgreeLetter({
          TODAY_DATE: vars.TODAY_DATE,
          TAX_YEAR: vars.TAX_YEAR,
          BALANCE: vars.BALANCE,
          NOTICE_DATE: vars.NOTICE_DATE,
          NOTICE_NUMBER: vars.NOTICE_NUMBER,
          REASON_ID: vars.REASON_ID,
          USER_NOTE: vars.USER_NOTE,
        });

      case 'disagree':
        return generateCP2000DisagreeLetter({
          TODAY_DATE: vars.TODAY_DATE,
          TAX_YEAR: vars.TAX_YEAR,
          BALANCE: vars.BALANCE,
          NOTICE_DATE: vars.NOTICE_DATE,
          NOTICE_NUMBER: vars.NOTICE_NUMBER,
          REASON_ID: vars.REASON_ID,
          USER_NOTE: vars.USER_NOTE,
        });

      default:
        throw new Error(`Unhandled CP2000 intent: ${intent}`);
    }
  }

  // Balance-due routing (CP14, CP501)
  switch (intent as BalanceDueIntent) {
    case 'pay_now':
      return generateBalanceDuePayNowLetter({
        TODAY_DATE: vars.TODAY_DATE,
        TAX_YEAR: vars.TAX_YEAR,
        BALANCE: vars.BALANCE,
        NOTICE_DATE: vars.NOTICE_DATE,
        NOTICE_NUMBER: vars.NOTICE_NUMBER,
        USER_NOTE: vars.USER_NOTE,
      });

    case 'installment':
      return generateBalanceDueInstallmentLetter({
        TODAY_DATE: vars.TODAY_DATE,
        TAX_YEAR: vars.TAX_YEAR,
        BALANCE: vars.BALANCE,
        MONTHLY_PAYMENT: vars.MONTHLY_PAYMENT,
        NOTICE_DATE: vars.NOTICE_DATE,
        NOTICE_NUMBER: vars.NOTICE_NUMBER,
        USER_NOTE: vars.USER_NOTE,
      });

    case 'dispute':
      return generateBalanceDueDisputeLetter({
        TODAY_DATE: vars.TODAY_DATE,
        TAX_YEAR: vars.TAX_YEAR,
        BALANCE: vars.BALANCE,
        NOTICE_DATE: vars.NOTICE_DATE,
        NOTICE_NUMBER: vars.NOTICE_NUMBER,
        REASON_ID: vars.REASON_ID,
        USER_NOTE: vars.USER_NOTE,
      });

    default:
      throw new Error(`Unhandled balance-due intent: ${intent}`);
  }
}

// ─────────────────────────────────────────────────────────────
// MAIN ENTRY POINT
// ─────────────────────────────────────────────────────────────

export function generateLetter(input: GenerateLetterInput): GenerateLetterOutput {
  const { noticeType, intent, vars, includeEducationalReferences } = input;

  // Validate intent for notice type
  validateIntentForNotice(noticeType, intent);

  // Build header
  const headerVars: HeaderVars = {
    TAXPAYER_NAME: vars.TAXPAYER_NAME,
    TAXPAYER_ADDRESS: vars.TAXPAYER_ADDRESS,
    TAXPAYER_CITY_STATE_ZIP: vars.TAXPAYER_CITY_STATE_ZIP,
    TAXPAYER_SSN: vars.TAXPAYER_SSN,
    TODAY_DATE: vars.TODAY_DATE,
    NOTICE_NUMBER: vars.NOTICE_NUMBER,
    IRS_ADDRESS: vars.IRS_ADDRESS,
  };
  const header = generateHeader(headerVars);

  // Build body
  const body = generateBody(noticeType, intent, vars);

  // Build signature
  const signatureVars: SignatureVars = {
    TAXPAYER_NAME: vars.TAXPAYER_NAME,
    TAXPAYER_PHONE: vars.TAXPAYER_PHONE,
    TAXPAYER_EMAIL: vars.TAXPAYER_EMAIL,
  };
  const signature = generateSignature(signatureVars);

  // Build educational references (optional, no parameters)
  let educationalReferences: string | null = null;
  if (includeEducationalReferences) {
    educationalReferences = generateEducationalReferences();
  }

  // Assemble full letter
  const parts: string[] = [header, body, '', signature];
  if (educationalReferences) {
    parts.push(educationalReferences);
  }
  const fullLetter = parts.join('\n');

  return {
    fullLetter,
    header,
    body,
    signature,
    educationalReferences,
  };
}

// ─────────────────────────────────────────────────────────────
// CONVENIENCE EXPORTS
// ─────────────────────────────────────────────────────────────

export type { HeaderVars } from './wrappers/header';
export type { SignatureVars } from './wrappers/signature';