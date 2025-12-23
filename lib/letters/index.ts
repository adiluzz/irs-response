/**
 * Main letter engine export
 */

export { composeLetter } from './compose'
export type { ComposeLetterInput, LetterSection } from './compose'

export { stableSeed, pickVariant } from './variation'

export { getBlueprint, blueprintRegistry } from './blueprints'
export type { Blueprint, LetterContext, NoticeType, NoticeFamily } from './blueprints/types'