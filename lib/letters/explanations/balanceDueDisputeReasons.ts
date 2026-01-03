// lib/letters/explanations/balanceDueDisputeReasons.ts


export type ReasonOption = {
  id: string;
  title: string;
  short: string;
};

export const REASONS: ReasonOption[] = [
  {
    id: 'payment_not_credited',
    title: 'Payment Not Credited',
    short: 'I made a payment that does not appear to be credited to my account.',
  },
  {
    id: 'already_paid',
    title: 'Balance Already Paid',
    short: 'This balance was previously paid in full.',
  },
  {
    id: 'incorrect_penalty',
    title: 'Penalty Appears Incorrect',
    short: 'The penalty amount does not appear to be accurate based on my records.',
  },
  {
    id: 'incorrect_interest',
    title: 'Interest Calculation Appears Incorrect',
    short: 'The interest calculation does not appear accurate.',
  },
  {
    id: 'amended_return_filed',
    title: 'Amended Return Filed',
    short: 'I filed an amended return that should affect this balance.',
  },
  {
    id: 'identity_issue',
    title: 'Possible Identity or Account Error',
    short: 'This balance may be attributed to me in error.',
  },
  {
    id: 'refund_offset',
    title: 'Refund Should Have Been Applied',
    short: 'A refund from another year should have been applied to this balance.',
  },
  {
    id: 'installment_in_place',
    title: 'Installment Agreement Already in Place',
    short: 'I have an existing installment agreement covering this balance.',
  },
  {
    id: 'bankruptcy',
    title: 'Bankruptcy Filed',
    short: 'I have filed for bankruptcy and this balance may be affected.',
  },
  {
    id: 'disaster_relief',
    title: 'Disaster Relief May Apply',
    short: 'I may be eligible for disaster relief that affects this balance or deadline.',
  },
  {
    id: 'other',
    title: 'Other Reason',
    short: 'The circumstances are explained in additional detail below.',
  },
];

const EXPANDED_TEMPLATES: Record<string, string[]> = {
  payment_not_credited: [
    'My records indicate that a payment was submitted that does not appear to be reflected in the balance shown. I am providing documentation of this payment for your review.',
    'A payment I made toward this balance does not appear to have been credited to my account. The attached records show proof of this payment.',
    'It appears a payment I submitted has not been applied to my account. I am enclosing documentation to confirm the payment was made.',
  ],
  already_paid: [
    'According to my records, this balance was previously paid in full. I am providing documentation showing the payment that resolved this liability.',
    'My records indicate this balance has already been satisfied. The attached documentation demonstrates that payment was made.',
    'This balance was paid prior to receiving this notice. I am enclosing proof of payment for your review.',
  ],
  incorrect_penalty: [
    'The penalty amount shown does not appear to be accurate based on my understanding of the situation. I request a review of the penalty calculation.',
    'I believe the penalty assessed may not be correct. I am requesting that the penalty be reviewed and recalculated if appropriate.',
    'My records suggest the penalty amount may be incorrect. I respectfully request a review of how the penalty was determined.',
  ],
  incorrect_interest: [
    'The interest calculation does not appear accurate based on my records and the payment history on this account. I request a review of the interest charges.',
    'I believe the interest amount may not reflect all payments made or the correct time periods. I am requesting a recalculation.',
    'The interest shown does not align with my understanding of my account history. I respectfully request that the interest be reviewed.',
  ],
  amended_return_filed: [
    'I filed an amended return that should affect the balance shown. I am enclosing a copy of the amended return for reference.',
    'An amended return was submitted that may change the amount owed. Please review my account in light of this amended filing.',
    'The balance may not reflect an amended return I filed. I am providing documentation of the amended return for your consideration.',
  ],
  identity_issue: [
    'I have concerns that this balance may not be attributable to me. I request a review to confirm the account information is correct.',
    'This balance may have been attributed to me in error. I am requesting verification that this liability is correctly assigned to my account.',
    'I do not recognize this balance and believe there may be an identity or account error. Please review and confirm the accuracy of this notice.',
  ],
  refund_offset: [
    'I expected a refund from another tax year to be applied to this balance. I request confirmation of whether this offset occurred.',
    'A refund that should have been applied to this balance does not appear to have been credited. I am requesting a review of my account.',
    'My records indicate a refund should have reduced this balance. Please review whether the offset was properly applied.',
  ],
  installment_in_place: [
    'I have an existing installment agreement that covers this balance. I request confirmation that this agreement remains in effect.',
    'This balance is subject to an installment agreement I previously established. I am requesting verification of my agreement status.',
    'I am making payments under an installment agreement and this notice may not reflect that arrangement. Please review my account.',
  ],
  bankruptcy: [
    'I have filed for bankruptcy and this balance may be affected by the bankruptcy proceedings. Please review my account accordingly.',
    'A bankruptcy filing may affect this balance. I request that my account be reviewed in light of the bankruptcy case.',
    'This balance may be subject to bankruptcy proceedings. I am providing this information for your records and review.',
  ],
  disaster_relief: [
    'I may be eligible for disaster relief that affects this balance or the applicable deadlines. I request a review of my account for applicable relief.',
    'Due to a federally declared disaster, I believe relief provisions may apply to my situation. Please review my account accordingly.',
    'I am requesting consideration for disaster relief that may affect this balance or extend applicable deadlines.',
  ],
  other: [
    'The specific circumstances of my situation are provided below. I request that these be considered in reviewing the balance.',
    'Additional details regarding my request for account review are provided below.',
    'The following information explains the basis for my request for clarification or adjustment.',
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