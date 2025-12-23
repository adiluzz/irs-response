// lib/letters/generators/generateCP2000PartialAgreeLetter.ts

import {
  generateCP2000PartialAgreeLetter as generateBody,
  CP2000PartialAgreeVars,
} from '../cp2000PartialAgreeTemplates';
import { generateExpandedExplanation } from '../explanations/cp2000DisagreeReasons';

export interface CP2000PartialAgreeGeneratorVars {
  TODAY_DATE: string;
  TAX_YEAR: string;
  BALANCE: string;
  NOTICE_DATE?: string;
  NOTICE_NUMBER?: string;
  REASON_ID?: string;
  USER_NOTE?: string;
}

export function generateCP2000PartialAgreeLetter(
  vars: CP2000PartialAgreeGeneratorVars
): string {
  const templateVars: CP2000PartialAgreeVars = {
    TODAY_DATE: vars.TODAY_DATE,
    TAX_YEAR: vars.TAX_YEAR,
    BALANCE: vars.BALANCE,
    NOTICE_DATE: vars.NOTICE_DATE,
    NOTICE_NUMBER: vars.NOTICE_NUMBER,
    REASON_ID: vars.REASON_ID,
    USER_NOTE: vars.USER_NOTE,
    includeEducationalReferences: false,
  };

  let expandedExplanation: string | undefined;
  if (vars.REASON_ID) {
    expandedExplanation = generateExpandedExplanation(vars.REASON_ID, vars.USER_NOTE);
  }

  return generateBody(templateVars, expandedExplanation);
}