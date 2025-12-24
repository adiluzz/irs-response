/**
 * CP2000 Blueprint - Underreporter notice
 */

import type { Blueprint, LetterContext } from './types'
import { stableSeed } from '../variation'
import { globalSections, globalClosing } from '../library/global'
import {
  underreporterFamilySections,
  underreporterRequestedActions,
} from '../library/families/underreporter_exam'

type Section = { heading: string; body?: string }

function normalizeHeading(h: string) {
  return (h || '').trim().toLowerCase()
}

function isAuthorityOrReferencesHeading(h: string) {
  const x = normalizeHeading(h)
  // Catches: "Applicable Authority", "Legal and Administrative Authority", "References", etc.
  return x.includes('authority') || x.includes('references')
}

/**
 * Ensures:
 * - If includeReferences=false: no authority/references sections appear at all
 * - If includeReferences=true: exactly ONE authority/references section appears, and it is ALWAYS LAST
 * - Dedupes by merging bodies if multiple authority sections exist
 */
function enforceAuthorityLastOnce(sections: Section[], includeReferences: boolean): Section[] {
  if (!Array.isArray(sections)) return []

  const nonRef: Section[] = []
  const ref: Section[] = []

  for (const s of sections) {
    if (!s || typeof s.heading !== 'string') continue
    if (isAuthorityOrReferencesHeading(s.heading)) ref.push(s)
    else nonRef.push(s)
  }

  if (!includeReferences) {
    return nonRef
  }

  if (ref.length === 0) {
    return nonRef
  }

  const mergedBody = ref
    .map((s) => (s.body || '').trim())
    .filter(Boolean)
    .join('\n\n')

  // Keep the last heading we saw (usually the most specific one)
  const lastHeading = (ref[ref.length - 1]?.heading || 'Applicable Authority').trim()

  const finalRef: Section = {
    heading: lastHeading,
    body: mergedBody,
  }

  return [...nonRef, finalRef]
}

export const cp2000Blueprint: Blueprint = {
  noticeType: 'CP2000',
  family: 'underreporter_exam',

  build(ctx: LetterContext) {
    const seed = stableSeed([ctx.noticeType, ctx.taxpayerName, ctx.idValue, ctx.noticeDate])

    const assembled: Section[] = [
      // GLOBAL sections (required)
      ...globalSections(seed, ctx),

      // FAMILY sections
      ...underreporterFamilySections(seed, ctx),

      // NOTICE-SPECIFIC sections
      {
        heading: 'Documentation Provided',
        body: `The taxpayer provides supporting documentation to substantiate the return as filed. This documentation demonstrates that the return accurately reported all income and that the proposed changes are not warranted.`,
      },

      {
        heading: 'Reconciliation',
        body:
          ctx.explanation ||
          'A detailed reconciliation of the alleged discrepancies is provided. The taxpayer demonstrates that no additional tax is due and that the return was accurate and complete as originally filed.',
      },

      // Requested actions
      underreporterRequestedActions(seed, ctx),
    ]

    // ✅ Hard rule for CP2000: authority/references appear once and always last (only if includeReferences=true)
    const sections = enforceAuthorityLastOnce(assembled, Boolean(ctx.includeReferences))

    return {
      reLine: `CP2000 Underreporter Notice - Tax Year ${ctx.taxYear || '[year]'} - ${ctx.idValue || '[ID]'}`,
      taxpayerBlock: `Taxpayer: ${ctx.taxpayerName}\n${ctx.taxpayerAddress || ''}`,
      sections,
      closingBlock: globalClosing(seed, ctx),
      certifiedMail: true,
    }
  },
}
