// lib/letters/library/families/levy_intent/templates.ts

import {
  LevyNoticeType,
  ResponsePosture,
  CollectionAlternativeType,
  DisputeBasis,
  LevyIntentFamilyInput,
} from './types';

const NOTICE_TYPE_LABELS: Record<LevyNoticeType, string> = {
  [LevyNoticeType.LETTER_1058]: 'Letter 1058 (LT11)',
  [LevyNoticeType.CP90]: 'Notice CP90',
  [LevyNoticeType.CP91]: 'Notice CP91',
};

export function getPurpose(input: LevyIntentFamilyInput): string {
  const label = NOTICE_TYPE_LABELS[input.noticeType];
  return `This letter responds to the ${label} dated ${input.noticeDate}, which constitutes a Final Notice of Intent to Levy and Notice of Your Right to a Hearing.`;
}

export function getTaxpayerInformation(input: LevyIntentFamilyInput): string {
  const { taxpayerInfo } = input;
  const lines: string[] = [
    `Taxpayer: ${taxpayerInfo.fullName}`,
    `Address: ${taxpayerInfo.address}`,
    `${taxpayerInfo.city}, ${taxpayerInfo.state} ${taxpayerInfo.zipCode}`,
  ];
  if (taxpayerInfo.last4SSN) {
    lines.push(`SSN (last 4): xxx-xx-${taxpayerInfo.last4SSN}`);
  }
  return lines.join('\n');
}

export function getNoticeIdentification(input: LevyIntentFamilyInput): string {
  const label = NOTICE_TYPE_LABELS[input.noticeType];
  const periods = input.taxPeriods.join(', ');
  const lines: string[] = [
    `Notice Type: ${label}`,
    `Notice Date: ${input.noticeDate}`,
    `Tax Period(s): ${periods}`,
    `Assessed Balance: ${input.assessedBalance}`,
  ];
  return lines.join('\n');
}

export function getResponsePosture(input: LevyIntentFamilyInput): string {
  switch (input.responsePosture) {
    case ResponsePosture.CDP_HEARING:
      return getCdpHearingPosture(input);
    case ResponsePosture.EQUIVALENT_HEARING:
      return getEquivalentHearingPosture(input);
    case ResponsePosture.COLLECTION_ALTERNATIVE:
      return getCollectionAlternativePosture(input);
    case ResponsePosture.DISPUTE:
      return getDisputePosture(input);
    default:
      return '';
  }
}

function getCdpHearingPosture(input: LevyIntentFamilyInput): string {
  const lines: string[] = [
    'The taxpayer hereby requests a Collection Due Process (CDP) hearing pursuant to IRC § 6330.',
    'A completed Form 12153, Request for a Collection Due Process or Equivalent Hearing, is enclosed.',
  ];
  if (input.cdpDeadline) {
    lines.push(`The statutory 30-day deadline for requesting a CDP hearing is ${input.cdpDeadline}.`);
  }
  return lines.join('\n');
}

function getEquivalentHearingPosture(input: LevyIntentFamilyInput): string {
  const lines: string[] = [
    'The taxpayer requests an equivalent hearing pursuant to IRC § 6330.',
    'The statutory 30-day window for a CDP hearing has passed. This request is timely filed within one year of the notice date.',
    'A completed Form 12153, Request for a Collection Due Process or Equivalent Hearing, is enclosed.',
  ];
  return lines.join('\n');
}

function getCollectionAlternativePosture(input: LevyIntentFamilyInput): string {
  const lines: string[] = [
    'The taxpayer proposes a collection alternative to resolve the outstanding liability.',
  ];

  switch (input.collectionAlternativeType) {
    case CollectionAlternativeType.IA:
      lines.push('The taxpayer requests an Installment Agreement under IRC § 6159.');
      lines.push('A completed Form 9465, Installment Agreement Request, is enclosed if applicable.');
      break;
    case CollectionAlternativeType.OIC:
      lines.push('The taxpayer requests consideration of an Offer in Compromise under IRC § 7122.');
      lines.push('A completed Form 656, Offer in Compromise, is enclosed if applicable.');
      break;
    case CollectionAlternativeType.CNC:
      lines.push('The taxpayer requests Currently Not Collectible (CNC) status based on financial hardship.');
      lines.push('A completed Form 433-F or Form 433-A, Collection Information Statement, is enclosed if applicable.');
      break;
  }

  return lines.join('\n');
}

function getDisputePosture(input: LevyIntentFamilyInput): string {
  const lines: string[] = [
    'The taxpayer disputes the proposed levy action on the following basis:',
  ];

  switch (input.disputeBasis) {
    case DisputeBasis.PROCEDURAL_DEFECT:
      lines.push('Procedural Defect: The IRS failed to follow required procedures in issuing this notice.');
      break;
    case DisputeBasis.INCORRECT_BALANCE:
      lines.push('Incorrect Balance: The assessed balance reflected in the notice is inaccurate.');
      break;
    case DisputeBasis.ALREADY_RESOLVED:
      lines.push('Already Resolved: The underlying liability has been satisfied or otherwise resolved.');
      break;
  }

  lines.push('Supporting documentation is enclosed.');

  return lines.join('\n');
}

export function getRequestedActions(input: LevyIntentFamilyInput): string {
  const lines: string[] = [];

  switch (input.responsePosture) {
    case ResponsePosture.CDP_HEARING:
      lines.push('Schedule a CDP hearing with the IRS Office of Appeals.');
      lines.push('Suspend all levy and seizure actions pending the hearing.');
      break;
    case ResponsePosture.EQUIVALENT_HEARING:
      lines.push('Schedule an equivalent hearing with the IRS Office of Appeals.');
      break;
    case ResponsePosture.COLLECTION_ALTERNATIVE:
      lines.push('Review and process the enclosed collection alternative request.');
      lines.push('Suspend enforced collection actions while the request is under consideration.');
      break;
    case ResponsePosture.DISPUTE:
      lines.push('Review the enclosed documentation and correct the taxpayer\'s account as warranted.');
      lines.push('Suspend levy actions pending resolution of this dispute.');
      break;
  }

  lines.push('Provide written confirmation of receipt and next steps.');

  return lines.join('\n');
}

export function getEnclosuresChecklist(input: LevyIntentFamilyInput): string[] {
  const enclosures: string[] = [
    'Copy of the notice',
    'Prior IRS correspondence',
  ];

  switch (input.responsePosture) {
    case ResponsePosture.CDP_HEARING:
      enclosures.push('Form 12153, Request for a Collection Due Process or Equivalent Hearing');
      break;
    case ResponsePosture.EQUIVALENT_HEARING:
      enclosures.push('Form 12153, Request for a Collection Due Process or Equivalent Hearing (equivalent hearing)');
      break;
    case ResponsePosture.COLLECTION_ALTERNATIVE:
      switch (input.collectionAlternativeType) {
        case CollectionAlternativeType.IA:
          enclosures.push('Form 9465, Installment Agreement Request (if applicable)');
          break;
        case CollectionAlternativeType.OIC:
          enclosures.push('Form 656, Offer in Compromise (if applicable)');
          break;
        case CollectionAlternativeType.CNC:
          enclosures.push('Form 433-F or Form 433-A, Collection Information Statement (if applicable)');
          break;
      }
      break;
    case ResponsePosture.DISPUTE:
      enclosures.push('Supporting documentation');
      break;
  }

  return enclosures;
}

export function getEnclosuresChecklistFormatted(input: LevyIntentFamilyInput): string {
  const enclosures = getEnclosuresChecklist(input);
  return enclosures.map((item) => `• ${item}`).join('\n');
}

export function getClosing(input: LevyIntentFamilyInput): string {
  return `Please direct all correspondence regarding this matter to the address below. The taxpayer reserves all rights under applicable law.`;
}

export function getAuthority(): string {
  return [
    'IRC § 6330 – Notice and opportunity for hearing before levy',
    'IRC § 6331 – Levy and distraint',
    'IRC § 6159 – Agreements for payment of tax liability in installments',
    'IRC § 7122 – Compromises',
    'Treas. Reg. § 301.6330-1 – Notice and opportunity for hearing prior to levy',
  ].join('\n');
}
