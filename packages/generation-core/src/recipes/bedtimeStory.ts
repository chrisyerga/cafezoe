import type { Entity, GenerationRequest, Persona, Style } from '../types'

export type BedtimeStoryRecipeArgs = {
  title?: string
  premise: string
  childAudience?: string
  characters: Array<Entity>
  narrator?: Persona
  styles?: Array<Style>
  wordTarget?: number
  includeImages?: boolean
  includeAudio?: boolean
}

export function createBedtimeStoryRequest(args: BedtimeStoryRecipeArgs): GenerationRequest {
  return {
    brief: {
      title: args.title ?? 'Bedtime story',
      prompt: args.premise,
      audience: args.childAudience ?? 'A young child getting ready for sleep.',
      catalyst: {
        kind: 'manual_prompt',
        description: args.premise,
      },
      safety: {
        rating: 'child_safe',
        constraints: [
          'No frightening peril, cruelty, gore, or adult themes.',
          'Use soothing language and resolve tension gently.',
          'End with a calm, sleep-friendly closing beat.',
        ],
      },
    },
    entities: args.characters,
    persona: args.narrator,
    styles: args.styles,
    output: {
      kind: args.includeAudio ? 'multimodal' : 'story',
      text: {
        format: 'markdown',
        wordTarget: args.wordTarget ?? 650,
        schemaHint: 'Return a title and story body suitable for read-aloud narration.',
      },
      image: args.includeImages
        ? {
            count: 1,
            aspectRatio: '1:1',
            noText: true,
          }
        : undefined,
      audio: args.includeAudio
        ? {
            narration: true,
            format: 'mp3',
          }
        : undefined,
    },
    constraints: [
      'Keep the story concrete and visual.',
      'Make every named character feel distinct.',
      'Prefer short paragraphs for mobile reading.',
    ],
  }
}
