// lib/letters/cp2000AgreeTemplates.ts

export interface CP2000AgreeVars {
  TODAY_DATE: string;
  TAX_YEAR: string;
  BALANCE: string;
  NOTICE_DATE?: string;
  NOTICE_NUMBER?: string;
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
  (v: CP2000AgreeVars) =>
    `I am responding to the CP2000 notice dated ${v.NOTICE_DATE || 'recently'} regarding my ${v.TAX_YEAR} federal tax return. The proposed additional tax is ${v.BALANCE}.`,
  (v: CP2000AgreeVars) =>
    `This letter is in response to the CP2000 notice I received concerning my ${v.TAX_YEAR} tax return. I have reviewed the proposed changes and the amount of ${v.BALANCE}.`,
  (v: CP2000AgreeVars) =>
    `I received the CP2000 notice for tax year ${v.TAX_YEAR} proposing changes that would result in additional tax of ${v.BALANCE}.`,
  (v: CP2000AgreeVars) =>
    `Thank you for the CP2000 notice regarding my ${v.TAX_YEAR} return. I have reviewed the proposed adjustments totaling ${v.BALANCE}.`,
  (v: CP2000AgreeVars) =>
    `I am writing in response to the CP2000 notice for ${v.TAX_YEAR}. The notice proposes additional tax of ${v.BALANCE}.`,
  (v: CP2000AgreeVars) =>
    `I acknowledge receipt of the CP2000 notice showing proposed changes to my ${v.TAX_YEAR} return with a balance of ${v.BALANCE}.`,
  (v: CP2000AgreeVars) =>
    `I have reviewed the CP2000 notice for my ${v.TAX_YEAR} federal return indicating proposed additional liability of ${v.BALANCE}.`,
  (v: CP2000AgreeVars) =>
    `In response to the CP2000 notice for ${v.TAX_YEAR}, I confirm receipt and have reviewed the proposed amount of ${v.BALANCE}.`,
];

const AGREEMENT_STATEMENT = [
  (v: CP2000AgreeVars) =>
    `After reviewing the proposed changes, I agree with the adjustments. I accept the additional tax liability of ${v.BALANCE} for tax year ${v.TAX_YEAR}.`,
  (v: CP2000AgreeVars) =>
    `I have reviewed the information in the notice and agree with the proposed changes. I accept the revised tax calculation showing ${v.BALANCE} due.`,
  (v: CP2000AgreeVars) =>
    `Upon review, I acknowledge that the proposed adjustments are accurate. I agree with the additional liability of ${v.BALANCE}.`,
  (v: CP2000AgreeVars) =>
    `I accept the proposed changes as outlined in the CP2000 notice. The additional amount of ${v.BALANCE} for ${v.TAX_YEAR} is acknowledged.`,
  (v: CP2000AgreeVars) =>
    `After careful review, I concur with the adjustments proposed. I am accepting the ${v.BALANCE} assessment for tax year ${v.TAX_YEAR}.`,
  (v: CP2000AgreeVars) =>
    `I have compared the notice with my records and agree with the proposed changes. The additional tax of ${v.BALANCE} is accepted.`,
  (v: CP2000AgreeVars) =>
    `The proposed adjustments appear accurate based on my review. I agree to the additional liability of ${v.BALANCE}.`,
  (v: CP2000AgreeVars) =>
    `I am in agreement with the changes proposed in the CP2000 notice and accept the resulting balance of ${v.BALANCE}.`,
  (v: CP2000AgreeVars) =>
    `Having reviewed the proposed changes, I find them to be accurate and agree to the additional tax of ${v.BALANCE}.`,
  (v: CP2000AgreeVars) =>
    `I accept the proposed revisions to my ${v.TAX_YEAR} return. The additional tax amount of ${v.BALANCE} is understood and agreed upon.`,
  (v: CP2000AgreeVars) =>
    `After review, I am confirming my agreement with the proposed adjustments and the resulting ${v.BALANCE} due.`,
  (v: CP2000AgreeVars) =>
    `I acknowledge the accuracy of the proposed changes and agree to the assessed amount of ${v.BALANCE} for ${v.TAX_YEAR}.`,
];

const PAYMENT_INTENT = [
  `I am prepared to address the balance due and request information on payment options available.`,
  `Please advise on the process to remit payment or establish a payment arrangement for this amount.`,
  `I would like to resolve this balance and request guidance on the available payment methods.`,
  `I am ready to pay the amount due and request confirmation of the payment instructions.`,
  `Please provide payment instructions so I may resolve this matter promptly.`,
  `I intend to satisfy this balance and would appreciate payment details.`,
  `Kindly confirm how I should remit payment to address this liability.`,
  `I am prepared to pay the balance and request the appropriate payment procedures.`,
];

const NEXT_STEPS = [
  `Please confirm receipt of my response and advise on any additional steps required to finalize this matter.`,
  `I request written confirmation that this response has been received and processed.`,
  `Kindly notify me once the account has been updated to reflect my agreement.`,
  `Please provide confirmation of this agreement and any forms I need to sign and return.`,
  `I would appreciate acknowledgment of this response and information on the next steps.`,
  `Please advise if any additional documentation is needed and confirm the processing timeline.`,
  `I request notification when this matter is resolved and my account is updated.`,
  `Please send confirmation of receipt and any further instructions.`,
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

export function generateCP2000AgreeLetter(vars: CP2000AgreeVars): string {
  const seed = hashCode(`${vars.TAX_YEAR}-${vars.BALANCE}-${vars.TODAY_DATE}`);

  const opening = pick(OPENINGS, seed);
  const acknowledgment = pick(ACKNOWLEDGMENTS, seed + 1)(vars);
  const agreementStatement = pick(AGREEMENT_STATEMENT, seed + 2)(vars);
  const paymentIntent = pick(PAYMENT_INTENT, seed + 3);
  const nextSteps = pick(NEXT_STEPS, seed + 4);

  let userNoteParagraph = '';
  if (vars.USER_NOTE && vars.USER_NOTE.trim()) {
    userNoteParagraph = `\n\nAdditional context: ${vars.USER_NOTE.trim()}`;
  }

  let educationalAppendix = '';
  if (vars.includeEducationalReferences) {
    educationalAppendix = `\n\n---\nEducational Reference (Not Legal Advice):\nFor general information on CP2000 notices and response procedures, taxpayers may review IRS.gov resources on underreporter inquiries. This reference is for informational purposes only and does not constitute tax or legal advice.`;
  }

  return `${opening}

${acknowledgment}

${agreementStatement}${userNoteParagraph}

${paymentIntent}

${nextSteps}${educationalAppendix}`;
}