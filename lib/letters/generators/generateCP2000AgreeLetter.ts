// lib/letters/generators/generateCP2000AgreeLetter.ts

import {
  generateCP2000AgreeLetter as generateBody,
  CP2000AgreeVars,
} from '../cp2000AgreeTemplates';

export interface CP2000AgreeGeneratorVars {
  TODAY_DATE: string;
  TAX_YEAR: string;
  BALANCE: string;
  NOTICE_DATE?: string;
  NOTICE_NUMBER?: string;
  USER_NOTE?: string;
}

export function generateCP2000AgreeLetter(vars: CP2000AgreeGeneratorVars): string {
  const templateVars: CP2000AgreeVars = {
    TODAY_DATE: vars.TODAY_DATE,
    TAX_YEAR: vars.TAX_YEAR,
    BALANCE: vars.BALANCE,
    NOTICE_DATE: vars.NOTICE_DATE,
    NOTICE_NUMBER: vars.NOTICE_NUMBER,
    USER_NOTE: vars.USER_NOTE,
    includeEducationalReferences: false,
  };

  return generateBody(templateVars);
}