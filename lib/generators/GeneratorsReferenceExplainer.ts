const IRC_EXPLANATIONS: Record<string, string> = {
  'IRC § 6201':
    'This section authorizes the IRS to assess taxes and establishes the statutory basis for determining and recording tax liabilities.',

  'IRC § 6213':
    'This section restricts when deficiencies may be assessed and permits pre-assessment review by the Tax Court.',

  'IRC § 6651':
    'This section governs penalties for failure to file returns or pay taxes. Penalties may be abated upon a showing of reasonable cause.',

  'IRC § 6654':
    'This section addresses penalties for underpayment of estimated tax. Statutory exceptions apply in certain circumstances.',

  'IRC § 6662':
    'This section imposes accuracy-related penalties on underpayments. Penalties may be waived when reasonable cause and good faith are established.',

  'IRC § 6159':
    'This section authorizes installment agreements for payment of tax liabilities when full payment cannot be made immediately.',

  'IRC § 6601':
    'This section governs interest on underpayments and late payments. Interest accrues from the statutory due date until payment.',

  'IRC § 6621':
    'This section establishes the method for determining interest rates, which are set quarterly based on the federal short-term rate.',

  'IRC § 6331':
    'This section authorizes levy action to collect unpaid taxes, subject to statutory exemptions.',

  'IRC § 6330':
    'This section requires notice prior to levy and provides for a Collection Due Process hearing.',

  'IRC § 6320':
    'This section requires notice when a federal tax lien is filed and provides for administrative review.',

  'IRC § 6303':
    'This section requires notice and demand for payment following assessment of tax.',

  'IRC § 6321':
    'This section establishes a federal tax lien when assessed taxes remain unpaid after notice and demand.',

  'IRC § 6402':
    'This section authorizes the application of overpayments to outstanding tax liabilities.',

  'IRC § 6502':
    'This section establishes the general ten-year period for collection following assessment.',

  'IRC § 6511':
    'This section prescribes time limitations for filing claims for refund or credit.',

  'IRC § 6513':
    'This section defines when returns are deemed filed and taxes deemed paid for statutory purposes.',

  'IRC § 7491':
    'This section governs burden of proof considerations in court proceedings when statutory conditions are met.',

  'IRC § 61':
    'This section defines gross income to include all income from whatever source derived, except as otherwise provided.',

  'IRC § 61(a)(1)':
    'This subsection includes compensation for services in gross income.',

  'IRC § 61(a)(4)':
    'This subsection includes interest income in gross income.',

  'IRC § 61(a)(7)':
    'This subsection includes dividend income in gross income.',

  'IRC § 162':
    'This section allows deductions for ordinary and necessary expenses incurred in carrying on a trade or business.',

  'IRC § 446':
    'This section governs permissible methods of accounting and requires consistency.',

  'IRC § 1001':
    'This section determines gain or loss from the sale or disposition of property.',

  'IRC § 1012':
    'This section establishes cost as the general basis of property.',

  'IRC § 1223':
    'This section governs holding periods for capital assets.',

  'IRC § 1402':
    'This section defines net earnings from self-employment for purposes of self-employment tax.',

  'IRC § 31':
    'This section allows credit for income tax withheld against total tax liability.',

  'IRC § 72':
    'This section governs taxation of annuities and retirement distributions.',

  'IRC § 402':
    'This section addresses taxation of distributions from qualified retirement plans.',

  'IRC § 3402':
    'This section requires employers to withhold income tax from wages.',

  'IRC § 6020':
    'This section authorizes the preparation of substitute returns for non-filers.',

  'IRC § 6041':
    'This section requires information reporting for certain payments.',

  'IRC § 6041A':
    'This section requires reporting of payments for services.',

  'IRC § 6042':
    'This section requires reporting of dividend payments.',

  'IRC § 6049':
    'This section requires reporting of interest payments.',

  'IRC § 6050W':
    'This section requires reporting of payment card and third-party network transactions.',

  'IRC § 6051':
    'This section requires employers to furnish wage statements.',

  'IRC § 6211':
    'This section defines a deficiency as the excess of correct tax over reported tax.',

  'IRC § 6403':
    'This section governs the treatment of overpayments of installment obligations.',

  'IRC § 6657':
    'This section imposes penalties for dishonored payments.',

  'IRC § 6311':
    'This section authorizes acceptable methods of tax payment.',

  'IRC § 6672':
    'This section imposes the trust fund recovery penalty on responsible persons.',

  'IRC § 6315':
    'This section governs the crediting of estimated income tax payments.',
};

const PUBLICATION_EXPLANATIONS: Record<string, string> = {
  'IRS Publication 1':
    'This publication summarizes taxpayer rights and administrative procedures.',

  'IRS Publication 5':
    'This publication outlines the administrative appeals process.',

  'IRS Publication 15':
    'This publication provides guidance on employment tax obligations.',

  'IRS Publication 17':
    'This publication provides guidance on individual income tax reporting.',

  'IRS Publication 334':
    'This publication provides tax guidance for small businesses.',

  'IRS Publication 505':
    'This publication addresses withholding and estimated tax requirements.',

  'IRS Publication 525':
    'This publication distinguishes taxable and nontaxable income.',

  'IRS Publication 544':
    'This publication addresses sales and dispositions of assets.',

  'IRS Publication 550':
    'This publication addresses investment income and expenses.',

  'IRS Publication 556':
    'This publication explains examination and appeal procedures.',

  'IRS Publication 575':
    'This publication addresses pension and annuity income.',

  'IRS Publication 594':
    'This publication explains the IRS collection process.',

  'IRS Publication 966':
    'This publication describes electronic payment options.',

  'IRS Publication 1660':
    'This publication explains collection appeal procedures.',

  'IRS Publication 5181':
    'This publication explains CP2000 notices and the underreporter process.',
};

export function explainReference(reference: string): string {
  const trimmed = reference.trim();

  for (const [key, explanation] of Object.entries(IRC_EXPLANATIONS)) {
    if (trimmed.startsWith(key)) {
      return explanation;
    }
  }

  for (const [key, explanation] of Object.entries(PUBLICATION_EXPLANATIONS)) {
    if (trimmed.includes(key.replace('IRS ', ''))) {
      return explanation;
    }
  }

  return '';
}

export function formatReferenceWithExplanation(reference: string): string {
  const explanation = explainReference(reference);
  if (explanation) {
    return `${reference}\n  ${explanation}`;
  }
  return reference;
}

export function formatReferencesBlock(references: string[]): string {
  const uniqueRefs = [...new Set(references)];
  const formatted = uniqueRefs.map((ref) => {
    const explanation = explainReference(ref);
    if (explanation) {
      return `• ${ref}\n  ${explanation}`;
    }
    return `• ${ref}`;
  });

  return '\n\nReferences:\n' + formatted.join('\n\n');
}
