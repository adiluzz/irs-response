/**
 * CP503 Blueprint - Third balance due notice
 */

import type { Blueprint, LetterContext } from './types'
import { stableSeed } from '../variation'
import { globalSections, globalClosing } from '../library/global'
import { collectionFamilySections, collectionRequestedActions } from '../library/families/collection_balance_due'

export const cp503Blueprint: Blueprint = {
  noticeType: 'CP503',
  family: 'collection_balance_due',

  build(ctx: LetterContext) {
    const seed = stableSeed([ctx.noticeType, ctx.taxpayerName, ctx.idValue, ctx.noticeDate])

    const positionText = ctx.position ? `Position: ${ctx.position}` : ''
    const reasonText = ctx.balanceDueReason ? `Balance Due Reason: ${ctx.balanceDueReason}` : ''

    const statusLines = [positionText, reasonText].filter(Boolean).join('\n')
    const statusBody = statusLines || 'The taxpayer provides their position and reason for the balance due matter in this submission.'

    const explanationBody =
      ctx.explanation && ctx.explanation.trim() !== ''
        ? ctx.explanation
        : 'No additional explanation was provided in this submission.'

    const priorActionsBody =
      ctx.priorActions && ctx.priorActions.trim() !== ''
        ? ctx.priorActions
        : 'No prior actions were provided in this submission.'

    const urgencyBody =
      ctx.deadline && ctx.deadline.trim() !== ''
        ? `This response is submitted in advance of the stated deadline: ${ctx.deadline}.`
        : 'No specific response deadline was provided in this submission.'

    const sections = [
      // GLOBAL sections (required)
      ...globalSections(seed, ctx),

      // FAMILY sections
      ...collectionFamilySections(seed, ctx),

      // NOTICE-SPECIFIC sections (deterministic)
      {
        heading: 'Notice Stage and Purpose',
        body:
          `This submission responds to the CP503 (third balance due) notice.` +
          (ctx.noticeDate ? ` Notice Date: ${ctx.noticeDate}.` : ''),
      },
      {
        heading: 'Urgency and Timing',
        body: urgencyBody,
      },
      {
        heading: 'Taxpayer Position and Balance Due Reason',
        body: statusBody,
      },
      {
        heading: 'Explanation',
        body: explanationBody,
      },
      {
        heading: 'Prior Actions',
        body: priorActionsBody,
      },

      // Requested actions (family)
      collectionRequestedActions(seed, ctx),
    ]

    return {
      reLine: `CP503 - Third Balance Due Notice - Tax Year ${ctx.taxYear || '[year]'} - ${ctx.idValue || '[ID]'}`,
      taxpayerBlock: `Taxpayer: ${ctx.taxpayerName}\n${ctx.taxpayerAddress || ''}`,
      sections,
      closingBlock: globalClosing(seed, ctx),
      certifiedMail: true,
    }
  },
}
