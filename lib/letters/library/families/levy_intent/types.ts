// lib/letters/library/families/levy_intent/types.ts

export enum LevyNoticeType {
  LETTER_1058 = 'LETTER_1058',
  CP90 = 'CP90',
  CP91 = 'CP91',
}

export enum ResponsePosture {
  CDP_HEARING = 'CDP_HEARING',
  EQUIVALENT_HEARING = 'EQUIVALENT_HEARING',
  COLLECTION_ALTERNATIVE = 'COLLECTION_ALTERNATIVE',
  DISPUTE = 'DISPUTE',
}

export enum CollectionAlternativeType {
  IA = 'IA',
  OIC = 'OIC',
  CNC = 'CNC',
}

export enum DisputeBasis {
  PROCEDURAL_DEFECT = 'PROCEDURAL_DEFECT',
  INCORRECT_BALANCE = 'INCORRECT_BALANCE',
  ALREADY_RESOLVED = 'ALREADY_RESOLVED',
}

export interface TaxpayerInfo {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  last4SSN?: string;
}

export interface IrsAddress {
  name: string;
  street: string;
  cityStateZip: string;
}

export interface LevyIntentFamilyInput {
  taxpayerInfo: TaxpayerInfo;
  irsAddress: IrsAddress;
  noticeType: LevyNoticeType;
  noticeDate: string;
  taxPeriods: string[];
  assessedBalance: string;
  responseDeadline?: string;
  cdpDeadline?: string;
  responsePosture: ResponsePosture;
  collectionAlternativeType?: CollectionAlternativeType;
  disputeBasis?: DisputeBasis;
  includeAuthority?: boolean;
}

export interface LevyIntentLetterOutput {
  purpose: string;
  taxpayerInformation: string;
  noticeIdentification: string;
  responsePosture: string;
  requestedActions: string;
  enclosuresChecklist: string;
  closing: string;
  authority?: string;
}
