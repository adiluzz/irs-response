// lib/letters/educationalReferences.ts

export function generateEducationalReferences(): string {
  return [
    '',
    '---',
    '',
    'Primary authority (U.S. Code / Internal Revenue Code):',
    '• 26 U.S.C. § 6303 — Notice and demand for tax',
    '• 26 U.S.C. § 6159 — Agreements for payment of tax liability in installments',
    '• 26 U.S.C. §§ 6320 and 6330 — Collection Due Process (CDP) rights (liens and levies)',
    '• 26 U.S.C. § 6651 — Failure-to-file and failure-to-pay additions to tax',
    '• 26 U.S.C. § 6404 — Abatement of assessments and penalties in limited circumstances',
    '',
    'IRS publications:',
    '• IRS Publication 1 — Your Rights as a Taxpayer',
    '• IRS Publication 594 — The IRS Collection Process',
    '• IRS Publication 556 — Examination of Returns, Appeal Rights, and Claims for Refund',
    "• IRS Publication 5 — Your Appeal Rights and How to Prepare a Protest If You Don't Agree",
  ].join('\n')
}

// Backward-compatible alias
export const generateEducationalAppendix = generateEducationalReferences

