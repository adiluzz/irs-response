/**
 * Letter composer - pure formatting logic, zero prose
 */

export type LetterSection = {
  heading?: string
  body: string
}

export type ComposeLetterInput = {
  todayISO?: string
  certifiedMail?: boolean
  irsToLine?: string
  reLine: string
  taxpayerBlock: string
  salutation?: string
  sections: LetterSection[]
  closingBlock: string
}

export function composeLetter(input: ComposeLetterInput): string {
  const {
    todayISO,
    certifiedMail = false,
    irsToLine = 'Internal Revenue Service',
    reLine,
    taxpayerBlock,
    salutation = 'Dear Sir or Madam:',
    sections,
    closingBlock,
  } = input

  const blocks: string[] = []

  // Date
  const date = todayISO || new Date().toISOString().split('T')[0]
  blocks.push(date)

  // Certified mail indicator
  if (certifiedMail) {
    blocks.push('VIA CERTIFIED MAIL')
  }

  // IRS address
  blocks.push(irsToLine)

  // Re: line
  blocks.push(`Re: ${reLine}`)

  // Taxpayer block
  blocks.push(taxpayerBlock)

  // Salutation
  blocks.push(salutation)

  // Sections
  for (const section of sections) {
    if (section.heading) {
      blocks.push(section.heading.toUpperCase())
    }
    blocks.push(section.body)
  }

  // Closing
  blocks.push(closingBlock)

  // Join with blank lines
  return blocks.join('\n\n')
}