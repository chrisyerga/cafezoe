export type PetDraft = {
  name: string
  species?: string
  breed?: string
  bio?: string
  traits?: Array<string>
}

export const cafeZoeBrand = {
  name: 'CafeZoe',
  domain: 'cafezoe.lol',
  tagline: 'Pet content with a little character.',
} as const

export function splitTraits(input: string): Array<string> {
  return input
    .split(',')
    .map((trait) => trait.trim())
    .filter(Boolean)
}
