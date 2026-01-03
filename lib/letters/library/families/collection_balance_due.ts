/**
 * Collection / Balance Due family language
 * Used by: CP14, CP501, CP503, CP504, CP161, CP215
 */

import { pickVariant } from '../../variation'
import type { LetterContext } from '../../blueprints/types'

function normalizePosition(ctx: LetterContext): string {
  const raw = (ctx.position || '').trim()

  if (raw === 'dispute') {
    return `The taxpayer disputes the stated balance due as currently reflected on the account. The taxpayer requests a full review of the account transcript, payment history, and assessment detail to confirm the correct liability and to ensure all payments, credits, and offsets have been properly applied.`
  }

  if (raw === 'already_paid') {
    return `The taxpayer asserts the balance has already been paid and/or satisfied through prior payments and/or credits. The taxpayer requests that the Service research the payment application and confirm proper posting to the correct tax period and account module.`
  }

  if (raw === 'request_time_to_pay') {
    return `The taxpayer is actively working toward resolution and requests time to pay or other appropriate collection alternative. The taxpayer requests that the Service consider an installment agreement and/or other collection alternatives based on the taxpayer’s current financial circumstances.`
  }

  return (
    raw ||
    `The taxpayer requests that the Service review the balance due, confirm the underlying assessment, and ensure the account accurately reflects all payments, credits, and adjustments.`
  )
}

function buildStatusAndFacts(ctx: LetterContext): string {
  const parts: string[] = []

  if (ctx.priorActions && ctx.priorActions.trim()) {
    parts.push(
      `Prior Payments / Actions Taken:\n${ctx.priorActions.trim()}\n\nThe taxpayer requests that the Service confirm all listed items have been received, properly logged, and accurately applied to the account.`
    )
  } else {
    parts.push(
      `The taxpayer requests verification of the account’s current status, including any pending adjustments, unapplied payments, offsets, or processing delays that may affect the balance shown on the notice.`
    )
  }

  if (ctx.explanation && ctx.explanation.trim()) {
    parts.push(
      `Additional Facts / Explanation:\n${ctx.explanation.trim()}\n\nThese facts are provided to assist the Service in evaluating the account and determining the correct liability and appropriate next steps.`
    )
  }

  return parts.join('\n\n')
}

export function collectionFamilySections(
  seed: string,
  ctx: LetterContext
): Array<{ heading?: string; body: string }> {
  const sections: Array<{ heading?: string; body: string }> = []

  sections.push({
    heading: 'Background',
    body: pickVariant(seed + '_background', [
      `The notice reflects an outstanding balance of ${ctx.amount || '[amount]'} for tax year ${ctx.taxYear || '[year]'}. This correspondence addresses the balance and requests that the Service verify the assessment detail, payment application, and any associated penalties and interest calculations.`,
      `The referenced notice reports a balance due of ${ctx.amount || '[amount]'} for tax year ${ctx.taxYear || '[year]'}. The taxpayer requests an account-level review to confirm the correctness of the liability and to ensure all payments and credits have been properly applied.`,
      `According to the notice, a balance of ${ctx.amount || '[amount]'} remains due for tax year ${ctx.taxYear || '[year]'}. The taxpayer submits this response to clarify the taxpayer’s position and to request appropriate action by the Service to confirm the correct account status.`,
    ]),
  })

  sections.push({
    heading: 'Taxpayer Position',
    body: normalizePosition(ctx),
  })

  sections.push({
    heading: 'Account Status and Supporting Information',
    body: buildStatusAndFacts(ctx),
  })

  sections.push({
    heading: 'Resolution and Next Steps',
    body: pickVariant(seed + '_resolution', [
      `The taxpayer requests that the Service: (1) confirm the underlying assessment basis and posting dates; (2) confirm all payments/credits are posted to the correct period; (3) provide a written itemization of penalties and interest, including computation periods; and (4) advise what specific documentation, if any, is required to finalize resolution.`,
      `The taxpayer requests written clarification of the account components (tax, penalty, interest) and confirmation that all credits and payments have been applied correctly. If the Service believes the balance remains due after review, the taxpayer requests a written explanation identifying the basis for the remaining balance and the records relied upon.`,
      `The taxpayer requests an account review to verify accuracy and to identify the most appropriate resolution path. If collection alternatives are appropriate, the taxpayer requests guidance on the next steps and any required forms or financial documentation needed to proceed.`,
    ]),
  })

  return sections
}

export function collectionRequestedActions(
  seed: string,
  ctx: LetterContext
): { heading?: string; body: string } {
  const actions: string[] = [
    'Confirm receipt of this correspondence in writing and associate it with the correct tax period and account module',
    'Review the account transcript and provide a written explanation of the balance components (tax, penalties, interest) and the basis for each',
    'Verify that all payments, credits, offsets, and adjustments have been properly applied to the correct period',
    'Suspend active collection activity while the Service reviews this submission and updates the account as appropriate',
    'Provide a written response addressing the taxpayer’s position and the specific items raised herein',
  ]

  if (ctx.deadline && ctx.deadline.trim()) {
    actions.push(
      `Extend any applicable response deadline to allow sufficient time for review and written response (current deadline noted as ${ctx.deadline.trim()})`
    )
  }

  if ((ctx.position || '').trim() === 'request_time_to_pay') {
    actions.push(
      'Provide instructions for establishing an installment agreement or other collection alternative and specify required documentation'
    )
  }

  const formatted = actions.map((a, i) => `${i + 1}. ${a}`).join('\n')

  return {
    heading: 'Requested Action',
    body: pickVariant(seed + '_requested', [
      `The taxpayer respectfully requests that the Service take the following actions:\n\n${formatted}`,
      `To resolve this matter promptly and accurately, the taxpayer requests the following:\n\n${formatted}`,
      `The taxpayer requests that the Service complete the following steps and respond in writing:\n\n${formatted}`,
    ]),
  }
}
