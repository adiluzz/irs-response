/**
 * Deterministic variation - same inputs always produce same output
 */

/**
 * Generate a stable seed from context parts
 */
export function stableSeed(parts: Array<string | undefined | null>): string {
  const cleaned = parts.filter((p): p is string => p != null && p !== '')
  const joined = cleaned.join('|')
  
  // Simple deterministic hash
  let hash = 0
  for (let i = 0; i < joined.length; i++) {
    const char = joined.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36)
}

/**
 * Pick a variant from options using seed
 */
export function pickVariant(seed: string, options: string[]): string {
  if (options.length === 0) return ''
  if (options.length === 1) return options[0]
  
  // Convert seed to number
  let num = 0
  for (let i = 0; i < seed.length; i++) {
    num = num * 36 + parseInt(seed[i], 36)
  }
  
  return options[num % options.length]
}