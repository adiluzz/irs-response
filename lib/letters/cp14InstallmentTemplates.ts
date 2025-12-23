// cp14InstallmentTemplates.ts

export type TemplateVars = {
  TAX_YEAR: string;
  BALANCE: string;
  MONTHLY_PAYMENT?: string;
  EXPLANATION?: string;
  TODAY_DATE: string;
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fill(template: string, vars: TemplateVars): string {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    return (vars as any)[key] ?? "";
  });
}

/* =========================
   TEMPLATE VARIANTS
========================= */

const OPENINGS = [
  "Dear Internal Revenue Service,",
  "To Whom It May Concern:",
  "Dear Sir or Madam:",
];

const ACKNOWLEDGMENTS = [
  "I am writing in response to the CP14 notice dated {{TODAY_DATE}} regarding my {{TAX_YEAR}} tax year. I acknowledge the balance of {{BALANCE}} as indicated in the notice.",
  "This letter is in response to the CP14 notice I received concerning my {{TAX_YEAR}} federal tax liability. I have reviewed the notice and understand that the balance shown is {{BALANCE}}.",
  "I am responding to the CP14 notice for tax year {{TAX_YEAR}}. I acknowledge receipt of the notice and the outstanding balance of {{BALANCE}}.",
];

const INSTALLMENT_WITH_AMOUNT = [
  "I am unable to pay the full amount at this time and respectfully request an installment agreement. I am prepared to make monthly payments of {{MONTHLY_PAYMENT}} until the balance is satisfied.",
  "Due to my current financial circumstances, I am requesting a monthly payment arrangement. I propose payments of {{MONTHLY_PAYMENT}} per month toward the outstanding balance.",
  "I would like to establish an installment agreement to resolve this balance. I can commit to monthly payments of {{MONTHLY_PAYMENT}} and am prepared to begin immediately upon approval.",
];

const INSTALLMENT_NO_AMOUNT = [
  "I am unable to pay the full amount at this time and respectfully request an installment agreement. I am prepared to discuss a monthly payment amount that satisfies IRS requirements while accommodating my financial situation.",
  "Due to my current financial circumstances, I am requesting a monthly payment arrangement. Please advise on the appropriate monthly payment amount based on the balance and applicable guidelines.",
  "I would like to establish an installment agreement to resolve this balance. I am open to the standard payment terms as determined by the IRS and am prepared to begin payments upon approval.",
];

const EXPLANATIONS = [
  "{{EXPLANATION}}",
  "I would like to provide the following context regarding my request: {{EXPLANATION}}",
  "For your consideration, the following circumstances are relevant to this request: {{EXPLANATION}}",
];

const COMPLIANCE = [
  "I am committed to complying with all terms of the installment agreement and to remaining current on all future filing and payment obligations.",
  "I understand the terms associated with installment agreements and agree to remain compliant with all future tax filing and payment requirements.",
  "I will adhere to all conditions of the payment arrangement and ensure timely filing and payment of all future tax obligations.",
];

const CLOSINGS = [
  "Please contact me if additional information or documentation is needed to process this request. Thank you for your consideration.",
  "I am available to provide any financial documentation required to finalize this arrangement. Thank you for your attention to this matter.",
  "Should any additional forms or supporting documents be required, please advise at your earliest convenience. I appreciate your assistance.",
];


/* =========================
   MAIN GENERATOR
========================= */

export function generateCP14InstallmentLetter(vars: TemplateVars): string {
  const parts: string[] = [];

  parts.push(pick(OPENINGS));
  parts.push("");
  parts.push(fill(pick(ACKNOWLEDGMENTS), vars));
  parts.push("");

  if (vars.MONTHLY_PAYMENT) {
    parts.push(fill(pick(INSTALLMENT_WITH_AMOUNT), vars));
  } else {
    parts.push(fill(pick(INSTALLMENT_NO_AMOUNT), vars));
  }

  parts.push("");

  if (vars.EXPLANATION) {
    parts.push(fill(pick(EXPLANATIONS), vars));
    parts.push("");
  }

  parts.push(pick(COMPLIANCE));
  parts.push("");
  parts.push(pick(CLOSINGS));

  return parts.join("\n");
}
export {};
