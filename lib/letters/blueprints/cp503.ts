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
    
    const sections = [
      // GLOBAL sections (required)
      ...globalSections(seed, ctx),
      
      // FAMILY sections
      ...collectionFamilySections(seed, ctx),
      
      // NOTICE-SPECIFIC sections
      {
        heading: 'Third Notice Response',
        body: `This letter responds to the third balance due notice (CP503). The taxpayer continues to address this matter actively. ${ctx.priorActions || 'Previous correspondence and actions are detailed in prior submissions.'}`
      },
      
      {
        heading: 'Current Status',
        body: ctx.explanation || 'The taxpayer provides the following current status and relevant updates for the Service\'s consideration.'
      },
      
      // Requested actions
      collectionRequestedActions(seed, ctx),
    ]
    
    return {
      reLine: `CP503 Third Notice - Tax Year ${ctx.taxYear || '[year]'} - ${ctx.idValue || '[ID]'}`,
      taxpayerBlock: `Taxpayer: ${ctx.taxpayerName}\n${ctx.taxpayerAddress || ''}`,
      sections,
      closingBlock: globalClosing(seed, ctx),
      certifiedMail: true,
    }
  }
}