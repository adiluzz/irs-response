// lib/letters/balanceDueInstallmentTemplates.ts

export interface BalanceDueInstallmentVars {
  TODAY_DATE: string;
  TAX_YEAR: string;
  BALANCE: string;
  MONTHLY_PAYMENT?: string;
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
  `Attn: IRS Installment Agreement Unit,`,
];

const ACKNOWLEDGMENTS = [
  (v: BalanceDueInstallmentVars) =>
    `I am responding to the notice regarding my ${v.TAX_YEAR} federal tax account. The balance indicated is ${v.BALANCE}.`,
  (v: BalanceDueInstallmentVars) =>
    `This correspondence is in reference to the balance due notice for tax year ${v.TAX_YEAR}. I have reviewed the notice and acknowledge the amount of ${v.BALANCE}.`,
  (v: BalanceDueInstallmentVars) =>
    `I received your notice concerning an outstanding balance of ${v.BALANCE} for the ${v.TAX_YEAR} tax year.`,
  (v: BalanceDueInstallmentVars) =>
    `Thank you for the notice regarding my ${v.TAX_YEAR} tax account. I understand the balance shown is ${v.BALANCE}.`,
  (v: BalanceDueInstallmentVars) =>
    `I am writing concerning the ${v.TAX_YEAR} balance of ${v.BALANCE} as reflected in your recent correspondence.`,
  (v: BalanceDueInstallmentVars) =>
    `This letter acknowledges receipt of the notice showing a balance of ${v.BALANCE} for tax year ${v.TAX_YEAR}.`,
  (v: BalanceDueInstallmentVars) =>
    `I have received and reviewed the notice for my ${v.TAX_YEAR} federal tax liability in the amount of ${v.BALANCE}.`,
  (v: BalanceDueInstallmentVars) =>
    `In response to the balance due notification for ${v.TAX_YEAR}, I confirm receipt of the notice indicating ${v.BALANCE} owed.`,
  (v: BalanceDueInstallmentVars) =>
    `I acknowledge your correspondence concerning my ${v.TAX_YEAR} account balance of ${v.BALANCE}.`,
];

const INSTALLMENT_REQUEST_WITH_AMOUNT = [
  (v: BalanceDueInstallmentVars) =>
    `I am unable to remit the full amount at this time and respectfully request consideration for an installment agreement. I propose monthly payments of ${v.MONTHLY_PAYMENT} until the balance is satisfied.`,
  (v: BalanceDueInstallmentVars) =>
    `Due to current financial circumstances, I am requesting a monthly payment arrangement. I am prepared to make payments of ${v.MONTHLY_PAYMENT} each month toward resolving this balance.`,
  (v: BalanceDueInstallmentVars) =>
    `I would like to establish an installment agreement to address this balance. I can commit to monthly payments of ${v.MONTHLY_PAYMENT} and am prepared to begin upon approval.`,
  (v: BalanceDueInstallmentVars) =>
    `Full payment is not feasible at this time. I respectfully request a payment plan with monthly installments of ${v.MONTHLY_PAYMENT} to resolve the ${v.BALANCE} balance.`,
  (v: BalanceDueInstallmentVars) =>
    `I am seeking approval for an installment arrangement. My proposed monthly payment amount is ${v.MONTHLY_PAYMENT}, which I can maintain consistently.`,
  (v: BalanceDueInstallmentVars) =>
    `Given my present financial situation, I request the opportunity to pay this balance through monthly installments of ${v.MONTHLY_PAYMENT}.`,
  (v: BalanceDueInstallmentVars) =>
    `I am requesting to resolve this liability through scheduled payments. I propose ${v.MONTHLY_PAYMENT} monthly until the account is paid in full.`,
  (v: BalanceDueInstallmentVars) =>
    `An installment agreement would allow me to satisfy this obligation responsibly. I am offering monthly payments of ${v.MONTHLY_PAYMENT}.`,
  (v: BalanceDueInstallmentVars) =>
    `To address this balance while managing my financial obligations, I request a payment plan at ${v.MONTHLY_PAYMENT} per month.`,
  (v: BalanceDueInstallmentVars) =>
    `I respectfully ask to establish a structured payment arrangement. Monthly payments of ${v.MONTHLY_PAYMENT} would be sustainable for my circumstances.`,
  (v: BalanceDueInstallmentVars) =>
    `Payment in full is not currently possible. I request consideration for an installment plan with ${v.MONTHLY_PAYMENT} monthly payments.`,
  (v: BalanceDueInstallmentVars) =>
    `I would appreciate the opportunity to pay this balance over time. My proposed payment is ${v.MONTHLY_PAYMENT} each month.`,
];

const INSTALLMENT_REQUEST_NO_AMOUNT = [
  (v: BalanceDueInstallmentVars) =>
    `I am unable to remit the full amount at this time and respectfully request consideration for an installment agreement. I am prepared to discuss a monthly payment amount that satisfies applicable requirements.`,
  (v: BalanceDueInstallmentVars) =>
    `Due to current financial circumstances, I am requesting a monthly payment arrangement. Please advise on the appropriate monthly payment based on the balance and standard guidelines.`,
  (v: BalanceDueInstallmentVars) =>
    `I would like to establish an installment agreement to address this balance. I am open to the standard payment terms and am prepared to begin upon approval.`,
  (v: BalanceDueInstallmentVars) =>
    `Full payment is not feasible at this time. I respectfully request a payment plan and am willing to provide financial information as needed to determine appropriate terms.`,
  (v: BalanceDueInstallmentVars) =>
    `I am seeking approval for an installment arrangement. Please inform me of the required monthly payment amount and any forms needed.`,
  (v: BalanceDueInstallmentVars) =>
    `Given my present financial situation, I request the opportunity to pay this balance through monthly installments at a rate to be determined.`,
  (v: BalanceDueInstallmentVars) =>
    `I am requesting to resolve this liability through scheduled payments. I am flexible regarding the monthly amount and will comply with standard requirements.`,
  (v: BalanceDueInstallmentVars) =>
    `An installment agreement would allow me to satisfy this obligation responsibly. Please provide guidance on the next steps and payment amount.`,
  (v: BalanceDueInstallmentVars) =>
    `To address this balance while managing my financial obligations, I request a payment plan. I await your determination of the appropriate payment schedule.`,
  (v: BalanceDueInstallmentVars) =>
    `I respectfully ask to establish a structured payment arrangement. Please advise on the monthly payment and any required documentation.`,
  (v: BalanceDueInstallmentVars) =>
    `Payment in full is not currently possible. I request consideration for an installment plan at a monthly rate that meets applicable standards.`,
  (v: BalanceDueInstallmentVars) =>
    `I would appreciate the opportunity to pay this balance over time through a formal installment agreement.`,
];

const COMPLIANCE = [
  `I am committed to complying with all terms of the installment agreement and to remaining current on all future filing and payment obligations.`,
  `I understand the terms associated with installment agreements and agree to remain compliant with all future tax requirements.`,
  `I will adhere to all conditions of the payment arrangement and ensure timely filing and payment going forward.`,
  `I intend to maintain full compliance with the agreement terms and all future federal tax obligations.`,
  `I am prepared to meet all installment agreement conditions and remain current on subsequent filings.`,
  `Compliance with the agreement and all future tax responsibilities is my commitment.`,
  `I will fulfill the payment schedule and maintain timely compliance with all future obligations.`,
  `I accept the responsibilities of an installment agreement and will remain current on future taxes.`,
];

const NEXT_STEPS = [
  `Please advise on the next steps to formally establish this arrangement, including any forms or financial documentation required.`,
  `I am available to provide any financial documentation if required to process this request. Please indicate what is needed.`,
  `Should any additional forms or supporting documents be required, please advise at your earliest convenience.`,
  `Please inform me of any documentation needed and the expected timeline for processing this request.`,
  `I request guidance on completing this arrangement, including any necessary forms or additional information.`,
  `Kindly provide instructions for finalizing this installment agreement and any required supporting materials.`,
  `Please let me know what forms or documents are needed to move forward with this payment arrangement.`,
  `I await your response regarding the required steps and documentation to establish this agreement.`,
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

export function generateBalanceDueInstallmentLetter(vars: BalanceDueInstallmentVars): string {
  const seed = hashCode(`${vars.TAX_YEAR}-${vars.BALANCE}-${vars.TODAY_DATE}`);

  const opening = pick(OPENINGS, seed);
  const acknowledgment = pick(ACKNOWLEDGMENTS, seed + 1)(vars);

  let installmentRequest: string;
  if (vars.MONTHLY_PAYMENT && vars.MONTHLY_PAYMENT.trim()) {
    installmentRequest = pick(INSTALLMENT_REQUEST_WITH_AMOUNT, seed + 2)(vars);
  } else {
    installmentRequest = pick(INSTALLMENT_REQUEST_NO_AMOUNT, seed + 2)(vars);
  }

  const compliance = pick(COMPLIANCE, seed + 3);
  const nextSteps = pick(NEXT_STEPS, seed + 4);

  let userNoteParagraph = '';
  if (vars.USER_NOTE && vars.USER_NOTE.trim()) {
    userNoteParagraph = `\n\nAdditional context regarding this request: ${vars.USER_NOTE.trim()}`;
  }

  let educationalAppendix = '';
  if (vars.includeEducationalReferences) {
    educationalAppendix = `\n\n---\nEducational Reference (Not Legal Advice):\nFor general information on IRS installment agreements and payment options, taxpayers may review IRS.gov resources. This reference is for informational purposes only and does not constitute tax or legal advice.`;
  }

  return `${opening}

${acknowledgment}

${installmentRequest}${userNoteParagraph}

${compliance}

${nextSteps}${educationalAppendix}`;
}