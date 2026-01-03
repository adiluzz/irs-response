// lib/letters/generators/generateCP2000DisagreeLetter.ts

import {
  generateCP2000DisagreeLetter as generateBody,
  CP2000DisagreeVars,
} from '../cp2000DisagreeTemplates';
import { generateExpandedExplanation } from '../explanations/cp2000DisagreeReasons';

export interface CP2000DisagreeGeneratorVars {
  TODAY_DATE: string;
  TAX_YEAR: string;
  BALANCE: string;
  NOTICE_DATE?: string;
  NOTICE_NUMBER?: string;
  REASON_ID?: string;
  USER_NOTE?: string;
}

export function generateCP2000DisagreeLetter(
  vars: CP2000DisagreeGeneratorVars
): string {
  const templateVars: CP2000DisagreeVars = {
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