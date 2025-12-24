/**
 * CP14 Blueprint - First balance due notice
 */

import type { Blueprint, LetterContext } from './types'
import { stableSeed } from '../variation'
import { globalSections, globalClosing } from '../library/global'
import { collectionFamilySections, collectionRequestedActions } from '../library/families/collection_balance_due'

export const cp14Blueprint: Blueprint = {
  noticeType: 'CP14',
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
        heading: 'Initial Notice Response',
        body: `This is the taxpayer's response to the initial balance due notice (CP14). The taxpayer acknowledges receipt and provides the following information for the Service's review.`
      },
      
      // Requested actions
      collectionRequestedActions(seed, ctx),
    ]
    
    return {
      reLine: `CP14 Notice - Tax Year ${ctx.taxYear || '[year]'} - ${ctx.idValue || '[ID]'}`,
      taxpayerBlock: `Taxpayer: ${ctx.taxpayerName}\n${ctx.taxpayerAddress || ''}`,
      sections,
      closingBlock: globalClosing(seed, ctx),
      certifiedMail: false,
    }
  }
}