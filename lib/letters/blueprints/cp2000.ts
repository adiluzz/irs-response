/**
 * CP2000 Blueprint - Underreporter notice
 */

import type { Blueprint, LetterContext } from './types'
import { stableSeed } from '../variation'
import { globalSections, globalClosing } from '../library/global'
import { underreporterFamilySections, underreporterRequestedActions } from '../library/families/underreporter_exam'

export const cp2000Blueprint: Blueprint = {
  noticeType: 'CP2000',
  family: 'underreporter_exam',

  build(ctx: LetterContext) {
    const seed = stableSeed([ctx.noticeType, ctx.taxpayerName, ctx.idValue, ctx.noticeDate])

    const positionBody =
      ctx.position && ctx.position.trim() !== ''
        ? `Position: ${ctx.position}`
        : 'No position was provided in this submission.'

    const explanationBody =
      ctx.explanation && ctx.explanation.trim() !== ''
        ? ctx.explanation
        : 'No additional explanation was provided in this submission.'

    const priorActionsBody =
      ctx.priorActions && ctx.priorActions.trim() !== ''
        ? ctx.priorActions
        : 'No prior actions were provided in this submission.'

    const deadlineBody =
      ctx.deadline && ctx.deadline.trim() !== ''
        ? `This response is submitted in advance of the stated deadline: ${ctx.deadline}.`
        : 'No specific response deadline was provided in this submission.'

    const sections = [
      // GLOBAL sections (required)
      ...globalSections(seed, ctx),

      // FAMILY sections
      ...underreporterFamilySections(seed, ctx),

      // NOTICE-SPECIFIC sections (deterministic / non-hallucinatory)
      {
        heading: 'Notice Stage and Purpose',
        body:
          `This submission responds to the CP2000 (underreporter) notice.` +
          (ctx.noticeDate ? ` Notice Date: ${ctx.noticeDate}.` : ''),
      },
      {
        heading: 'Urgency and Timing',
        body: deadlineBody,
      },
      {
        heading: 'Taxpayer Position',
        body: positionBody,
      },
      {
        heading: 'Reconciliation / Explanation',
        body: explanationBody,
      },
      {
        heading: 'Documentation Provided',
        body:
          'The taxpayer submits supporting documentation with this response. ' +
          'Documentation is intended to support the statements in this submission and to assist the Service in reviewing the proposed changes.',
      },
      {
        heading: 'Prior Actions',
        body: priorActionsBody,
      },

      // Requested actions (family)
      underreporterRequestedActions(seed, ctx),
    ]

    return {
      reLine: `CP2000 - Underreporter Notice - Tax Year ${ctx.taxYear || '[year]'} - ${ctx.idValue || '[ID]'}`,
      taxpayerBlock: `Taxpayer: ${ctx.taxpayerName}\n${ctx.taxpayerAddress || ''}`,
      sections,
      closingBlock: globalClosing(seed, ctx),
      certifiedMail: true,
    }
  },
}
