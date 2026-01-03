// lib/letters/balanceDuePayNowTemplates.ts

export interface BalanceDuePayNowVars {
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
  `Attn: Account Services,`,
  `Dear IRS Account Services:`,
  `To the Internal Revenue Service:`,
  `Dear Taxpayer Services:`,
  `Attn: IRS Collections,`,
];

const ACKNOWLEDGMENTS = [
  (v: BalanceDuePayNowVars) =>
    `I am responding to the notice regarding my ${v.TAX_YEAR} federal tax account. The balance indicated is ${v.BALANCE}.`,
  (v: BalanceDuePayNowVars) =>
    `This correspondence is in reference to the balance due notice for tax year ${v.TAX_YEAR}. I have reviewed the notice and acknowledge the amount of ${v.BALANCE}.`,
  (v: BalanceDuePayNowVars) =>
    `I received your notice concerning an outstanding balance of ${v.BALANCE} for the ${v.TAX_YEAR} tax year. I have reviewed the information provided.`,
  (v: BalanceDuePayNowVars) =>
    `Thank you for the notice regarding my ${v.TAX_YEAR} tax account. I understand the balance shown is ${v.BALANCE}.`,
  (v: BalanceDuePayNowVars) =>
    `I am writing concerning the ${v.TAX_YEAR} balance of ${v.BALANCE} as reflected in your recent correspondence.`,
  (v: BalanceDuePayNowVars) =>
    `This letter acknowledges receipt of the notice dated ${v.NOTICE_DATE || 'recently'} showing a balance of ${v.BALANCE} for tax year ${v.TAX_YEAR}.`,
  (v: BalanceDuePayNowVars) =>
    `I have received and reviewed the notice for my ${v.TAX_YEAR} federal tax liability in the amount of ${v.BALANCE}.`,
  (v: BalanceDuePayNowVars) =>
    `In response to the balance due notification for ${v.TAX_YEAR}, I confirm receipt of the notice indicating ${v.BALANCE} owed.`,
];

const PAYMENT_INTENT = [
  (v: BalanceDuePayNowVars) =>
    `I am submitting payment in full for the amount of ${v.BALANCE} to resolve this balance. Please apply this payment to my ${v.TAX_YEAR} tax account.`,
  (v: BalanceDuePayNowVars) =>
    `Enclosed is my payment of ${v.BALANCE} to satisfy the outstanding balance for tax year ${v.TAX_YEAR}. Please credit this amount to my account accordingly.`,
  (v: BalanceDuePayNowVars) =>
    `To resolve this matter, I am remitting payment in the full amount of ${v.BALANCE}. Please apply this payment to my ${v.TAX_YEAR} account.`,
  (v: BalanceDuePayNowVars) =>
    `I am making full payment of ${v.BALANCE} as indicated in the notice. This payment should be applied to my ${v.TAX_YEAR} federal tax balance.`,
  (v: BalanceDuePayNowVars) =>
    `Payment of ${v.BALANCE} is enclosed herewith for the ${v.TAX_YEAR} tax year balance. Please process and apply to my account.`,
  (v: BalanceDuePayNowVars) =>
    `The full balance of ${v.BALANCE} for ${v.TAX_YEAR} accompanies this letter. I request that this amount be credited to resolve the outstanding liability.`,
  (v: BalanceDuePayNowVars) =>
    `I am tendering payment for the entire balance of ${v.BALANCE} for tax year ${v.TAX_YEAR}. Please ensure accurate application to my tax account.`,
  (v: BalanceDuePayNowVars) =>
    `With this correspondence, I am submitting ${v.BALANCE} to pay the ${v.TAX_YEAR} balance in full. Kindly apply this to the account referenced.`,
  (v: BalanceDuePayNowVars) =>
    `Full remittance of ${v.BALANCE} for the ${v.TAX_YEAR} liability is included. Please update my account to reflect this payment.`,
  (v: BalanceDuePayNowVars) =>
    `To address the balance due, I am providing payment of ${v.BALANCE} for ${v.TAX_YEAR}. Please process and confirm receipt.`,
  (v: BalanceDuePayNowVars) =>
    `Attached is payment covering the full ${v.BALANCE} balance for ${v.TAX_YEAR}. I respectfully request this be applied without delay.`,
  (v: BalanceDuePayNowVars) =>
    `I am paying the ${v.TAX_YEAR} balance of ${v.BALANCE} in its entirety. Please apply this payment and update the account status.`,
];

const COMPLIANCE = [
  `I remain committed to meeting all filing and payment obligations going forward.`,
  `I will continue to fulfill my federal tax responsibilities in a timely manner.`,
  `My intent is to remain current on all future tax filings and payments.`,
  `I am committed to maintaining compliance with all applicable filing requirements.`,
  `I will ensure timely compliance with all future federal tax obligations.`,
  `Going forward, I will continue to meet my tax filing and payment duties.`,
  `I understand the importance of continued compliance and will maintain my obligations.`,
  `My future filings and payments will be submitted as required.`,
];

const NEXT_STEPS = [
  `Please confirm receipt of this payment and provide written verification once the account reflects a zero balance.`,
  `I request written confirmation that this payment has been received and applied to my account.`,
  `Kindly send confirmation that my account has been updated and the balance resolved.`,
  `Please provide acknowledgment of this payment and confirmation that no further amount is due.`,
  `I would appreciate confirmation that this matter is resolved upon processing of the payment.`,
  `Please advise in writing once this payment clears and my account status is updated.`,
  `A confirmation letter reflecting the payment and current account status would be appreciated.`,
  `Please notify me if any additional action is required on my part after payment processing.`,
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

export function generateBalanceDuePayNowLetter(vars: BalanceDuePayNowVars): string {
  const seed = hashCode(`${vars.TAX_YEAR}-${vars.BALANCE}-${vars.TODAY_DATE}`);

  const opening = pick(OPENINGS, seed);
  const acknowledgment = pick(ACKNOWLEDGMENTS, seed + 1)(vars);
  const paymentIntent = pick(PAYMENT_INTENT, seed + 2)(vars);
  const compliance = pick(COMPLIANCE, seed + 3);
  const nextSteps = pick(NEXT_STEPS, seed + 4);

  let userNoteParagraph = '';
  if (vars.USER_NOTE && vars.USER_NOTE.trim()) {
    userNoteParagraph = `\n\nAdditional context: ${vars.USER_NOTE.trim()}`;
  }

  let educationalAppendix = '';
  if (vars.includeEducationalReferences) {
    educationalAppendix = `\n\n---\nEducational Reference (Not Legal Advice):\nFor general information on IRS payment procedures, taxpayers may review IRS.gov resources on balance due notices and payment options. This reference is for informational purposes only and does not constitute tax or legal advice.`;
  }

  return `${opening}

${acknowledgment}

${paymentIntent}${userNoteParagraph}

${compliance}

${nextSteps}${educationalAppendix}`;
}