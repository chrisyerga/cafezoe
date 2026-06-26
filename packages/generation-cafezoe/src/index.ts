import type { Brief, Entity, GenerationRequest, Persona, Style } from '@lindale/generation-core'

type CafeZoeId = string

export type CafeZoePetRecord = {
  _id: CafeZoeId
  name: string
  species?: string
  breed?: string
  bio?: string
  traits?: Array<string>
  avatarAssetId?: CafeZoeId
}

export type CafeZoeContentIdeaRecord = {
  _id?: CafeZoeId
  petId: CafeZoeId
  title?: string
  prompt: string
  channel?: 'instagram' | 'tiktok' | 'blog' | 'newsletter' | 'general'
  mood?: string
}

export type CafeZoeVoiceRecord = {
  _id: CafeZoeId
  slug: string
  name: string
  tagline?: string
  promptFragments: Array<string>
  textModel?: string
}

export type CafeZoeStyleRecord = {
  _id: CafeZoeId
  slug: string
  name: string
  kind: 'text' | 'image' | 'multimodal'
  description?: string
  promptFragment?: string
}

export function petToEntity(pet: CafeZoePetRecord): Entity {
  return {
    id: pet._id,
    kind: 'pet',
    name: pet.name,
    description: pet.bio,
    relationship: 'content subject',
    traits: pet.traits,
    visualDescription: [pet.species, pet.breed].filter(Boolean).join(', ') || undefined,
    referenceAssets: pet.avatarAssetId
      ? [
          {
            id: pet.avatarAssetId,
            role: 'avatar',
          },
        ]
      : undefined,
    metadata: {
      sourceTable: 'pets',
      species: pet.species,
      breed: pet.breed,
    },
  }
}

export function voiceToPersona(voice: CafeZoeVoiceRecord): Persona {
  return {
    id: voice._id,
    slug: voice.slug,
    name: voice.name,
    kind: 'implicit_voice',
    artificial: true,
    tagline: voice.tagline,
    promptFragments: voice.promptFragments,
    modelPreferences: {
      text: voice.textModel,
    },
    metadata: {
      sourceTable: 'contentVoices',
    },
  }
}

export function styleToCoreStyle(style: CafeZoeStyleRecord): Style {
  return {
    id: style._id,
    slug: style.slug,
    name: style.name,
    kind: style.kind,
    description: style.description,
    promptFragment: style.promptFragment,
    metadata: {
      sourceTable: 'contentStyles',
    },
  }
}

export function contentIdeaToBrief(idea: CafeZoeContentIdeaRecord, pet: CafeZoePetRecord): Brief {
  return {
    id: idea._id,
    title: idea.title ?? `${pet.name} content idea`,
    prompt: idea.prompt,
    catalyst: {
      kind: idea.channel === 'blog' ? 'manual_prompt' : 'topic',
      description: idea.prompt,
      metadata: {
        channel: idea.channel ?? 'general',
        mood: idea.mood,
      },
    },
    audience: 'Pet lovers who enjoy warm, specific, personality-rich animal stories and social posts.',
    variables: {
      petName: pet.name,
      contentPrompt: idea.prompt,
    },
    metadata: {
      sourceTable: 'contentIdeas',
      petId: idea.petId,
      channel: idea.channel ?? 'general',
    },
  }
}

export function defaultCafeZoeVoice(): CafeZoeVoiceRecord {
  return {
    _id: 'cafezoe-house-voice',
    slug: 'cafezoe-house',
    name: 'CafeZoe House Voice',
    tagline: 'Tender, specific, lightly funny pet storytelling.',
    promptFragments: [
      'Write with concrete details, a little wit, and genuine affection.',
      'Avoid generic influencer language, hashtags unless requested, and sentimental overreach.',
      'Make the pet feel like a specific character with habits, preferences, and tiny contradictions.',
    ],
  }
}

export function defaultCafeZoeTextStyle(): CafeZoeStyleRecord {
  return {
    _id: 'warm-social-caption',
    slug: 'warm-social-caption',
    name: 'Warm Social Caption',
    kind: 'text',
    promptFragment: 'Keep the copy concise, visual, and easy to post. Lead with the pet, not the brand.',
  }
}

export function buildPetSocialPostRequest(args: {
  pet: CafeZoePetRecord
  idea: CafeZoeContentIdeaRecord
  voice?: CafeZoeVoiceRecord
  styles?: Array<CafeZoeStyleRecord>
}): GenerationRequest {
  return {
    project: {
      id: args.pet._id,
      kind: 'social_account',
      name: `${args.pet.name}'s CafeZoe feed`,
      description: args.pet.bio,
      metadata: {
        sourceTable: 'pets',
      },
    },
    brief: contentIdeaToBrief(args.idea, args.pet),
    entities: [petToEntity(args.pet)],
    persona: voiceToPersona(args.voice ?? defaultCafeZoeVoice()),
    styles: (args.styles?.length ? args.styles : [defaultCafeZoeTextStyle()]).map(styleToCoreStyle),
    output: {
      kind: 'social_post',
      text: {
        format: 'markdown',
        wordTarget: 110,
        schemaHint: 'Return caption, optional hook, and 3-5 tasteful hashtag suggestions.',
      },
    },
    constraints: [
      'Do not claim medical, behavioral, or factual details that were not provided.',
      'Make the post feel ready for a pet owner to personalize before publishing.',
    ],
  }
}

export function buildPetBlogPostRequest(args: {
  pet: CafeZoePetRecord
  idea: CafeZoeContentIdeaRecord
  voice?: CafeZoeVoiceRecord
  styles?: Array<CafeZoeStyleRecord>
}): GenerationRequest {
  return {
    ...buildPetSocialPostRequest(args),
    output: {
      kind: 'blog_post',
      text: {
        format: 'markdown',
        wordTarget: 650,
        schemaHint: 'Return title, excerpt, bodyMarkdown, and suggested social teaser.',
      },
      image: {
        count: 1,
        aspectRatio: '1:1',
        noText: true,
      },
    },
  }
}
