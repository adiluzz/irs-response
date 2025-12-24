/**
 * Form 843 Blueprint - Claim for refund/abatement
 */

import type { Blueprint, LetterContext } from './types'
import { stableSeed } from '../variation'
import { globalSections, globalClosing } from '../library/global'
import { generalCorrespondenceSections, generalCorrespondenceRequestedActions } from '../library/families/general_correspondence'

export const form843Blueprint: Blueprint = {
  noticeType: 'FORM_843',
  family: 'general_correspondence',
  
  build(ctx: LetterContext) {
    const seed = stableSeed([ctx.noticeType, ctx.taxpayerName, ctx.idValue, ctx.noticeDate])
    
    const sections = [
      // GLOBAL sections (required)
      ...globalSections(seed, ctx),
      
      // FAMILY sections
      ...generalCorrespondenceSections(seed, ctx),
      
      // NOTICE-SPECIFIC sections
      {
        heading: 'Claim for Refund or Abatement',
        body: `This correspondence accompanies Form 843, Claim for Refund and Request for Abatement, for tax year ${ctx.taxYear || '[year]'}. The claim seeks ${ctx.amount || '[amount]'} based on the grounds described below.`
      },
      
      {
        heading: 'Basis for Claim',
        body: ctx.explanation || 'The taxpayer submits this claim based on reasonable cause and provides supporting documentation. The facts demonstrate that the amount claimed should be refunded or abated.'
      },
      
      {
        heading: 'Supporting Facts',
        body: `The taxpayer was not negligent and acted in good faith. The circumstances giving rise to this claim were beyond the taxpayer's control and could not have been reasonably anticipated or prevented through ordinary care and prudence.`
      },
      
      // Requested actions
      generalCorrespondenceRequestedActions(seed, ctx),
    ]
    
    return {
      reLine: `Form 843 Claim - Tax Year ${ctx.taxYear || '[year]'} - ${ctx.idValue || '[ID]'}`,
      taxpayerBlock: `Taxpayer: ${ctx.taxpayerName}\n${ctx.taxpayerAddress || ''}`,
      sections,
      closingBlock: globalClosing(seed, ctx),
      certifiedMail: false,
    }
  }
}