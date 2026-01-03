// lib/letters/generators/generateBalanceDuePayNowLetter.ts

import {
  generateBalanceDuePayNowLetter as generateBody,
  BalanceDuePayNowVars,
} from '../balanceDuePayNowTemplates';

export interface PayNowGeneratorVars {
  TODAY_DATE: string;
  TAX_YEAR: string;
  BALANCE: string;
  NOTICE_DATE?: string;
  NOTICE_NUMBER?: string;
  USER_NOTE?: string;
}

export function generateBalanceDuePayNowLetter(vars: PayNowGeneratorVars): string {
  const templateVars: BalanceDuePayNowVars = {
    TODAY_DATE: vars.TODAY_DATE,
    TAX_YEAR: vars.TAX_YEAR,
    BALANCE: vars.BALANCE,
    NOTICE_DATE: vars.NOTICE_DATE,
    NOTICE_NUMBER: vars.NOTICE_NUMBER,
    USER_NOTE: vars.USER_NOTE,
    includeEducationalReferences: false, // handled by orchestrator
  };

  return generateBody(templateVars);
}