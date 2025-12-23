// lib/letters/generators/generateBalanceDueDisputeLetter.ts

import {
  generateBalanceDueDisputeLetter as generateBody,
  BalanceDueDisputeVars,
} from '../balanceDueDisputeTemplates';
import { generateExpandedExplanation } from '../explanations/balanceDueDisputeReasons';

export interface DisputeGeneratorVars {
  TODAY_DATE: string;
  TAX_YEAR: string;
  BALANCE: string;
  NOTICE_DATE?: string;
  NOTICE_NUMBER?: string;
  REASON_ID?: string;
  USER_NOTE?: string;
}

export function generateBalanceDueDisputeLetter(vars: DisputeGeneratorVars): string {
  const templateVars: BalanceDueDisputeVars = {
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