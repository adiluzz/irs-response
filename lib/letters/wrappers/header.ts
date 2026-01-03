// lib/letters/wrappers/header.ts

export interface HeaderVars {
  TAXPAYER_NAME: string;
  TAXPAYER_ADDRESS?: string;
  TAXPAYER_CITY_STATE_ZIP?: string;
  TAXPAYER_SSN?: string;
  TODAY_DATE: string;
  NOTICE_NUMBER?: string;
  IRS_ADDRESS?: string;
}

const DEFAULT_IRS_ADDRESS = `Internal Revenue Service
Kansas City, MO 64999-0002`;

export function generateHeader(vars: HeaderVars): string {
  const lines: string[] = [];

  // Taxpayer info block
  lines.push(vars.TAXPAYER_NAME);
  if (vars.TAXPAYER_ADDRESS) {
    lines.push(vars.TAXPAYER_ADDRESS);
  }
  if (vars.TAXPAYER_CITY_STATE_ZIP) {
    lines.push(vars.TAXPAYER_CITY_STATE_ZIP);
  }
  if (vars.TAXPAYER_SSN) {
    lines.push(`SSN: XXX-XX-${vars.TAXPAYER_SSN.slice(-4)}`);
  }

  lines.push('');
  lines.push(vars.TODAY_DATE);
  lines.push('');

  // IRS address block
  lines.push(vars.IRS_ADDRESS || DEFAULT_IRS_ADDRESS);

  if (vars.NOTICE_NUMBER) {
    lines.push('');
    lines.push(`Re: Notice ${vars.NOTICE_NUMBER}`);
  }

  lines.push('');

  return lines.join('\n');
}