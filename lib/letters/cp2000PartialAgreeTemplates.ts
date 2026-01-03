// lib/letters/cp2000PartialAgreeTemplates.ts

export interface CP2000PartialAgreeVars {
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
  `Attn: CP2000 Unit,`,
  `Dear IRS Underreporter Unit:`,
  `To the Internal Revenue Service:`,
  `Dear IRS Notice Review:`,
  `Attn: Automated Underreporter,`,
];

const ACKNOWLEDGMENTS = [
  (v: CP2000PartialAgreeVars) =>
    `I am responding to the CP2000 notice dated ${v.NOTICE_DATE || 'recently'} regarding my ${v.TAX_YEAR} federal tax return. The notice proposes additional tax of ${v.BALANCE}.`,
  (v: CP2000PartialAgreeVars) =>
    `This letter is in response to the CP2000 notice I received concerning my ${v.TAX_YEAR} tax return and the proposed changes totaling ${v.BALANCE}.`,
  (v: CP2000PartialAgreeVars) =>
    `I received the CP2000 notice for tax year ${v.TAX_YEAR} proposing changes resulting in additional tax of ${v.BALANCE}.`,
  (v: CP2000PartialAgreeVars) =>
    `Thank you for the CP2000 notice regarding my ${v.TAX_YEAR} return. I have reviewed the proposed adjustments.`,
  (v: CP2000PartialAgreeVars) =>
    `I am writing in response to the CP2000 notice for ${v.TAX_YEAR}. The notice proposes additional tax of ${v.BALANCE}.`,
  (v: CP2000PartialAgreeVars) =>
    `I acknowledge receipt of the CP2000 notice showing proposed changes to my ${v.TAX_YEAR} return.`,
  (v: CP2000PartialAgreeVars) =>
    `I have reviewed the CP2000 notice for my ${v.TAX_YEAR} federal return indicating proposed additional liability of ${v.BALANCE}.`,
  (v: CP2000PartialAgreeVars) =>
    `In response to the CP2000 notice for ${v.TAX_YEAR}, I confirm receipt and have completed my review.`,
];

const PARTIAL_AGREEMENT = [
  (v: CP2000PartialAgreeVars) =>
    `After reviewing the proposed changes, I agree with some of the adjustments but respectfully disagree with others. I am providing this response to clarify the items I accept and those I believe require further review.`,
  (v: CP2000PartialAgreeVars) =>
    `I have reviewed the notice carefully and find that I am in agreement with certain proposed adjustments. However, other items do not appear accurate based on my records.`,
  (v: CP2000PartialAgreeVars) =>
    `Upon review, I accept a portion of the proposed changes but believe other adjustments may not be correct. This response addresses both the items I agree with and those I question.`,
  (v: CP2000PartialAgreeVars) =>
    `My review indicates that some proposed changes are accurate while others may warrant reconsideration. I am partially agreeing with the adjustments as detailed below.`,
  (v: CP2000PartialAgreeVars) =>
    `I concur with certain adjustments in the CP2000 notice but have concerns about the accuracy of other proposed changes.`,
  (v: CP2000PartialAgreeVars) =>
    `After comparing the notice with my records, I agree with some of the proposed adjustments. However, I respectfully request review of the remaining items.`,
  (v: CP2000PartialAgreeVars) =>
    `I am in partial agreement with the proposed changes. Some adjustments appear correct, while others do not align with my available documentation.`,
  (v: CP2000PartialAgreeVars) =>
    `Based on my review, I accept certain proposed adjustments but believe other items require clarification or correction.`,
  (v: CP2000PartialAgreeVars) =>
    `I find some of the proposed changes to be accurate and accept those adjustments. The remaining items, however, appear to require further review.`,
  (v: CP2000PartialAgreeVars) =>
    `I agree in part with the CP2000 notice. Certain adjustments are acknowledged, while others do not appear supported by my records.`,
  (v: CP2000PartialAgreeVars) =>
    `My response reflects partial agreement with the proposed changes. I accept the adjustments that are consistent with my records and question those that are not.`,
  (v: CP2000PartialAgreeVars) =>
    `Having reviewed the proposed changes, I am agreeing with a portion of the adjustments and requesting review of the balance.`,
];

const DOCUMENTATION_STATEMENT = [
  `I am enclosing supporting documentation for the items I believe require adjustment. Please review the attached materials.`,
  `Supporting documentation for the items in question is included with this response. I request these be considered in your review.`,
  `I have attached records relevant to the items I disagree with. Please review this documentation as part of your assessment.`,
  `Documentation supporting my position on the disputed items is enclosed for your consideration.`,
  `I am providing supporting materials for your review regarding the items I believe are not accurate.`,
  `Attached are documents that support my position on the adjustments I question. Please consider these in your review.`,
  `I have included relevant documentation for the items I am disputing. Kindly review and advise.`,
  `Supporting records for the items requiring reconsideration are enclosed with this correspondence.`,
];

const NEXT_STEPS = [
  `Please review this response and the enclosed documentation. I request written notification of your determination.`,
  `I respectfully request that you review the enclosed materials and advise me of the outcome.`,
  `Kindly confirm receipt of this response and inform me of any additional information required.`,
  `Please acknowledge this partial agreement and provide guidance on the next steps for the disputed items.`,
  `I request confirmation of receipt and notification once this matter has been reviewed.`,
  `Please advise on the status of my account once this response has been processed.`,
  `I would appreciate written confirmation of this partial agreement and the resolution of disputed items.`,
  `Please notify me of the results of your review and any further action required on my part.`,
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
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

export function generateCP2000PartialAgreeLetter(
  vars: CP2000PartialAgreeVars,
  expandedExplanation?: string
): string {
  const seed = hashCode(`${vars.TAX_YEAR}-${vars.BALANCE}-${vars.TODAY_DATE}`);

  const opening = pick(OPENINGS, seed);
  const acknowledgment = pick(ACKNOWLEDGMENTS, seed + 1)(vars);
  const partialAgreement = pick(PARTIAL_AGREEMENT, seed + 2)(vars);
  const documentationStatement = pick(DOCUMENTATION_STATEMENT, seed + 3);
  const nextSteps = pick(NEXT_STEPS, seed + 4);

  let explanationParagraph = '';
  if (expandedExplanation && expandedExplanation.trim()) {
    explanationParagraph = `\n\n${expandedExplanation}`;
  }

  let educationalAppendix = '';
  if (vars.includeEducationalReferences) {
    educationalAppendix = `\n\n---\nEducational Reference (Not Legal Advice):\nFor general information on responding to CP2000 notices, taxpayers may review IRS.gov resources. This reference is for informational purposes only and does not constitute tax or legal advice.`;
  }

  return `${opening}

${acknowledgment}

${partialAgreement}${explanationParagraph}

${documentationStatement}

${nextSteps}${educationalAppendix}`;
}