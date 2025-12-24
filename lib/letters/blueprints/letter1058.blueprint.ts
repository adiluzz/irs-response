/**
 * Letter 1058 Blueprint – Final Notice of Intent to Levy
 */

import type { Blueprint, LetterContext } from './types'
import { stableSeed } from '../variation'
import { globalSections, globalClosing } from '../library/global'

import { LevyNoticeType } from '../library/families/levy_intent/types'
import { composeLevyIntentLetter } from '../library/families/levy_intent/compose'

type Section = { heading?: string; body?: string }

function normalizeHeading(h: string) {
  return (h || '').trim().toLowerCase()
}

function isAuthorityOrReferencesHeading(h: string) {
  const x = normalizeHeading(h)
  return x.includes('authority') || x.includes('references')
}

function enforceAuthorityLastOnce(
  sections: Section[],
  includeReferences: boolean
): Section[] {
  if (!Array.isArray(sections)) return []

  const nonRef: Section[] = []
  const ref: Section[] = []

  for (const s of sections) {
    if (!s) continue
    if (
      typeof s.heading === 'string' &&
      isAuthorityOrReferencesHeading(s.heading)
    ) {
      ref.push(s)
    } else {
      nonRef.push(s)
    }
  }

  if (!includeReferences || ref.length === 0) return nonRef

  const mergedBody = ref
    .map((s) => (s.body || '').trim())
    .filter(Boolean)
    .join('\n\n')

  return [
    ...nonRef,
    {
      heading: (ref[ref.length - 1]?.heading || 'Applicable Authority').trim(),
      body: mergedBody,
    },
  ]
}

function parseCityStateZip(line: string) {
  const cleaned = (line || '').trim().replace(/\s+/g, ' ')
  if (!cleaned) return { city: '', state: '', zipCode: '' }

  // Supports:
  // "BROOKLYN, NY 11229"
  // "BROOKLYN NY 11229"
  // "BROOKLYN NY 11229-1234"
  const m = cleaned.match(/^(.+?)(?:,)?\s+([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/)
  if (!m) return { city: '', state: '', zipCode: '' }

  return {
    city: m[1].trim(),
    state: m[2].trim(),
    zipCode: m[3].trim(),
  }
}

function splitAddress(address?: string) {
  const lines = (address || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    return { streetLine: '', cityStateZipLine: '' }
  }

  if (lines.length === 1) {
    return { streetLine: lines[0], cityStateZipLine: '' }
  }

  // Street = first line, City/State/Zip = last line (handles multi-line addresses)
  return {
    streetLine: lines[0],
    cityStateZipLine: lines[lines.length - 1],
  }
}

export const letter1058Blueprint: Blueprint = {
  noticeType: 'LETTER_1058',
  family: 'levy_intent',

  build(ctx: LetterContext) {
    const seed = stableSeed([
      ctx.noticeType,
      ctx.taxpayerName,
      ctx.idValue,
      ctx.noticeDate,
    ])

    const { streetLine, cityStateZipLine } = splitAddress(ctx.taxpayerAddress)
    const parsed = parseCityStateZip(cityStateZipLine)

    // Bulletproof fallback: never hard-fail on address parsing.
    const city = parsed.city || '[city]'
    const state = parsed.state || '[state]'
    const zipCode = parsed.zipCode || '[zip]'

    const result = composeLevyIntentLetter({
      taxpayerInfo: {
        fullName: ctx.taxpayerName,
        address: streetLine || ctx.taxpayerAddress || '',
        city,
        state,
        zipCode,
        last4SSN: ctx.idValue,
      },
      irsAddress: {
        name: 'Internal Revenue Service',
        street: 'Stop 2800',
        cityStateZip: 'Ogden, UT 84201',
      },
      noticeType: LevyNoticeType.LETTER_1058,
      noticeDate: ctx.noticeDate || '',
      taxPeriods: ctx.taxYear ? [ctx.taxYear] : [],
      assessedBalance: ctx.amount || '',
      responseDeadline: ctx.deadline,
      cdpDeadline: ctx.deadline,
      responsePosture: (ctx as any).responsePosture || 'CDP_HEARING',
      collectionAlternativeType: (ctx as any).collectionAlternativeType,
      disputeBasis: (ctx as any).disputeBasis,
      includeAuthority: ctx.includeReferences,
    })

    if (!result.success) {
      throw new Error(
        `Letter 1058 composition failed: ${result.errors.join(', ')}`
      )
    }

    const output = result.output

    const assembled: Section[] = [
      ...globalSections(seed, ctx),
      { heading: 'Purpose', body: output.purpose },
      { heading: 'Taxpayer Information', body: output.taxpayerInformation },
      { heading: 'Notice Identification', body: output.noticeIdentification },
      { heading: 'Response Posture', body: output.responsePosture },
      { heading: 'Requested Actions', body: output.requestedActions },
      { heading: 'Enclosures', body: output.enclosuresChecklist },
    ]

    if (output.authority) {
      assembled.push({
        heading: 'Applicable Authority',
        body: output.authority,
      })
    }

    const sections = enforceAuthorityLastOnce(
      assembled,
      Boolean(ctx.includeReferences)
    )

    return {
      reLine: `Letter 1058 – Final Notice of Intent to Levy – Tax Year ${
        ctx.taxYear || '[year]'
      } – ${ctx.idValue || '[ID]'}`,
      taxpayerBlock: `Taxpayer: ${ctx.taxpayerName}\n${
        ctx.taxpayerAddress || ''
      }`,
      sections: sections.map((s) => ({
        heading: s.heading,
        body: s.body || '',
      })),
      closingBlock: globalClosing(seed, ctx),
      certifiedMail: true,
    }
  },
}
