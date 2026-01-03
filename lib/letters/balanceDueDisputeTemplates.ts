export interface BalanceDueDisputeVars {
  TODAY_DATE: string;
  TAX_YEAR: string;
  BALANCE: string;
  NOTICE_DATE?: string;
  NOTICE_NUMBER?: string;
  REASON_ID?: string;
  USER_NOTE?: string;
  includeEducationalReferences?: boolean;
}

const OPENINGS = [
  `Dear Internal Revenue Service,`,
  `To Whom It May Concern:`,
  `Dear Sir or Madam:`,
  `Attn: Account Services,`,
  `Dear IRS Account Services:`,
  `To the Internal Revenue Service:`,
  `Dear Taxpayer Services:`,
  `Attn: IRS Account Review,`,
];

const ACKNOWLEDGMENTS = [
  (v: BalanceDueDisputeVars) =>
    `I am writing in response to the notice regarding my ${v.TAX_YEAR} federal tax account, which indicates a balance of ${v.BALANCE}.`,
  (v: BalanceDueDisputeVars) =>
    `This correspondence is in reference to the balance due notice for tax year ${v.TAX_YEAR}. The notice reflects an amount of ${v.BALANCE}.`,
  (v: BalanceDueDisputeVars) =>
    `I received your notice concerning an indicated balance of ${v.BALANCE} for the ${v.TAX_YEAR} tax year.`,
  (v: BalanceDueDisputeVars) =>
    `I am responding to the notice regarding my ${v.TAX_YEAR} account, which shows ${v.BALANCE} as the amount due.`,
];

const DISPUTE_REQUEST = [
  () =>
    `After reviewing my records, I respectfully request a review of this balance. I believe there may be a discrepancy that warrants clarification.`,
  (v: BalanceDueDisputeVars) =>
    `I am requesting reconsideration of the balance shown. Based on my available records, I believe the amount may not accurately reflect my tax liability for ${v.TAX_YEAR}.`,
  () =>
    `I would like to request an account review. The balance indicated does not appear to align with my records, and I am seeking clarification.`,
  () =>
    `Based on my review of available documentation, I believe the balance may require adjustment. I am requesting a formal account review.`,
];

const COOPERATION = [
  `I am prepared to provide any documentation or information that may assist in resolving this matter.`,
  `I am willing to supply supporting documentation upon request to facilitate the review process.`,
  `Please let me know what records or documentation would be helpful, and I will provide them promptly.`,
];

const NEXT_STEPS = [
  `Please advise on the process for reviewing this account and any forms or steps I should complete.`,
  `I request written confirmation of receipt of this inquiry and information on the expected review timeline.`,
  `Kindly inform me of the next steps and any documentation required to proceed with this review.`,
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateBalanceDueDisputeLetter(
  vars: BalanceDueDisputeVars,
  expandedExplanation?: string
): string {
  const seed = hashCode(`${vars.TAX_YEAR}-${vars.BALANCE}-${vars.TODAY_DATE}`);

  const opening = pick(OPENINGS, seed);
  const acknowledgment = pick(ACKNOWLEDGMENTS, seed + 1)(vars);
  const disputeRequest = pick(DISPUTE_REQUEST, seed + 2)(vars);
  const cooperation = pick(COOPERATION, seed + 3);
  const nextSteps = pick(NEXT_STEPS, seed + 4);

  let explanationParagraph = '';
  if (expandedExplanation && expandedExplanation.trim()) {
    explanationParagraph = `\n\n${expandedExplanation}`;
  } else if (vars.USER_NOTE && vars.USER_NOTE.trim()) {
    explanationParagraph =
      `\n\nExplanation (summary): ${vars.USER_NOTE.trim()}\n\n` +
      `If additional documentation is required to support this explanation, please advise and I will provide it promptly.`;
  }

  return `${opening}

${acknowledgment}

${disputeRequest}${explanationParagraph}

${cooperation}

${nextSteps}`;
}
