// lib/letters/explanations/cp2000DisagreeReasons.ts

export type ReasonOption = {
  id: string;
  title: string;
  short: string;
};

export const REASONS: ReasonOption[] = [
  {
    id: 'already_reported',
    title: 'Income Already Reported',
    short: 'The income referenced was already included on my original return.',
  },
  {
    id: 'duplicate_reporting',
    title: 'Duplicate Information Reporting',
    short: 'The income appears to have been reported more than once by different sources.',
  },
  {
    id: 'incorrect_amount',
    title: 'Incorrect Amount on Information Return',
    short: 'The amount shown on the information return does not match my records.',
  },
  {
    id: 'not_my_income',
    title: 'Income Does Not Belong to Me',
    short: 'The income referenced does not belong to me and may be attributed in error.',
  },
  {
    id: 'basis_not_considered',
    title: 'Cost Basis Not Reflected',
    short: 'The notice does not appear to account for cost basis or other adjustments.',
  },
  {
    id: 'withholding_not_credited',
    title: 'Withholding Not Credited',
    short: 'Withholding or estimated payments were not credited to my account.',
  },
  {
    id: 'deduction_not_considered',
    title: 'Deduction or Adjustment Not Considered',
    short: 'A deduction or adjustment that offsets this income was not considered.',
  },
  {
    id: 'retirement_rollover',
    title: 'Retirement Distribution Was Rolled Over',
    short: 'The distribution shown was rolled over and should not be taxable.',
  },
  {
    id: 'nontaxable_income',
    title: 'Income Is Nontaxable',
    short: 'The income referenced is nontaxable for the reason indicated.',
  },
  {
    id: 'timing_difference',
    title: 'Timing or Year Difference',
    short: 'The income was reported in a different tax year consistent with applicable rules.',
  },
  {
    id: 'corrected_form_issued',
    title: 'Corrected Form Was Issued',
    short: 'A corrected information return was issued that reflects accurate information.',
  },
  {
    id: 'other',
    title: 'Other Reason',
    short: 'The circumstances are explained in additional detail below.',
  },
];

const EXPANDED_TEMPLATES: Record<string, string[]> = {
  already_reported: [
    'The income identified in the notice was already included on my original return. My records indicate this amount was properly reported, and I have enclosed documentation showing its inclusion.',
    'Upon review, the income referenced in the CP2000 notice was reported on my original return. The attached documentation demonstrates that this income was accounted for in my filing.',
    'The income in question appears on my original return as filed. I am providing supporting records that show this amount was included in my reported income for the tax year.',
  ],
  duplicate_reporting: [
    'The income appears to have been reported by more than one source, resulting in a duplicate entry. My records show the correct amount, and I am enclosing documentation to support this.',
    'It appears the same income was reported multiple times by different payers. The attached documentation clarifies the correct amount that should be attributed to my return.',
    'The notice reflects income that has been duplicated due to multiple information returns for the same amount. I am providing records to demonstrate the accurate figure.',
  ],
  incorrect_amount: [
    'The amount shown on the information return referenced in the notice does not match my records. I am enclosing documentation that reflects the correct amount.',
    'My records indicate a different amount than what is shown on the information return. The attached documentation supports the figures reported on my original return.',
    'The information return amount appears to be incorrect. I have enclosed records showing the accurate amount that should be considered.',
  ],
  not_my_income: [
    'The income referenced in the notice does not belong to me. This may be due to an error in the information return or incorrect attribution. I am providing information to clarify this matter.',
    'I do not recognize the income shown in the notice as mine. It appears this income may have been attributed to me in error.',
    'The income identified in the CP2000 notice is not attributable to me. I request that this be reviewed and corrected.',
  ],
  basis_not_considered: [
    'The notice does not appear to reflect the cost basis associated with the transaction in question. My records show the basis that should be applied, reducing the taxable amount.',
    'It appears that cost basis or other adjustments were not considered in calculating the proposed change. I am providing documentation of the correct basis.',
    'The proposed adjustment does not account for my cost basis in the asset. Enclosed documentation shows the basis that should be applied.',
  ],
  withholding_not_credited: [
    'Withholding shown on my information returns does not appear to be fully credited to my account. I am providing documentation of the withholding that should be applied.',
    'My records indicate that withholding or estimated payments were not credited. The attached documents support the amounts that should reduce my liability.',
    'The notice does not reflect all withholding credited to my account. I am enclosing records of the withholding that was reported.',
  ],
  deduction_not_considered: [
    'A deduction or adjustment that offsets the income in question was not considered in the proposed changes. I am providing documentation to support this adjustment.',
    'The proposed adjustment does not account for a deduction or adjustment that applies to this income. Enclosed documentation supports my position.',
    'My original return included a deduction or adjustment related to this income that appears not to have been considered.',
  ],
  retirement_rollover: [
    'The retirement distribution referenced in the notice was rolled over within the applicable timeframe and should not be taxable. I am providing documentation of the rollover.',
    'The distribution shown was properly rolled over to a qualified account. Enclosed documentation demonstrates compliance with rollover requirements.',
    'My records show that this distribution was rolled over and reported correctly on my return. I am attaching supporting documentation.',
  ],
  nontaxable_income: [
    'The income referenced in the notice is nontaxable based on its nature and applicable rules. I am providing documentation to support the nontaxable treatment.',
    'This income qualifies for nontaxable treatment. The attached documentation explains the basis for excluding this amount from taxable income.',
    'My records indicate this income is not subject to tax for the reason documented. I am enclosing supporting materials.',
  ],
  timing_difference: [
    'The income was reported in a different tax year consistent with applicable reporting rules. My records support the timing of the income recognition.',
    'Due to timing differences in income recognition, this amount was properly reported in another tax year. I am providing documentation to clarify.',
    'The income referenced was correctly reported in a different period. The attached records support the year in which the income was recognized.',
  ],
  corrected_form_issued: [
    'A corrected information return was issued that reflects accurate information. I am enclosing a copy of the corrected form for your review.',
    'The payer issued a corrected form that supersedes the original information return. The attached corrected document reflects the accurate figures.',
    'My records include a corrected information return that should be used in place of the original. I am providing a copy for your consideration.',
  ],
  other: [
    'The specific circumstances of my situation are provided below. I request that these be considered in reviewing the proposed changes.',
    'Additional details regarding my disagreement with the proposed adjustments are provided below for your review.',
    'The following information explains the basis for my disagreement with the CP2000 notice.',
  ],
};

function pickExpanded(templates: string[], seed: number): string {
  return templates[seed % templates.length];
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateExpandedExplanation(
  reasonId: string,
  userNote?: string
): string {
  const templates = EXPANDED_TEMPLATES[reasonId];
  if (!templates) {
    return userNote
      ? `Additional context provided by the taxpayer: ${userNote.trim()}`
      : '';
  }

  const seed = hashCode(reasonId + (userNote || ''));
  let expanded = pickExpanded(templates, seed);

  if (userNote && userNote.trim()) {
    expanded += `\n\nAdditional context provided by the taxpayer: ${userNote.trim()}`;
  }

  return expanded;
}