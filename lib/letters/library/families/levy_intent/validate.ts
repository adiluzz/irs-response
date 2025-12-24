// lib/letters/library/families/levy_intent/validate.ts

import { LevyIntentFamilyInput, ResponsePosture } from './types'

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function validateLevyIntentInput(
  input: LevyIntentFamilyInput
): ValidationResult {
  const errors: string[] = []

  if (!input.taxpayerInfo) {
    errors.push('taxpayerInfo is required')
  } else {
    if (!input.taxpayerInfo.fullName) {
      errors.push('taxpayerInfo.fullName is required')
    }
    if (!input.taxpayerInfo.address) {
      errors.push('taxpayerInfo.address is required')
    }
    if (!input.taxpayerInfo.city) {
      errors.push('taxpayerInfo.city is required')
    }
    if (!input.taxpayerInfo.state) {
      errors.push('taxpayerInfo.state is required')
    }
    if (!input.taxpayerInfo.zipCode) {
      errors.push('taxpayerInfo.zipCode is required')
    }
  }

  if (!input.irsAddress) {
    errors.push('irsAddress is required')
  } else {
    if (!input.irsAddress.name) {
      errors.push('irsAddress.name is required')
    }
    if (!input.irsAddress.street) {
      errors.push('irsAddress.street is required')
    }
    if (!input.irsAddress.cityStateZip) {
      errors.push('irsAddress.cityStateZip is required')
    }
  }

  if (!input.noticeType) {
    errors.push('noticeType is required')
  }

  if (!input.noticeDate) {
    errors.push('noticeDate is required')
  }

  if (!input.taxPeriods || input.taxPeriods.length === 0) {
    errors.push('taxPeriods must contain at least one period')
  }

  if (!input.assessedBalance) {
    errors.push('assessedBalance is required')
  }

  if (!input.responsePosture) {
    errors.push('responsePosture is required')
  }

  if (
    input.responsePosture === ResponsePosture.COLLECTION_ALTERNATIVE &&
    !input.collectionAlternativeType
  ) {
    errors.push(
      'collectionAlternativeType is required when responsePosture is COLLECTION_ALTERNATIVE'
    )
  }

  if (input.responsePosture === ResponsePosture.DISPUTE && !input.disputeBasis) {
    errors.push('disputeBasis is required when responsePosture is DISPUTE')
  }

  if (
    input.collectionAlternativeType &&
    input.responsePosture !== ResponsePosture.COLLECTION_ALTERNATIVE
  ) {
    errors.push(
      'collectionAlternativeType should only be set when responsePosture is COLLECTION_ALTERNATIVE'
    )
  }

  if (input.disputeBasis && input.responsePosture !== ResponsePosture.DISPUTE) {
    errors.push('disputeBasis should only be set when responsePosture is DISPUTE')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
