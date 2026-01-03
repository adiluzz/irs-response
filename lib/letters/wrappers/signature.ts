// lib/letters/wrappers/signature.ts

export interface SignatureVars {
  TAXPAYER_NAME: string;
  TAXPAYER_PHONE?: string;
  TAXPAYER_EMAIL?: string;
}

export function generateSignature(vars: SignatureVars): string {
  const lines: string[] = [];

  lines.push('Respectfully submitted,');
  lines.push('');
  lines.push('');
  lines.push('_________________________________');
  lines.push(vars.TAXPAYER_NAME);

  if (vars.TAXPAYER_PHONE && vars.TAXPAYER_PHONE.trim()) {
    lines.push(vars.TAXPAYER_PHONE.trim());
  }

  if (vars.TAXPAYER_EMAIL && vars.TAXPAYER_EMAIL.trim()) {
    lines.push(vars.TAXPAYER_EMAIL.trim());
  }

  return lines.join('\n');
}