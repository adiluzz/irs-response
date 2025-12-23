// lib/letters/cp2000DisagreeTemplates.ts

export interface CP2000DisagreeVars {
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
  (v: CP2000DisagreeVars) =>
    `I am responding to the CP2000 notice dated ${v.NOTICE_DATE || 'recently'} regarding my ${v.TAX_YEAR} federal tax return. The notice proposes additional tax of ${v.BALANCE}.`,
  (v: CP2000DisagreeVars) =>
    `This letter is in response to the CP2000 notice I received concerning my ${v.TAX_YEAR} tax return and the proposed changes totaling ${v.BALANCE}.`,
  (v: CP2000DisagreeVars) =>
    `I received the CP2000 notice for tax year ${v.TAX_YEAR} proposing changes resulting in additional tax of ${v.BALANCE}.`,
  (v: CP2000DisagreeVars) =>
    `Thank you for the CP2000 notice regarding my ${v.TAX_YEAR} return. I have reviewed the proposed adjustments carefully.`,
  (v: CP2000DisagreeVars) =>
    `I am writing in response to the CP2000 notice for ${v.TAX_YEAR}. The notice proposes additional tax of ${v.BALANCE}.`,
  (v: CP2000DisagreeVars) =>
    `I acknowledge receipt of the CP2000 notice showing proposed changes to my ${v.TAX_YEAR} return.`,
  (v: CP2000DisagreeVars) =>
    `I have reviewed the CP2000 notice for my ${v.TAX_YEAR} federal return indicating proposed additional liability of ${v.BALANCE}.`,
  (v: CP2000DisagreeVars) =>
    `In response to the CP2000 notice for ${v.TAX_YEAR}, I confirm receipt and have completed a thorough review.`,
];

const DISAGREEMENT_STATEMENT = [
  (v: CP2000DisagreeVars) =>
    `After reviewing the proposed changes, I respectfully disagree with the adjustments. Based on my records, I believe my original return for ${v.TAX_YEAR} was accurate as filed.`,
  (v: CP2000DisagreeVars) =>
    `I have reviewed the notice carefully and do not agree with the proposed changes. My records indicate that my ${v.TAX_YEAR} return correctly reported my tax situation.`,
  (v: CP2000DisagreeVars) =>
    `Upon review, I do not agree with the proposed adjustments. The information in my original ${v.TAX_YEAR} return appears to be accurate based on my documentation.`,
  (v: CP2000DisagreeVars) =>
    `I respectfully disagree with the proposed changes outlined in the CP2000 notice. I believe my ${v.TAX_YEAR} return was filed correctly.`,
  (v: CP2000DisagreeVars) =>
    `After comparing the notice with my records, I do not concur with the proposed adjustments. I am requesting that you review my response and supporting documentation.`,
  (v: CP2000DisagreeVars) =>
    `My review indicates that the proposed changes may not be accurate. I disagree with the adjustments and am providing this response with supporting information.`,
  (v: CP2000DisagreeVars) =>
    `I do not agree with the changes proposed in the CP2000 notice. Based on my available records, my ${v.TAX_YEAR} return was correct as originally filed.`,
  (v: CP2000DisagreeVars) =>
    `I am disputing the proposed adjustments. My documentation supports that my original ${v.TAX_YEAR} return accurately reflected my tax situation.`,
  (v: CP2000DisagreeVars) =>
    `The proposed changes do not align with my records. I respectfully disagree with the adjustments and request a review of my response.`,
  (v: CP2000DisagreeVars) =>
    `I have reviewed the proposed adjustments and find them to be inconsistent with my records. I do not agree with the changes proposed.`,
  (v: CP2000DisagreeVars) =>
    `Based on my review, I believe the proposed adjustments are not accurate. I am disagreeing with the CP2000 notice and providing supporting information.`,
  (v: CP2000DisagreeVars) =>
    `I respectfully contest the proposed changes. My records support that my ${v.TAX_YEAR} return was filed accurately.`,
];

const DOCUMENTATION_STATEMENT = [
  `I am enclosing documentation to support my position. Please review the attached materials as part of your assessment.`,
  `Supporting documentation is included with this response. I request that these records be considered in your review.`,
  `I have attached records that support my original return. Please review this documentation.`,
  `Documentation supporting my position is enclosed for your consideration.`,
  `I am providing supporting materials for your review regarding the proposed adjustments.`,
  `Attached are documents that support my original return figures. Please consider these in your determination.`,
  `I have included relevant documentation to support my disagreement. Kindly review and advise.`,
  `Supporting records are enclosed with this correspondence for your review.`,
];

const NEXT_STEPS = [
  `Please review this response and the enclosed documentation. I request written notification of your determination.`,
  `I respectfully request that you review the enclosed materials and advise me of the outcome.`,
  `Kindly confirm receipt of this response and inform me of any additional information required.`,
  `Please acknowledge this response and provide guidance on the next steps.`,
  `I request confirmation of receipt and notification once this matter has been reviewed.`,
  `Please advise on the status of my account once this response has been processed.`,
  `I would appreciate written confirmation once your review is complete.`,
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

export function generateCP2000DisagreeLetter(
  vars: CP2000DisagreeVars,
  expandedExplanation?: string
): string {
  const seed = hashCode(`${vars.TAX_YEAR}-${vars.BALANCE}-${vars.TODAY_DATE}`);

  const opening = pick(OPENINGS, seed);
  const acknowledgment = pick(ACKNOWLEDGMENTS, seed + 1)(vars);
  const disagreementStatement = pick(DISAGREEMENT_STATEMENT, seed + 2)(vars);
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

${disagreementStatement}${explanationParagraph}

${documentationStatement}

${nextSteps}${educationalAppendix}`;
}