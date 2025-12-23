export interface ParsedAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface MoneyParseResult {
  valid: boolean;
  value: number | null;
  error?: string;
}

// ─────────────────────────────────────────
// SSN / ITIN
// ─────────────────────────────────────────

export function normalizeSSN(value: string): string {
  return value.replace(/\D/g, '').slice(0, 9);
}

export function isValidSSNorITIN(value: string): boolean {
  const digits = normalizeSSN(value);
  return digits.length === 9;
}

export function formatSSNDisplay(value: string): string {
  const digits = normalizeSSN(value);
  if (digits.length !== 9) return value;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

export function maskSSN(value: string): string {
  const digits = normalizeSSN(value);
  if (digits.length !== 9) return 'XXX-XX-XXXX';
  return `XXX-XX-${digits.slice(5)}`;
}

export function validateSSN(value: string): ValidationResult {
  const digits = normalizeSSN(value);
  if (digits.length === 0) {
    return { valid: false, error: 'SSN is required' };
  }
  if (digits.length !== 9) {
    return { valid: false, error: 'SSN must be 9 digits' };
  }
  return { valid: true };
}

// ─────────────────────────────────────────
// Phone
// ─────────────────────────────────────────

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, 10);
}

export function isValidPhoneUS(value: string): boolean {
  const digits = normalizePhone(value);
  return digits.length === 10;
}

export function formatPhoneDisplay(value: string): string {
  const digits = normalizePhone(value);
  if (digits.length !== 10) return value;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function validatePhone(value: string, required: boolean = false): ValidationResult {
  const digits = normalizePhone(value);
  if (digits.length === 0) {
    if (required) {
      return { valid: false, error: 'Phone number is required' };
    }
    return { valid: true };
  }
  if (digits.length !== 10) {
    return { valid: false, error: 'Phone must be 10 digits' };
  }
  return { valid: true };
}

// ─────────────────────────────────────────
// Money
// ─────────────────────────────────────────

export function parseMoney(value: string): number | null {
  if (!value || value.trim() === '') return null;
  const cleaned = value.replace(/[$,\s]/g, '');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed) || !isFinite(parsed)) return null;
  return parsed;
}

export function isValidMoney(value: string): boolean {
  const parsed = parseMoney(value);
  return parsed !== null && parsed >= 0;
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function validateMoney(value: string, fieldName: string = 'Amount'): MoneyParseResult {
  if (!value || value.trim() === '') {
    return { valid: false, value: null, error: `${fieldName} is required` };
  }
  const parsed = parseMoney(value);
  if (parsed === null) {
    return { valid: false, value: null, error: `${fieldName} must be a valid number` };
  }
  if (parsed < 0) {
    return { valid: false, value: null, error: `${fieldName} cannot be negative` };
  }
  return { valid: true, value: parsed };
}

// ─────────────────────────────────────────
// Mailing Address
// ─────────────────────────────────────────

const STATE_ABBREVS = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC', 'PR', 'VI', 'GU', 'AS', 'MP',
];

const ZIP_REGEX = /^\d{5}(-\d{4})?$/;
const CITY_STATE_ZIP_REGEX = /^(.+),\s*([A-Z]{2})\s+(\d{5}(-\d{4})?)$/i;

export function parseMailingAddress(text: string): ParsedAddress | null {
  if (!text || text.trim() === '') return null;

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) return null;

  const lastLine = lines[lines.length - 1];
  const match = lastLine.match(CITY_STATE_ZIP_REGEX);

  if (!match) return null;

  const city = match[1].trim();
  const state = match[2].toUpperCase();
  const zip = match[3];

  if (!STATE_ABBREVS.includes(state)) return null;
  if (!ZIP_REGEX.test(zip)) return null;

  const streetLines = lines.slice(0, -1);
  const street = streetLines.join('\n');

  if (street.length === 0) return null;

  return { street, city, state, zip };
}

export function isValidMailingAddress(text: string): boolean {
  return parseMailingAddress(text) !== null;
}

export function validateMailingAddress(text: string): ValidationResult {
  if (!text || text.trim() === '') {
    return { valid: false, error: 'Mailing address is required' };
  }

  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    return {
      valid: false,
      error: 'Address must include street and city/state/ZIP on separate lines',
    };
  }

  const lastLine = lines[lines.length - 1];
  const match = lastLine.match(CITY_STATE_ZIP_REGEX);

  if (!match) {
    return {
      valid: false,
      error: 'Last line must be: City, ST ZIP (e.g., New York, NY 10001)',
    };
  }

  const state = match[2].toUpperCase();
  const zip = match[3];

  if (!STATE_ABBREVS.includes(state)) {
    return { valid: false, error: `Invalid state abbreviation: ${state}` };
  }

  if (!ZIP_REGEX.test(zip)) {
    return { valid: false, error: 'ZIP must be 5 digits or ZIP+4 format' };
  }

  return { valid: true };
}

// ─────────────────────────────────────────
// Date
// ─────────────────────────────────────────

export function isValidDate(value: string): boolean {
  if (!value || value.trim() === '') return false;
  const timestamp = Date.parse(value);
  return !isNaN(timestamp);
}

export function validateDate(value: string, fieldName: string = 'Date'): ValidationResult {
  if (!value || value.trim() === '') {
    return { valid: false, error: `${fieldName} is required` };
  }
  if (!isValidDate(value)) {
    return { valid: false, error: `${fieldName} is not a valid date` };
  }
  return { valid: true };
}

export function formatDate(dateString: string): string {
  if (!dateString || dateString.trim() === '') return '';
  const timestamp = Date.parse(dateString);
  if (isNaN(timestamp)) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// ─────────────────────────────────────────
// Aggregate Validation
// ─────────────────────────────────────────

export interface FieldValidation {
  field: string;
  value: string;
  type: 'ssn' | 'phone' | 'money' | 'address' | 'date' | 'required';
  required?: boolean;
  label?: string;
}

export interface AggregateValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateFields(fields: FieldValidation[]): AggregateValidationResult {
  const errors: string[] = [];

  for (const field of fields) {
    const label = field.label || field.field;

    switch (field.type) {
      case 'ssn': {
        const result = validateSSN(field.value);
        if (!result.valid && result.error) errors.push(result.error);
        break;
      }
      case 'phone': {
        const result = validatePhone(field.value, field.required);
        if (!result.valid && result.error) errors.push(result.error);
        break;
      }
      case 'money': {
        const result = validateMoney(field.value, label);
        if (!result.valid && result.error) errors.push(result.error);
        break;
      }
      case 'address': {
        const result = validateMailingAddress(field.value);
        if (!result.valid && result.error) errors.push(result.error);
        break;
      }
      case 'date': {
        const result = validateDate(field.value, label);
        if (!result.valid && result.error) errors.push(result.error);
        break;
      }
      case 'required': {
        if (!field.value || field.value.trim() === '') {
          errors.push(`${label} is required`);
        }
        break;
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}