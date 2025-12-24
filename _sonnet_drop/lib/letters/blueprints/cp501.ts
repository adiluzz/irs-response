/**
 * CP501 Blueprint - Second balance due notice
 */

import type { Blueprint, LetterContext } from './types'
import { stableSeed } from '../variation'
import { globalSections, globalClosing } from '../library/global'
import { collectionFamilySections, collectionRequestedActions } from '../library/families/collection_balance_due'

export const cp501Blueprint: Blueprint = {
  noticeType: 'CP501',
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
        heading: 'Second Notice Response',
        body: `This correspondence responds to the second balance due notice (CP501). ${ctx.priorActions || 'The taxpayer has been working to address this matter and provides updated information.'}`
      },
      
      // Requested actions
      collectionRequestedActions(seed, ctx),
    ]
    
    return {
      reLine: `CP501 Second Notice - Tax Year ${ctx.taxYear || '[year]'} - ${ctx.idValue || '[ID]'}`,
      taxpayerBlock: `Taxpayer: ${ctx.taxpayerName}\n${ctx.taxpayerAddress || ''}`,
      sections,
      closingBlock: globalClosing(seed, ctx),
      certifiedMail: false,
    }
  }
}