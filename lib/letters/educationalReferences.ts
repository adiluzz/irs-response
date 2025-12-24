/**
 * Educational / legal authority references
 * Used when ctx.includeReferences === 'true'
 */

export function educationalReferences(): string[] {
  return [
    '---',
    '',
    'LEGAL AND ADMINISTRATIVE AUTHORITY',
    '',
    'Internal Revenue Code (Title 26, United States Code):',
    '• 26 U.S.C. § 6303 — Requires the Service to issue proper notice and demand for payment before collection activity.',
    '• 26 U.S.C. § 6159 — Authorizes installment agreements when immediate full payment would create hardship.',
    '• 26 U.S.C. §§ 6320 and 6330 — Establish Collection Due Process (CDP) rights prior to lien or levy action.',
    '• 26 U.S.C. § 6651 — Governs additions to tax for failure to file or pay, subject to reasonable cause exceptions.',
    '• 26 U.S.C. § 6404 — Authorizes abatement of assessments, penalties, and interest under appropriate circumstances.',
    '',
    'Treasury Regulations and Administrative Guidance:',
    '• Treas. Reg. § 301.6159-1 — Procedures governing installment agreements.',
    '• Treas. Reg. § 301.6330-1 — Due process protections in collection actions.',
    '',
    'IRS Publications (Administrative Authority):',
    '• IRS Publication 1 — Taxpayer rights, including the right to be informed, heard, and to challenge the IRS’s position.',
    '• IRS Publication 594 — The IRS Collection Process, including alternatives to enforced collection.',
    '• IRS Publication 556 — Examination procedures, appeal rights, and claims for refund.',
    '• IRS Publication 5 — Appeal rights and procedures when disputing IRS determinations.',
    '',
    'This response is submitted with reliance on the foregoing authority and is intended to preserve all procedural and substantive rights afforded to the taxpayer.'
  ]
}

/**
 * Backward-compatible aliases
 * (do NOT remove — used by legacy imports)
 */
export const generateEducationalReferences = () =>
  educationalReferences().join('\n')

export const generateEducationalAppendix = generateEducationalReferences

