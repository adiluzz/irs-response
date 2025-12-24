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
    
    const sections = [
      // GLOBAL sections (required)
      ...globalSections(seed, ctx),
      
      // FAMILY sections
      ...underreporterFamilySections(seed, ctx),
      
      // NOTICE-SPECIFIC sections
      {
        heading: 'Documentation Provided',
        body: `The taxpayer provides supporting documentation to substantiate the return as filed. This documentation demonstrates that the return accurately reported all income and that the proposed changes are not warranted.`
      },
      
      {
        heading: 'Reconciliation',
        body: ctx.explanation || 'A detailed reconciliation of the alleged discrepancies is provided. The taxpayer demonstrates that no additional tax is due and that the return was accurate and complete as originally filed.'
      },
      
      // Requested actions
      underreporterRequestedActions(seed, ctx),
    ]
    
    return {
      reLine: `CP2000 Underreporter Notice - Tax Year ${ctx.taxYear || '[year]'} - ${ctx.idValue || '[ID]'}`,
      taxpayerBlock: `Taxpayer: ${ctx.taxpayerName}\n${ctx.taxpayerAddress || ''}`,
      sections,
      closingBlock: globalClosing(seed, ctx),
      certifiedMail: true,
    }
  }
}