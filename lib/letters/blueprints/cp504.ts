/**
 * CP504 Blueprint - Final notice before levy
 */

import type { Blueprint, LetterContext } from './types'
import { stableSeed } from '../variation'
import { globalSections, globalClosing } from '../library/global'
import { collectionFamilySections, collectionRequestedActions } from '../library/families/collection_balance_due'

export const cp504Blueprint: Blueprint = {
  noticeType: 'CP504',
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
        heading: 'Final Notice Response',
        body: `This correspondence responds to the CP504 final notice of intent to levy. The taxpayer takes this matter seriously and submits this response prior to the ${ctx.deadline || '[deadline]'} deadline.`
      },
      
      {
        heading: 'Request for Collection Hold',
        body: `Given the serious nature of potential levy action, the taxpayer requests an immediate hold on collection activity pending review of this submission. ${ctx.explanation || 'Additional context and documentation are provided for consideration.'}`
      },
      
      // Enhanced requested actions
      {
        heading: 'Requested Action',
        body: `The taxpayer urgently requests:\n\n1. Immediate suspension of all levy action\n2. Extension of the response deadline if additional time is needed\n3. Consideration of alternative resolution options including installment agreement or currently not collectible status\n4. Written confirmation of collection hold\n5. Assignment of a specific contact person for this matter`
      },
    ]
    
    return {
      reLine: `CP504 Final Notice - Intent to Levy - Tax Year ${ctx.taxYear || '[year]'} - ${ctx.idValue || '[ID]'}`,
      taxpayerBlock: `Taxpayer: ${ctx.taxpayerName}\n${ctx.taxpayerAddress || ''}`,
      sections,
      closingBlock: globalClosing(seed, ctx),
      certifiedMail: true,
    }
  }
}