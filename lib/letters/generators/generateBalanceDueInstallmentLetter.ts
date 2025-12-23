// lib/letters/generators/generateBalanceDueInstallmentLetter.ts

import {
  generateBalanceDueInstallmentLetter as generateBody,
  BalanceDueInstallmentVars,
} from '../balanceDueInstallmentTemplates';

export interface InstallmentGeneratorVars {
  TODAY_DATE: string;
  TAX_YEAR: string;
  BALANCE: string;
  MONTHLY_PAYMENT?: string;
  NOTICE_DATE?: string;
  NOTICE_NUMBER?: string;
  USER_NOTE?: string;
}

export function generateBalanceDueInstallmentLetter(
  vars: InstallmentGeneratorVars
): string {
  const templateVars: BalanceDueInstallmentVars = {
    TODAY_DATE: vars.TODAY_DATE,
    TAX_YEAR: vars.TAX_YEAR,
    BALANCE: vars.BALANCE,
    MONTHLY_PAYMENT: vars.MONTHLY_PAYMENT,
    NOTICE_DATE: vars.NOTICE_DATE,
    NOTICE_NUMBER: vars.NOTICE_NUMBER,
    USER_NOTE: vars.USER_NOTE,
    includeEducationalReferences: false,
  };

  return generateBody(templateVars);
}